import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, message, Tag } from 'antd';
import request from '../../utils/request';

export default function TopicsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await request.get('/api/topic/list');
      setData(res.data.list || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values, is_pinned: values.is_pinned ? 1 : 0, is_recommended: values.is_recommended ? 1 : 0 };
      if (editing) {
        await request.put(`/api/topic/update/${editing.id}`, payload);
        message.success('编辑成功');
      } else {
        await request.post('/api/topic/create', payload);
        message.success('新增成功');
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      fetchData();
    } catch (e) {
      if (e.errorFields) return; // form validation
      message.error(e.response?.data?.message || '操作失败');
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除？',
      onOk: async () => {
        try {
          await request.delete(`/api/topic/delete/${id}`);
          message.success('已删除');
          fetchData();
        } catch (e) {
          message.error(e.response?.data?.message || '操作失败');
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name' },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    { title: '游记数', dataIndex: 'note_count', width: 80 },
    { title: '关注数', dataIndex: 'follow_count', width: 80 },
    { title: '置顶', dataIndex: 'is_pinned', width: 70,
      render: (v) => v ? <Tag color="red">置顶</Tag> : '',
    },
    { title: '推荐', dataIndex: 'is_recommended', width: 70,
      render: (v) => v ? <Tag color="blue">推荐</Tag> : '',
    },
    { title: '创建时间', dataIndex: 'created_at', width: 170,
      render: (t) => new Date(t).toLocaleString(),
    },
    { title: '操作', width: 150,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => { setEditing(record); form.setFieldsValue({ ...record, is_pinned: !!record.is_pinned, is_recommended: !!record.is_recommended }); setModalOpen(true); }}>编辑</Button>
          <Button size="small" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>话题管理</h2>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }}>
        新增话题
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />
      <Modal title={editing ? '编辑话题' : '新增话题'} open={modalOpen} onOk={handleSave} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入话题名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="cover_image" label="封面图URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="is_pinned" label="置顶" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="is_recommended" label="推荐" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
