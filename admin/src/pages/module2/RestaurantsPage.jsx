import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';

export default function RestaurantsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await request.get('/api/restaurant/admin/list');
      setData(res.data || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ capacity: 0, status: 1 });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name, address: record.address, business_hours: record.businessHours,
      capacity: record.capacity, intro: record.intro, main_image: record.mainImage,
      latitude: record.latitude, longitude: record.longitude, status: record.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await request.put(`/api/restaurant/update/${editing.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/api/restaurant/create', values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData();
    } catch { /* */ }
  };

  const handleDelete = async (id) => {
    try {
      await request.delete(`/api/restaurant/delete/${id}`);
      message.success('删除成功');
      fetchData();
    } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name' },
    { title: '地址', dataIndex: 'address', ellipsis: true },
    { title: '营业时间', dataIndex: 'businessHours', width: 120 },
    { title: '容纳人数', dataIndex: 'capacity', width: 80 },
    { title: '评分', dataIndex: 'avgRating', width: 70, render: (v) => v || '-' },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '营业中' : '停业'}</Tag> },
    {
      title: '操作', width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>餐厅管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增餐厅</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? '编辑餐厅' : '新增餐厅'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="餐厅名称" rules={[{ required: true, message: '请输入餐厅名称' }]}>
            <Input placeholder="如：苗家风味馆" />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input placeholder="餐厅地址" />
          </Form.Item>
          <Form.Item name="business_hours" label="营业时间">
            <Input placeholder="如：10:00-22:00" />
          </Form.Item>
          <Form.Item name="capacity" label="容纳人数">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="main_image" label="主图URL">
            <Input placeholder="主图URL" />
          </Form.Item>
          <Form.Item name="intro" label="餐厅介绍">
            <Input.TextArea rows={3} placeholder="餐厅介绍" />
          </Form.Item>
          <Form.Item name="latitude" label="纬度">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="longitude" label="经度">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <InputNumber min={0} max={1} style={{ width: '100%' }} placeholder="1营业 0停业" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
