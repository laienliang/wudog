import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ImageUploader from '../../components/ImageUploader';
import request from '../../utils/request';

export default function RoomTypesPage() {
  const [data, setData] = useState([]);
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [filterHomestayId, setFilterHomestayId] = useState(null);

  const fetchHomestays = async () => {
    try {
      const res = await request.get('/api/homestay/admin/list');
      setHomestays(res.data || []);
    } catch { /* */ }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = filterHomestayId ? { homestay_id: filterHomestayId } : {};
      const res = await request.get('/api/homestay/room-type/list', { params });
      setData(res.data || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchHomestays(); fetchData(); }, []);
  useEffect(() => { fetchData(); }, [filterHomestayId]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: 1, capacity: 2, total_rooms: 1 });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      homestay_id: record.homestayId, name: record.name, bed_type: record.bedType,
      area: record.area, capacity: record.capacity, facilities: record.facilities,
      base_price: record.basePrice, total_rooms: record.totalRooms, main_image: record.mainImage,
      status: record.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await request.put(`/api/homestay/room-type/update/${editing.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/api/homestay/room-type/create', values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData();
    } catch { /* */ }
  };

  const handleDelete = async (id) => {
    try {
      await request.delete(`/api/homestay/room-type/delete/${id}`);
      message.success('删除成功');
      fetchData();
    } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '房型名', dataIndex: 'name' },
    { title: '所属民宿', dataIndex: 'homestayId', width: 120, render: (v) => homestays.find(h => h.id === v)?.name || v },
    { title: '床型', dataIndex: 'bedType', width: 80, render: (v) => v || '-' },
    { title: '面积(㎡)', dataIndex: 'area', width: 80, render: (v) => v || '-' },
    { title: '容纳', dataIndex: 'capacity', width: 60 },
    { title: '价格', dataIndex: 'basePrice', width: 80, render: (v) => `¥${v}` },
    { title: '总房间', dataIndex: 'totalRooms', width: 70 },
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
        <h2>房型管理</h2>
        <Space>
          <Select
            placeholder="筛选民宿" allowClear style={{ width: 200 }}
            value={filterHomestayId} onChange={(v) => setFilterHomestayId(v || null)}
            options={homestays.map(h => ({ label: h.name, value: h.id }))}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增房型</Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? '编辑房型' : '新增房型'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="homestay_id" label="所属民宿" rules={[{ required: true, message: '请选择民宿' }]}>
            <Select options={homestays.map(h => ({ label: h.name, value: h.id }))} placeholder="选择民宿" />
          </Form.Item>
          <Form.Item name="name" label="房型名称" rules={[{ required: true, message: '请输入房型名称' }]}>
            <Input placeholder="如：景观大床房" />
          </Form.Item>
          <Form.Item name="bed_type" label="床型">
            <Input placeholder="如：大床/双床/家庭房" />
          </Form.Item>
          <Form.Item name="area" label="面积(㎡)">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="capacity" label="容纳人数">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="facilities" label="房间设施">
            <Input placeholder="如：空调,电视,浴缸" />
          </Form.Item>
          <Form.Item name="base_price" label="基础价格/晚" rules={[{ required: true, message: '请输入价格' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="total_rooms" label="总房间数">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="main_image" label="房型图片">
            <ImageUploader placeholder="图片URL 或本地上传" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <InputNumber min={0} max={1} style={{ width: '100%' }} placeholder="1启用 0禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
