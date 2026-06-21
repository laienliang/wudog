/**
 * 活动横幅管理页面
 * 展示平台活动横幅列表，支持搜索、新增、编辑、删除操作
 * 活动横幅包含图片、标题、跳转链接、活动时间范围和启用/禁用状态
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, DatePicker, Select, message, Popconfirm, Tag, Image } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import ImageUpload from '../../components/ImageUpload';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

/**
 * 活动横幅管理页面组件
 * 提供活动横幅的增删改查功能，支持图片上传和活动时间设置
 */
export default function BannerListPage() {
  /** 活动横幅列表数据 */
  const [data, setData] = useState<any[]>([]);
  /** 数据总条数 */
  const [total, setTotal] = useState(0);
  /** 当前页码 */
  const [page, setPage] = useState(1);
  /** 每页条数 */
  const [pageSize, setPageSize] = useState(20);
  /** 搜索关键词 */
  const [keyword, setKeyword] = useState('');
  /** 数据加载状态 */
  const [loading, setLoading] = useState(false);
  /** 新增/编辑弹窗显示状态 */
  const [modalOpen, setModalOpen] = useState(false);
  /** 当前编辑的记录，null 表示新增 */
  const [editing, setEditing] = useState<any>(null);
  /** 表单实例 */
  const [form] = Form.useForm();
  /** 上传的图片 URL */
  const [imageUrl, setImageUrl] = useState('');

  /** 加载活动横幅列表数据 */
  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/activity-banners/list', { params: { page, pageSize, keyword } });
      if (res.code === 200) { setData(res.data.list); setTotal(res.data.total); }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [page, pageSize, keyword]);

  /** 搜索操作，重置页码后加载数据 */
  const onSearch = () => { setPage(1); loadData(); };

  /**
   * 打开新增/编辑弹窗
   * @param record - 编辑时传入已有记录，不传则为新增模式
   */
  const openModal = (record?: any) => {
    setEditing(record || null);
    if (record) {
      form.setFieldsValue({
        ...record,
        time_range: record.start_time && record.end_time
          ? [dayjs(record.start_time), dayjs(record.end_time)]
          : undefined,
      });
      setImageUrl(record.image_url || '');
    } else {
      form.resetFields();
      setImageUrl('');
    }
    setModalOpen(true);
  };

  /** 提交表单，校验图片并根据 editing 状态调用新增或编辑接口 */
  const handleSubmit = async () => {
    const values = await form.validateFields();
    values.image_url = imageUrl;
    if (!values.image_url) {
      message.error('请上传图片');
      return;
    }
    const { time_range, ...rest } = values;
    const payload = {
      ...rest,
      start_time: time_range?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      end_time: time_range?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
    };
    try {
      if (editing) {
        const res: any = await request.put(`/activity-banners/update/${editing.id}`, payload);
        if (res.code === 200) { message.success('更新成功'); setModalOpen(false); loadData(); }
        else message.error(res.message);
      } else {
        const res: any = await request.post('/activity-banners/create', payload);
        if (res.code === 200) { message.success('创建成功'); setModalOpen(false); loadData(); }
        else message.error(res.message);
      }
    } catch (err: any) { message.error(err?.response?.data?.message || '操作失败'); }
  };

  /**
   * 删除活动横幅
   * @param id - 横幅 ID
   */
  const handleDelete = async (id: number) => {
    const res: any = await request.delete(`/activity-banners/delete/${id}`);
    if (res.code === 200) { message.success('删除成功'); loadData(); }
  };

  /** 表格列配置 */
  const columns = [
    { title: '标题', dataIndex: 'title' },
    { title: '图片', dataIndex: 'image_url', render: (url: string) => {
      if (!url) return '-';
      return <Image src={url} width={100} height={50} style={{ objectFit: 'cover' }} />;
    }},
    { title: '跳转链接', dataIndex: 'link_url', ellipsis: true },
    { title: '开始时间', dataIndex: 'start_time' },
    { title: '结束时间', dataIndex: 'end_time' },
    { title: '状态', dataIndex: 'status', render: (v: number) => v === 1 ? <Tag color="green">启用</Tag> : <Tag color="default">禁用</Tag> },
    {
      title: '操作', width: 150, fixed: 'right' as const, render: (_: any, record: any) => (
        <Space size="small" wrap>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openModal(record)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>活动横幅管理</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="搜索标题" value={keyword} onChange={e => setKeyword(e.target.value)} onPressEnter={onSearch} prefix={<SearchOutlined />} style={{ width: 240 }} />
        <Button type="primary" onClick={onSearch}>搜索</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>新增横幅</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} scroll={{ x: 'max-content' }}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }} />
      <Modal title={editing ? '编辑横幅' : '新增横幅'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="横幅图片" required>
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
            <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-caption)', marginTop: 4 }}>支持 JPG/PNG/GIF/WebP 格式，不超过 5MB</div>
          </Form.Item>
          <Form.Item name="link_url" label="跳转链接"><Input placeholder="输入跳转链接地址" /></Form.Item>
          <Form.Item name="time_range" label="活动时间"><RangePicker showTime style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}><Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
