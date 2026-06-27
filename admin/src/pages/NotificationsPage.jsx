import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Tag } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import request from '../utils/request';

const typeMap = {
  system: { color: 'default', text: '系统' },
  order: { color: 'processing', text: '订单' },
  interact: { color: 'success', text: '互动' },
  merchant: { color: 'warning', text: '商户' },
};

export default function NotificationsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 50;

  const fetchData = async (p = 1) => {
    setLoading(true);
    try {
      const res = await request.get('/admin/notifications', { params: { page: p, pageSize } });
      setData(res.data?.list || []);
      setTotal(res.data?.total || 0);
      setPage(p);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openSend = () => { form.resetFields(); setModalOpen(true); };

  const handleSend = async () => {
    try {
      const values = await form.validateFields();
      await request.post('/admin/notifications/send', values);
      message.success('发送成功');
      setModalOpen(false);
      fetchData(page);
    } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户ID', dataIndex: 'user_id', width: 70 },
    { title: '类型', dataIndex: 'type', width: 70, render: (v) => <Tag color={typeMap[v]?.color}>{typeMap[v]?.text || v}</Tag> },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '内容', dataIndex: 'content', width: 200, ellipsis: true, render: (v) => v || '-' },
    { title: '已读', dataIndex: 'is_read', width: 60, render: (v) => v === 1 ? '是' : '否' },
    { title: '发送时间', dataIndex: 'created_at', width: 160, render: (v) => new Date(v).toLocaleString() },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>消息中心</h2>
        <Button type="primary" icon={<SendOutlined />} onClick={openSend}>发送消息</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={{ current: page, pageSize, total, onChange: (p) => fetchData(p), showTotal: (t) => `共 ${t} 条` }} />

      <Modal title="发送消息" open={modalOpen} onOk={handleSend} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="user_id" label="用户ID" rules={[{ required: true, message: '请输入用户ID' }]}>
            <Input placeholder="目标用户ID" />
          </Form.Item>
          <Form.Item name="type" label="消息类型" rules={[{ required: true }]}>
            <Select options={[{ label: '系统', value: 'system' }, { label: '订单', value: 'order' }, { label: '互动', value: 'interact' }, { label: '商户', value: 'merchant' }]} />
          </Form.Item>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}><Input placeholder="消息标题" /></Form.Item>
          <Form.Item name="content" label="内容"><Input.TextArea rows={4} placeholder="消息内容" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
