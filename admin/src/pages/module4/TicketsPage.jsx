import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';

export default function TicketsPage() {
  const [data, setData] = useState([]);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [filterSpotId, setFilterSpotId] = useState(null);

  const fetchSpots = async () => {
    try { const res = await request.get('/api/scenic-spot/admin/list'); setSpots(res.data || []); } catch { /* */ }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = filterSpotId ? { spot_id: filterSpotId } : {};
      const res = await request.get('/api/scenic-spot/ticket-type/list', { params });
      setData(res.data || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchSpots(); fetchData(); }, []);
  useEffect(() => { fetchData(); }, [filterSpotId]);

  const openCreate = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ stock: -1, valid_days: 1 }); setModalOpen(true); };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      spot_id: record.spotId, name: record.name, price: record.price,
      stock: record.stock, valid_days: record.validDays, description: record.description, status: record.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await request.put(`/api/scenic-spot/ticket-type/update/${editing.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/api/scenic-spot/ticket-type/create', values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData();
    } catch { /* */ }
  };

  const handleDelete = async (id) => {
    try { await request.delete(`/api/scenic-spot/ticket-type/delete/${id}`); message.success('删除成功'); fetchData(); } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '票种名', dataIndex: 'name' },
    { title: '所属景区', dataIndex: 'spotId', width: 120, render: (v) => spots.find(s => s.id === v)?.name || v },
    { title: '价格', dataIndex: 'price', width: 80, render: (v) => `¥${v}` },
    { title: '库存', dataIndex: 'stock', width: 70, render: (v) => v === -1 ? '不限' : v },
    { title: '有效期(天)', dataIndex: 'validDays', width: 90 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '启用' : '禁用'}</Tag> },
    { title: '操作', width: 160, render: (_, record) => (
      <Space>
        <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
        <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>票种管理</h2>
        <Space>
          <Select placeholder="筛选景区" allowClear style={{ width: 200 }} value={filterSpotId} onChange={(v) => setFilterSpotId(v || null)}
            options={spots.map(s => ({ label: s.name, value: s.id }))} />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增票种</Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? '编辑票种' : '新增票种'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="spot_id" label="所属景区" rules={[{ required: true, message: '请选择景区' }]}>
            <Select options={spots.map(s => ({ label: s.name, value: s.id }))} placeholder="选择景区" />
          </Form.Item>
          <Form.Item name="name" label="票种名称" rules={[{ required: true, message: '请输入名称' }]}><Input placeholder="如：成人票" /></Form.Item>
          <Form.Item name="price" label="售价" rules={[{ required: true, message: '请输入价格' }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="stock" label="库存 (-1不限)"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="valid_days" label="有效期(天)"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="description" label="票种说明"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="status" label="状态"><InputNumber min={0} max={1} style={{ width: '100%' }} placeholder="1启用 0禁用" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
