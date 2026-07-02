/* ============================================================
   入住须知管理页
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\HouseRule\index.tsx
   ============================================================ */
import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, TimePicker, Select, Space, Popconfirm, message, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAdminHouseRules, saveHouseRule, updateHouseRule, deleteHouseRule, getHomestays } from '../../api/lodging';
import dayjs from 'dayjs';

export default function HouseRulePage() {
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
    try { const r = await getAdminHouseRules({ page, pageSize: 20 }); setData(r.list || []); setTotal(r.total || 0); } catch {}
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = async () => {
    setEditing(null); form.resetFields();
    try { const r = await getHomestays({ pageSize: 100 }); setHomestays(r.list || []); } catch {}
    setModalOpen(true);
  };
  const openEdit = async (record: any) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      check_in_time: record.check_in_time ? dayjs(record.check_in_time, 'HH:mm') : undefined,
      check_out_time: record.check_out_time ? dayjs(record.check_out_time, 'HH:mm') : undefined,
    });
    try { const r = await getHomestays({ pageSize: 100 }); setHomestays(r.list || []); } catch {}
    setModalOpen(true);
  };
  const handleDelete = async (id: number) => {
    try { await deleteHouseRule(id); message.success('已删除'); fetchData(); } catch (err: any) {}
  };
  const handleSave = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      check_in_time: values.check_in_time?.format?.('HH:mm') || values.check_in_time,
      check_out_time: values.check_out_time?.format?.('HH:mm') || values.check_out_time,
    };
    try {
      if (editing) { await updateHouseRule(editing.id, payload); } else { await saveHouseRule(payload); }
      message.success(editing ? '已更新' : '已创建');
      setModalOpen(false); fetchData();
    } catch (err: any) {}
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '民宿ID', dataIndex: 'homestay_id' },
    { title: '入住时间', dataIndex: 'check_in_time' },
    { title: '退房时间', dataIndex: 'check_out_time' },
    { title: '注意事项', dataIndex: 'notes', ellipsis: true },
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
        <h2>入住须知管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增须知</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ total, current: page, onChange: setPage }} />
      <Modal title={editing ? '编辑入住须知' : '新增入住须知'} open={modalOpen} onOk={handleSave} onCancel={() => setModalOpen(false)} width={640}>
        <Form form={form} layout="vertical">
          <Form.Item name="homestay_id" label="所属民宿" rules={[{ required: true }]}>
            <Select options={homestays.map((h: any) => ({ label: h.name, value: h.id }))} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="check_in_time" label="入住时间"><TimePicker format="HH:mm" style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="check_out_time" label="退房时间"><TimePicker format="HH:mm" style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Form.Item name="notes" label="注意事项"><Input.TextArea rows={4} placeholder="请输入入住注意事项" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
