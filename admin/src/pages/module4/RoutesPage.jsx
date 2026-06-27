import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';

const themes = ['亲子', '摄影', '研学', '节庆', '休闲', '探险'];

export default function RoutesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try { const res = await request.get('/api/tour-route/admin/list'); setData(res.data || []); } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ days: 1 }); setModalOpen(true); };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title, days: record.days, theme: record.theme, price: record.price,
      main_image: record.mainImage, intro: record.intro, includes: record.includes,
      excludes: record.excludes, notes: record.notes, status: record.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await request.put(`/api/tour-route/update/${editing.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/api/tour-route/create', values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData();
    } catch { /* */ }
  };

  const handleDelete = async (id) => {
    try { await request.delete(`/api/tour-route/delete/${id}`); message.success('删除成功'); fetchData(); } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '路线标题', dataIndex: 'title', ellipsis: true },
    { title: '天数', dataIndex: 'days', width: 60 },
    { title: '主题', dataIndex: 'theme', width: 80, render: (v) => v || '-' },
    { title: '价格', dataIndex: 'price', width: 80, render: (v) => `¥${v}` },
    { title: '销量', dataIndex: 'sales', width: 60 },
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
        <h2>路线管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增路线</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      <Modal title={editing ? '编辑路线' : '新增路线'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose width={640}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="路线标题" rules={[{ required: true, message: '请输入标题' }]}><Input placeholder="如：苗寨2日深度游" /></Form.Item>
          <Form.Item name="days" label="行程天数"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="theme" label="主题">
            <Select options={themes.map(t => ({ label: t, value: t }))} placeholder="选择主题" allowClear />
          </Form.Item>
          <Form.Item name="price" label="套餐价格" rules={[{ required: true, message: '请输入价格' }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="main_image" label="主图URL"><Input placeholder="主图URL" /></Form.Item>
          <Form.Item name="intro" label="路线简介"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="includes" label="包含项目"><Input.TextArea rows={2} placeholder="如：门票、住宿、导游" /></Form.Item>
          <Form.Item name="excludes" label="不包含项目"><Input.TextArea rows={2} placeholder="如：个人消费、餐费" /></Form.Item>
          <Form.Item name="notes" label="注意事项"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="status" label="状态"><InputNumber min={0} max={1} style={{ width: '100%' }} placeholder="1上架 0下架" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
