/* ============================================================
   房型管理页
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\Room\index.tsx
   ============================================================ */
import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Tag, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getRooms, createRoom, updateRoom, deleteRoom, getHomestays } from '../../api/lodging';

export default function RoomPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [homestays, setHomestays] = useState<any[]>([]);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const r = await getRooms({ page, pageSize: 20 }); setData(r.list || []); setTotal(r.total || 0); } catch {}
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = async () => {
    setEditing(null); form.resetFields();
    try { const r = await getHomestays({ pageSize: 100 }); setHomestays(r.list || []); } catch {}
    setModalOpen(true);
  };
  const openEdit = async (record: any) => {
    setEditing(record); form.setFieldsValue(record);
    try { const r = await getHomestays({ pageSize: 100 }); setHomestays(r.list || []); } catch {}
    setModalOpen(true);
  };
  const handleDelete = async (id: number) => { try { await deleteRoom(id); } catch {} message.success('已删除'); fetchData(); };
  const handleSave = async () => {
    const values = await form.validateFields();
    try { if (editing) { await updateRoom(editing.id, values); } else { await createRoom(values); } } catch {}
    message.success(editing ? '已更新' : '已创建');
    setModalOpen(false); fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '房型名称', dataIndex: 'name' },
    { title: '民宿ID', dataIndex: 'homestay_id' },
    { title: '床型', dataIndex: 'bed_type' },
    { title: '面积', dataIndex: 'area', render: (v: number) => `${v}㎡` },
    { title: '可住', dataIndex: 'max_guests', render: (v: number) => `${v}人` },
    { title: '基础价', dataIndex: 'base_price', render: (v: number) => `¥${v}` },
    { title: '库存', dataIndex: 'default_stock' },
    { title: '状态', dataIndex: 'status', render: (v: number) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '启用' : '禁用'}</Tag> },
    {
      title: '操作', render: (_: any, r: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>编辑</Button>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>房型管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增房型</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ total, current: page, onChange: setPage }} />
      <Modal title={editing ? '编辑房型' : '新增房型'} open={modalOpen} onOk={handleSave} onCancel={() => setModalOpen(false)} width={640}>
        <Form form={form} layout="vertical">
          <Form.Item name="homestay_id" label="所属民宿" rules={[{ required: true }]}>
            <Select options={homestays.map((h: any) => ({ label: h.name, value: h.id }))} />
          </Form.Item>
          <Form.Item name="name" label="房型名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="bed_type" label="床型"><Input placeholder="如：大床1.8m×2m" /></Form.Item>
          <Form.Item name="area" label="面积(㎡)"><InputNumber min={1} /></Form.Item>
          <Form.Item name="max_guests" label="最大入住人数"><InputNumber min={1} /></Form.Item>
          <Form.Item name="base_price" label="基础价格(元/晚)" rules={[{ required: true }]}><InputNumber min={0} step={10} /></Form.Item>
          <Form.Item name="default_stock" label="默认库存(间)"><InputNumber min={1} /></Form.Item>
          <Form.Item name="status" label="状态"><Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
