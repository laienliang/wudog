/**
 * 系统配置页面
 * 展示系统配置项列表，支持编辑配置值
 * 配置项包含键名、值、类型和描述信息
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, message, Tag } from 'antd';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import request from '../../utils/request';

/**
 * 系统配置页面组件
 * 提供系统配置项的查看和编辑功能
 */
export default function SystemConfigPage() {
  /** 配置项列表数据 */
  const [data, setData] = useState<any[]>([]);
  /** 数据总条数 */
  const [total, setTotal] = useState(0);
  /** 当前页码 */
  const [page, setPage] = useState(1);
  /** 每页条数 */
  const [pageSize, setPageSize] = useState(20);
  /** 数据加载状态 */
  const [loading, setLoading] = useState(false);
  /** 编辑弹窗显示状态 */
  const [modalOpen, setModalOpen] = useState(false);
  /** 当前编辑的配置项记录 */
  const [editing, setEditing] = useState<any>(null);
  /** 表单实例 */
  const [form] = Form.useForm();

  /** 加载系统配置列表数据 */
  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/system-configs/list');
      if (res.code === 200) {
        // system-configs/list 返回数组，不是分页格式
        const list = Array.isArray(res.data) ? res.data : (res.data.list || []);
        setData(list);
        setTotal(Array.isArray(res.data) ? res.data.length : (res.data.total || 0));
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [page, pageSize]);

  /**
   * 打开编辑弹窗
   * @param record - 要编辑的配置项记录
   */
  const openEditModal = (record: any) => {
    setEditing(record);
    form.setFieldsValue({ config_value: record.config_value });
    setModalOpen(true);
  };

  /** 提交编辑表单，更新配置值 */
  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      const res: any = await request.put(`/system-configs/update/${editing.config_key}`, { value: values.config_value });
      if (res.code === 200) { message.success('更新成功'); setModalOpen(false); loadData(); }
      else message.error(res.message);
    } catch (err: any) { message.error(err?.response?.data?.message || '操作失败'); }
  };

  /** 表格列配置 */
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '配置键', dataIndex: 'config_key', width: 240 },
    { title: '配置值', dataIndex: 'config_value', ellipsis: true },
    { title: '配置类型', dataIndex: 'config_type', width: 120, render: (v: string) => <Tag>{v}</Tag> },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '操作', width: 100, render: (_: any, record: any) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)}>编辑</Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>系统配置</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ReloadOutlined />} onClick={loadData}>刷新</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }} />
      <Modal title={`编辑配置 - ${editing?.config_key || ''}`} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="config_value" label="配置值" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
