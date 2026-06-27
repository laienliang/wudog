import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';

export default function ScenicSpotsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await request.get('/api/scenic-spot/admin/list');
      setData(res.data || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name, address: record.address, latitude: record.latitude, longitude: record.longitude,
      open_time: record.openTime, intro: record.intro, main_image: record.mainImage, status: record.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await request.put(`/api/scenic-spot/update/${editing.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/api/scenic-spot/create', values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData();
    } catch { /* */ }
  };

  const handleDelete = async (id) => {
    try { await request.delete(`/api/scenic-spot/delete/${id}`); message.success('删除成功'); fetchData(); } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name', ellipsis: true },
    { title: '地址', dataIndex: 'address', width: 200, ellipsis: true, render: (v) => v || '-' },
    { title: '开放时间', dataIndex: 'openTime', width: 120, render: (v) => v || '-' },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '上架' : '下架'}</Tag> },
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
        <h2>景区管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增景区</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? '编辑景区' : '新增景区'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose width={640}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="景区名称" rules={[{ required: true, message: '请输入名称' }]}><Input placeholder="如：西江千户苗寨" /></Form.Item>
          <Form.Item name="address" label="地址"><Input placeholder="详细地址" /></Form.Item>
          <Form.Item name="latitude" label="纬度"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="longitude" label="经度"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="open_time" label="开放时间"><Input placeholder="如：08:00-17:30" /></Form.Item>
          <Form.Item name="main_image" label="主图URL"><Input placeholder="主图URL" /></Form.Item>
          <Form.Item name="intro" label="景区介绍"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="status" label="状态"><InputNumber min={0} max={1} style={{ width: '100%' }} placeholder="1上架 0下架" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
