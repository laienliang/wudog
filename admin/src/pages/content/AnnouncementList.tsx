/**
 * 公告管理页面
 * 展示平台公告列表，支持搜索、新增、编辑、删除操作
 * 公告可设置为已发布或草稿状态
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Select, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';

/**
 * 公告管理页面组件
 * 提供公告的增删改查功能
 */
export default function AnnouncementListPage() {
  /** 公告列表数据 */
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

  /** 加载公告列表数据 */
  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/announcements/list', { params: { page, pageSize, keyword } });
      if (res.code === 200) { setData(res.data.list); setTotal(res.data.total); }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [page, pageSize]);

  /** 搜索操作，重置页码后加载数据 */
  const onSearch = () => { setPage(1); loadData(); };

  /**
   * 打开新增/编辑弹窗
   * @param record - 编辑时传入已有记录，不传则为新增模式
   */
  const openModal = (record?: any) => {
    setEditing(record || null);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
    setModalOpen(true);
  };

  /** 提交表单，根据 editing 状态决定调用新增或编辑接口 */
  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        const res: any = await request.put(`/announcements/update/${editing.id}`, values);
        if (res.code === 200) { message.success('更新成功'); setModalOpen(false); loadData(); }
        else message.error(res.message);
      } else {
        const payload = { ...values, published_at: new Date().toISOString() };
        const res: any = await request.post('/announcements/create', payload);
        if (res.code === 200) { message.success('创建成功'); setModalOpen(false); loadData(); }
        else message.error(res.message);
      }
    } catch (err: any) { message.error(err?.response?.data?.message || '操作失败'); }
  };

  /**
   * 删除公告
   * @param id - 公告 ID
   */
  const handleDelete = async (id: number) => {
    const res: any = await request.delete(`/announcements/delete/${id}`);
    if (res.code === 200) { message.success('删除成功'); loadData(); }
  };

  /** 表格列配置 */
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '内容', dataIndex: 'content', ellipsis: true, width: 300 },
    { title: '状态', dataIndex: 'status', render: (v: number) => v === 1 ? <Tag color="green">已发布</Tag> : <Tag color="default">草稿</Tag> },
    { title: '发布时间', dataIndex: 'published_at' },
    {
      title: '操作', render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openModal(record)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>公告管理</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="搜索标题" value={keyword} onChange={e => setKeyword(e.target.value)} onPressEnter={onSearch} prefix={<SearchOutlined />} style={{ width: 240 }} />
        <Button type="primary" onClick={onSearch}>搜索</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>新增公告</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }} />
      <Modal title={editing ? '编辑公告' : '新增公告'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true }]}><Input.TextArea rows={6} /></Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}><Select options={[{ label: '已发布', value: 1 }, { label: '草稿', value: 0 }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
