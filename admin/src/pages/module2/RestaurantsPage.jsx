import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import ImageUploader from '../../components/ImageUploader';
import request from '../../utils/request';

export default function RestaurantsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // Slot management
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [slotForm] = Form.useForm();

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

  // --- Slot management ---
  const openSlotManager = async (record) => {
    setCurrentRestaurant(record);
    setEditingSlot(null);
    setShowSlotForm(false);
    slotForm.resetFields();
    setSlotModalOpen(true);
    await fetchSlots(record.id);
  };

  const fetchSlots = async (restaurantId) => {
    setSlotsLoading(true);
    try {
      const res = await request.get(`/api/restaurant/slots/${restaurantId}`);
      setSlots(res.data || []);
    } catch { /* */ } finally { setSlotsLoading(false); }
  };

  const openAddSlot = () => {
    setEditingSlot(null);
    setShowSlotForm(true);
    slotForm.resetFields();
    slotForm.setFieldsValue({ max_bookings: 20 });
  };

  const openEditSlot = (record) => {
    setEditingSlot(record);
    setShowSlotForm(true);
    slotForm.setFieldsValue({ slot_name: record.slotName, max_bookings: record.maxBookings, status: record.status });
  };

  const handleSlotSubmit = async () => {
    try {
      const values = await slotForm.validateFields();
      if (editingSlot) {
        await request.put(`/api/restaurant/slot/update/${editingSlot.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/api/restaurant/slot/create', { ...values, restaurant_id: currentRestaurant.id });
        message.success('创建成功');
      }
      slotForm.resetFields();
      setEditingSlot(null);
      setShowSlotForm(false);
      fetchSlots(currentRestaurant.id);
    } catch { /* */ }
  };

  const handleSlotDelete = async (id) => {
    try {
      await request.delete(`/api/restaurant/slot/delete/${id}`);
      message.success('删除成功');
      fetchSlots(currentRestaurant.id);
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
      title: '操作', width: 220,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Button type="link" icon={<ClockCircleOutlined />} onClick={() => openSlotManager(record)}>时段</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const slotColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '时段名称', dataIndex: 'slotName' },
    { title: '最大预订数', dataIndex: 'maxBookings', width: 100 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '启用' : '禁用'}</Tag> },
    {
      title: '操作', width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditSlot(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleSlotDelete(record.id)}>
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
          <Form.Item name="main_image" label="主图">
            <ImageUploader placeholder="主图URL 或本地上传" />
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

      {/* Slot Management Modal */}
      <Modal
        title={`${currentRestaurant?.name || ''} - 时段管理`}
        open={slotModalOpen}
        onCancel={() => { setSlotModalOpen(false); setEditingSlot(null); setShowSlotForm(false); slotForm.resetFields(); }}
        footer={null}
        width={700}
        destroyOnClose
      >
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 500 }}>时段列表</span>
          <Button type="primary" icon={<PlusOutlined />} size="small" onClick={openAddSlot}>新增时段</Button>
        </div>

        {showSlotForm && (
          <div style={{ background: '#fafafa', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <Form form={slotForm} layout="inline">
              <Form.Item name="slot_name" label="时段名称" rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder="如：午餐 11:00-13:00" style={{ width: 180 }} />
              </Form.Item>
              <Form.Item name="max_bookings" label="最大预订">
                <InputNumber min={1} style={{ width: 80 }} />
              </Form.Item>
              {editingSlot && (
                <Form.Item name="status" label="状态">
                  <InputNumber min={0} max={1} style={{ width: 60 }} placeholder="1启用" />
                </Form.Item>
              )}
              <Form.Item>
                <Button type="primary" onClick={handleSlotSubmit}>
                  {editingSlot ? '更新' : '添加'}
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => { setEditingSlot(null); setShowSlotForm(false); slotForm.resetFields(); }}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        <Table columns={slotColumns} dataSource={slots} rowKey="id" loading={slotsLoading} pagination={false} size="small" />
      </Modal>
    </div>
  );
}
