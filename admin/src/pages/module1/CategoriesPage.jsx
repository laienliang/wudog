import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';

export default function CategoriesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await request.get('/api/product-category/admin/list');
      setData(res.data || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ sort_order: 0, status: true });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({ name: record.name, icon: record.icon, parent_id: record.parentId, sort_order: record.sortOrder, status: record.status === 1 });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const body = { ...values, status: values.status ? 1 : 0 };
      if (editing) {
        await request.put(`/api/product-category/update/${editing.id}`, body);
        message.success('更新成功');
      } else {
        await request.post('/api/product-category/create', body);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData();
    } catch { /* validation error */ }
  };

  const handleDelete = async (id) => {
    try {
      await request.delete(`/api/product-category/delete/${id}`);
      message.success('删除成功');
      fetchData();
    } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name' },
    { title: '图标', dataIndex: 'icon', render: (v) => v ? <img src={v} alt="" style={{ width: 32, height: 32 }} /> : '-' },
    { title: '父级ID', dataIndex: 'parentId', render: (v) => v || '-' },
    { title: '排序', dataIndex: 'sortOrder', width: 60 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '启用' : '禁用'}</Tag> },
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
        <h2>商品分类管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增分类</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? '编辑分类' : '新增分类'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="如：银饰" />
          </Form.Item>
          <Form.Item name="icon" label="图标URL">
            <Input placeholder="图标URL" />
          </Form.Item>
          <Form.Item name="parent_id" label="父分类ID">
            <InputNumber placeholder="留空为一级分类" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="sort_order" label="排序">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="启用" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
