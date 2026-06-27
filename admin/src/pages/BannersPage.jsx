import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '../utils/request';

const positions = ['home', 'module1', 'module2', 'module3', 'module4', 'module5'];

export default function BannersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try { const res = await request.get('/admin/banners'); setData(res.data || []); } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ sort_order: 0, status: 1, position: 'home' }); setModalOpen(true); };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title, image_url: record.image_url, link_url: record.link_url,
      position: record.position, sort_order: record.sort_order, status: record.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await request.put(`/admin/banners/${editing.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/admin/banners', values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData();
    } catch { /* */ }
  };

  const handleDelete = async (id) => {
    try { await request.delete(`/admin/banners/${id}`); message.success('删除成功'); fetchData(); } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '图片', dataIndex: 'image_url', width: 100, render: (v) => <img src={v} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} /> },
    { title: '链接', dataIndex: 'link_url', width: 120, ellipsis: true, render: (v) => v || '-' },
    { title: '位置', dataIndex: 'position', width: 100 },
    { title: '排序', dataIndex: 'sort_order', width: 60 },
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
        <h2>轮播图管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增轮播图</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? '编辑轮播图' : '新增轮播图'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose width={560}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题"><Input placeholder="轮播图标题" /></Form.Item>
          <Form.Item name="image_url" label="图片URL" rules={[{ required: true, message: '请输入图片URL' }]}><Input placeholder="https://..." /></Form.Item>
          <Form.Item name="link_url" label="跳转链接"><Input placeholder="点击跳转URL" /></Form.Item>
          <Form.Item name="position" label="展示位置">
            <Select options={positions.map(p => ({ label: p, value: p }))} />
          </Form.Item>
          <Form.Item name="sort_order" label="排序"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="status" label="状态"><InputNumber min={0} max={1} style={{ width: '100%' }} placeholder="1启用 0禁用" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
