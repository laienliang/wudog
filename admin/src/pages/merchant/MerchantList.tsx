/**
 * 商家列表页面
 * 展示平台入驻商家列表，支持搜索、新增、编辑、状态切换（启用/禁用）、删除操作
 * 商家按业务模块分类：非遗商品（衣）、餐饮美食（食）、住宿预订（住）、线路订票（行）
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Select, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import { maskPhone, MODULE_TYPE_MAP } from '../../utils/format';

/** 业务模块选项配置 */
const MODULE_OPTIONS = [
  { label: '非遗商品（衣）', value: 'clothing' },
  { label: '餐饮美食（食）', value: 'food' },
  { label: '住宿预订（住）', value: 'stay' },
  { label: '线路订票（行）', value: 'travel' },
];

/**
 * 商家列表页面组件
 * 提供商家的增删改查和状态切换功能
 */
export default function MerchantListPage() {
  /** 商家列表数据 */
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

  /** 加载商家列表数据 */
  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/merchants/list', { params: { page, pageSize, keyword } });
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
        const res: any = await request.put(`/merchants/update/${editing.id}`, values);
        if (res.code === 200) { message.success('更新成功'); setModalOpen(false); loadData(); }
        else message.error(res.message);
      } else {
        const res: any = await request.post('/merchants/create', values);
        if (res.code === 200) { message.success('创建成功'); setModalOpen(false); loadData(); }
        else message.error(res.message);
      }
    } catch (err: any) { message.error(err?.response?.data?.message || '操作失败'); }
  };

  /**
   * 删除商家
   * @param id - 商家 ID
   */
  const handleDelete = async (id: number) => {
    const res: any = await request.delete(`/merchants/delete/${id}`);
    if (res.code === 200) { message.success('删除成功'); loadData(); }
  };

  /**
   * 切换商家状态（启用/禁用）
   * @param record - 商家记录
   */
  const toggleStatus = async (record: any) => {
    const res: any = await request.put(`/merchants/update/${record.id}`, { status: record.status === 1 ? 0 : 1 });
    if (res.code === 200) { message.success('状态已更新'); loadData(); }
  };

  /** 表格列配置 */
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username' },
    { title: '店铺名称', dataIndex: 'shop_name' },
    { title: '所属模块', dataIndex: 'module_type', render: (v: string) => MODULE_OPTIONS.find(m => m.value === v)?.label || v },
    { title: '联系人', dataIndex: 'contact_name' },
    { title: '联系电话', dataIndex: 'contact_phone', render: (v: string) => maskPhone(v) },
    { title: '状态', dataIndex: 'status', render: (v: number) => v === 1 ? <Tag color="green">正常</Tag> : <Tag color="red">禁用</Tag> },
    { title: '入驻时间', dataIndex: 'joined_at' },
    {
      title: '操作', render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => toggleStatus(record)}>{record.status === 1 ? '禁用' : '启用'}</Button>
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
      <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>商家列表</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="搜索用户名/店铺名" value={keyword} onChange={e => setKeyword(e.target.value)} onPressEnter={onSearch} prefix={<SearchOutlined />} style={{ width: 240 }} />
        <Button type="primary" onClick={onSearch}>搜索</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>新增商家</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }} />
      <Modal title={editing ? '编辑商家' : '新增商家'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="password" label="密码" rules={editing ? [] : [{ required: true }]}><Input.Password placeholder={editing ? '留空不修改' : ''} /></Form.Item>
          <Form.Item name="shop_name" label="店铺名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="module_type" label="所属模块" rules={[{ required: true }]}><Select options={MODULE_OPTIONS} /></Form.Item>
          <Form.Item name="contact_name" label="联系人"><Input /></Form.Item>
          <Form.Item name="contact_phone" label="联系电话"><Input /></Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}><Select options={[{ label: '正常', value: 1 }, { label: '禁用', value: 0 }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
