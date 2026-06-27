/* ============================================================
   民宿管理页 — CRUD + Modal 表单
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\Homestay\index.tsx
   ============================================================ */
import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Tag, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getHomestays, createHomestay, updateHomestay, deleteHomestay } from '../../api/lodging';

export default function HomestayPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const r = await getHomestays({ page, pageSize: 20 }); setData(r.list || []); setTotal(r.total || 0); } catch {}
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (record: any) => { setEditing(record); form.setFieldsValue(record); setModalOpen(true); };
  const handleDelete = async (id: number) => { try { await deleteHomestay(id); } catch {} message.success('已删除'); fetchData(); };
  const handleSave = async () => {
    const values = await form.validateFields();
    try { if (editing) { await updateHomestay(editing.id, values); } else { await createHomestay(values); } } catch {}
    message.success(editing ? '已更新' : '已创建');
    setModalOpen(false);
    fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '民宿名称', dataIndex: 'name' },
    { title: '地址', dataIndex: 'address', ellipsis: true },
    { title: '最低价', dataIndex: 'min_price', render: (v: number) => `¥${v}` },
    { title: '评分', dataIndex: 'rating' },
    { title: '状态', dataIndex: 'status', render: (v: number) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '上架' : '下架'}</Tag> },
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
        <h2>民宿管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增民宿</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ total, current: page, onChange: setPage }} />
      <Modal title={editing ? '编辑民宿' : '新增民宿'} open={modalOpen} onOk={handleSave} onCancel={() => setModalOpen(false)} width={640}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="address" label="地址" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="contact_phone" label="联系电话"><Input /></Form.Item>
          <Form.Item name="cover_image" label="封面图URL"><Input /></Form.Item>
          <Form.Item name="description" label="简介"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="status" label="状态"><Select options={[{ label: '上架', value: 1 }, { label: '下架', value: 0 }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
