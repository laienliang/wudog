/**
 * 商家列表页面
 * 展示平台入驻商家列表，支持搜索、新增、编辑、状态切换（启用/禁用）、
 * 查看详情、强制下线、删除操作（R11-01 商家账号管理）
 * 商家按业务模块分类：非遗商品（衣）、餐饮美食（食）、住宿预订（住）、线路订票（行）
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Select, message, Popconfirm, Tag, Descriptions } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import { maskPhone, MODULE_TYPE_MAP } from '../../utils/format';

/** 业务模块选项配置 */
const MODULE_OPTIONS = [
  { label: '非遗商品（衣）', value: 'clothing' },
  { label: '餐饮美食（食）', value: 'food' },
  { label: '住宿预订（住）', value: 'stay' },
  { label: '线路订票（行）', value: 'travel' },
];

/** 模块名称映射（含详情展示） */
const MODULE_LABEL: Record<string, string> = {
  clothing: '非遗商品（衣）',
  food: '餐饮美食（食）',
  stay: '住宿预订（住）',
  travel: '线路订票（行）',
};

/**
 * 商家列表页面组件
 * 提供商家的增删改查、状态切换、强制下线、查看详情功能
 */
export default function MerchantListPage() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  /** 商家详情弹窗 */
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/merchants/list', { params: { page, pageSize, keyword } });
      if (res.code === 200) { setData(res.data.list); setTotal(res.data.total); }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [page, pageSize]);

  const onSearch = () => { setPage(1); loadData(); };

  const openModal = (record?: any) => {
    setEditing(record || null);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
    setModalOpen(true);
  };

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

  const handleDelete = async (id: number) => {
    const res: any = await request.delete(`/merchants/delete/${id}`);
    if (res.code === 200) { message.success('删除成功'); loadData(); }
  };

  const toggleStatus = async (record: any) => {
    const res: any = await request.put(`/merchants/update/${record.id}`, { status: record.status === 1 ? 0 : 1 });
    if (res.code === 200) { message.success('状态已更新'); loadData(); }
  };

  /** 强制下线操作 */
  const handleForceOffline = async (record: any) => {
    const res: any = await request.post(`/merchants/force-offline/${record.id}`);
    if (res.code === 200) { message.success(res.message || '已强制下线'); loadData(); }
    else message.error(res.message || '操作失败');
  };

  /** 打开商家详情弹窗 */
  const openDetail = async (id: number) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    try {
      const res: any = await request.get(`/merchants/detail/${id}`);
      if (res.code === 200) setDetailData(res.data);
      else message.error('加载详情失败');
    } catch { message.error('加载详情失败'); }
    finally { setDetailLoading(false); }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '用户名', dataIndex: 'username' },
    { title: '店铺名称', dataIndex: 'shop_name' },
    { title: '所属模块', dataIndex: 'module_type', render: (v: string) => MODULE_OPTIONS.find(m => m.value === v)?.label || v },
    { title: '联系人', dataIndex: 'contact_name' },
    { title: '联系电话', dataIndex: 'contact_phone', render: (v: string) => maskPhone(v) },
    { title: '状态', dataIndex: 'status', render: (v: number) => v === 1 ? <Tag color="green">正常</Tag> : <Tag color="red">禁用</Tag> },
    { title: '入驻时间', dataIndex: 'joined_at', width: 170 },
    {
      title: '操作', render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => openDetail(record.id)}>详情</Button>
          <Button type="link" onClick={() => toggleStatus(record)}>{record.status === 1 ? '禁用' : '启用'}</Button>
          <Popconfirm title={`确认将「${record.shop_name}」强制下线？`} onConfirm={() => handleForceOffline(record)}>
            <Button type="link" icon={<StopOutlined />} danger>强制下线</Button>
          </Popconfirm>
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

      {/* 编辑/新增弹窗 */}
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

      {/* 商家详情弹窗 */}
      <Modal
        title="商家详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={<Button onClick={() => setDetailOpen(false)}>关闭</Button>}
        width={640}
        loading={detailLoading}
      >
        {detailData && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="ID">{detailData.id}</Descriptions.Item>
            <Descriptions.Item label="用户名">{detailData.username}</Descriptions.Item>
            <Descriptions.Item label="店铺名称">{detailData.shop_name}</Descriptions.Item>
            <Descriptions.Item label="所属模块">{MODULE_LABEL[detailData.module_type] || detailData.module_type}</Descriptions.Item>
            <Descriptions.Item label="联系人">{detailData.contact_name}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{detailData.contact_phone}</Descriptions.Item>
            <Descriptions.Item label="店铺Logo" span={2}>
              {detailData.logo ? <img src={detailData.logo} alt="Logo" style={{ maxHeight: 80 }} /> : <span style={{ color: '#BFBFBF' }}>未上传</span>}
            </Descriptions.Item>
            <Descriptions.Item label="店铺简介" span={2}>{detailData.description || <span style={{ color: '#BFBFBF' }}>暂无</span>}</Descriptions.Item>
            <Descriptions.Item label="店铺地址" span={2}>{detailData.address || <span style={{ color: '#BFBFBF' }}>暂无</span>}</Descriptions.Item>
            <Descriptions.Item label="状态">
              {detailData.status === 1 ? <Tag color="green">正常</Tag> : <Tag color="red">禁用</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="入驻时间">{detailData.joined_at || <span style={{ color: '#BFBFBF' }}>—</span>}</Descriptions.Item>
            <Descriptions.Item label="最后登录">{detailData.last_login_at || <span style={{ color: '#BFBFBF' }}>从未登录</span>}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{detailData.created_at}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
