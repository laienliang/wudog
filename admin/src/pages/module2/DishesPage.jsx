import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tag, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';

export default function DishesPage() {
  const [data, setData] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [filterRestaurantId, setFilterRestaurantId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = filterRestaurantId ? { restaurant_id: filterRestaurantId } : {};
      const [dishRes, restRes] = await Promise.all([
        request.get('/api/restaurant/dish/list', { params }),
        request.get('/api/restaurant/admin/list'),
      ]);
      const restaurants = restRes.data || [];
      setRestaurants(restaurants);
      const nameMap = {};
      restaurants.forEach(r => { nameMap[r.id] = r.name; });
      const dishes = (dishRes.data || []).map(d => ({ ...d, restaurantName: nameMap[d.restaurantId] || '' }));
      setData(dishes);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { fetchData(); }, [filterRestaurantId]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ sort_order: 0, is_signature: false, status: 1 });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      restaurant_id: record.restaurantId, name: record.name, price: record.price,
      image: record.image, intro: record.intro, is_signature: record.isSignature === 1,
      sort_order: record.sortOrder, status: record.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const body = { ...values, is_signature: values.is_signature ? 1 : 0 };
      if (editing) {
        await request.put(`/api/restaurant/dish/update/${editing.id}`, body);
        message.success('更新成功');
      } else {
        await request.post('/api/restaurant/dish/create', body);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData();
    } catch { /* */ }
  };

  const handleDelete = async (id) => {
    try {
      await request.delete(`/api/restaurant/dish/delete/${id}`);
      message.success('删除成功');
      fetchData();
    } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '菜品名', dataIndex: 'name' },
    { title: '所属餐厅', dataIndex: 'restaurantName' },
    { title: '价格', dataIndex: 'price', width: 80, render: (v) => `¥${v}` },
    { title: '招牌', dataIndex: 'isSignature', width: 60, render: (v) => v === 1 ? <Tag color="gold">招牌</Tag> : '-' },
    { title: '排序', dataIndex: 'sortOrder', width: 60 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '上架' : '下架'}</Tag> },
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
        <h2>菜品管理</h2>
        <Space>
          <Select
            placeholder="筛选餐厅" allowClear style={{ width: 200 }}
            value={filterRestaurantId} onChange={(v) => setFilterRestaurantId(v || null)}
            options={restaurants.map(r => ({ label: r.name, value: r.id }))}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增菜品</Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? '编辑菜品' : '新增菜品'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="restaurant_id" label="所属餐厅" rules={[{ required: true, message: '请选择餐厅' }]}>
            <Select options={restaurants.map(r => ({ label: r.name, value: r.id }))} placeholder="选择餐厅" />
          </Form.Item>
          <Form.Item name="name" label="菜品名称" rules={[{ required: true, message: '请输入菜品名称' }]}>
            <Input placeholder="如：酸汤鱼" />
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
            <InputNumber min={0} style={{ width: '100%' }} placeholder="价格" />
          </Form.Item>
          <Form.Item name="image" label="菜品图片URL">
            <Input placeholder="图片URL" />
          </Form.Item>
          <Form.Item name="intro" label="菜品介绍">
            <Input.TextArea rows={2} placeholder="菜品介绍" />
          </Form.Item>
          <Form.Item name="is_signature" label="招牌菜" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="sort_order" label="排序">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <InputNumber min={0} max={1} style={{ width: '100%' }} placeholder="1上架 0下架" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
