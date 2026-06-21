/**
 * 系统消息页面
 * 展示系统发送的消息列表，支持按消息类型和已读状态筛选
 * 提供查看消息详情、标记已读、删除和发送新消息功能
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, InputNumber, Modal, Form, Select, message, Popconfirm, Tag, Descriptions } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import request from '../../utils/request';

/** 消息类型选项配置 */
const MESSAGE_TYPE_OPTIONS = [
  { label: '系统通知', value: 'system' },
  { label: '订单通知', value: 'order' },
  { label: '支付通知', value: 'payment' },
  { label: '退款通知', value: 'refund' },
  { label: '互动通知', value: 'interaction' },
];

/** 消息类型颜色映射 */
const MESSAGE_TYPE_COLORS: Record<string, string> = {
  system: 'blue',
  order: 'green',
  payment: 'cyan',
  refund: 'orange',
  interaction: 'purple',
};

/**
 * 系统消息页面组件
 * 提供消息的查看、标记已读、删除和发送功能
 */
export default function MessageListPage() {
  /** 消息列表数据 */
  const [data, setData] = useState<any[]>([]);
  /** 数据总条数 */
  const [total, setTotal] = useState(0);
  /** 当前页码 */
  const [page, setPage] = useState(1);
  /** 每页条数 */
  const [pageSize, setPageSize] = useState(20);
  /** 数据加载状态 */
  const [loading, setLoading] = useState(false);
  /** 筛选条件 */
  const [filters, setFilters] = useState<any>({});
  /** 详情弹窗显示状态 */
  const [detailOpen, setDetailOpen] = useState(false);
  /** 当前查看的消息详情记录 */
  const [detailRecord, setDetailRecord] = useState<any>(null);
  /** 发送消息弹窗显示状态 */
  const [sendOpen, setSendOpen] = useState(false);
  /** 发送消息表单实例 */
  const [sendForm] = Form.useForm();

  /** 加载消息列表数据 */
  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/system-messages/list', { params: { page, pageSize, messageType: filters.message_type, isRead: filters.is_read } });
      if (res.code === 200) { setData(res.data.list); setTotal(res.data.total); }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [page, pageSize, filters]);

  /**
   * 筛选操作，重置页码并更新筛选条件
   * @param values - 筛选条件对象
   */
  const onFilter = (values: any) => {
    setPage(1);
    setFilters(values);
  };

  /**
   * 查看消息详情
   * @param record - 消息记录
   */
  const handleViewDetail = (record: any) => {
    setDetailRecord(record);
    setDetailOpen(true);
  };

  /**
   * 标记消息为已读
   * @param id - 消息 ID
   */
  const handleMarkRead = async (id: number) => {
    const res: any = await request.put(`/system-messages/read/${id}`);
    if (res.code === 200) { message.success('已标记为已读'); loadData(); }
  };

  /**
   * 删除消息
   * @param id - 消息 ID
   */
  const handleDelete = async (id: number) => {
    const res: any = await request.delete(`/system-messages/delete/${id}`);
    if (res.code === 200) { message.success('删除成功'); loadData(); }
  };

  /** 发送消息，提交表单数据到后端 */
  const handleSend = async () => {
    const values = await sendForm.validateFields();
    try {
      const res: any = await request.post('/system-messages/create', values);
      if (res.code === 200) { message.success('发送成功'); setSendOpen(false); sendForm.resetFields(); loadData(); }
      else message.error(res.message);
    } catch (err: any) { message.error(err?.response?.data?.message || '发送失败'); }
  };

  /** 表格列配置 */
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '用户ID', dataIndex: 'user_id', width: 100 },
    {
      title: '消息类型', dataIndex: 'message_type',
      render: (v: string) => <Tag color={MESSAGE_TYPE_COLORS[v] || 'default'}>{MESSAGE_TYPE_OPTIONS.find(o => o.value === v)?.label || v}</Tag>,
    },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    {
      title: '已读状态', dataIndex: 'is_read',
      render: (v: number) => v === 1 ? <Tag color="green">已读</Tag> : <Tag color="red">未读</Tag>,
    },
    { title: '创建时间', dataIndex: 'created_at', width: 180 },
    {
      title: '操作', width: 240, fixed: 'right' as const, render: (_: any, record: any) => (
        <Space size="small" wrap>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看</Button>
          {record.is_read !== 1 && (
            <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => handleMarkRead(record.id)}>标为已读</Button>
          )}
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>系统消息</h2>
      {/* 筛选和发送区域 */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Select placeholder="消息类型" allowClear style={{ width: 140 }}
          options={MESSAGE_TYPE_OPTIONS}
          onChange={(val) => onFilter({ ...filters, message_type: val })} />
        <Select placeholder="已读状态" allowClear style={{ width: 120 }}
          options={[{ label: '未读', value: 0 }, { label: '已读', value: 1 }]}
          onChange={(val) => onFilter({ ...filters, is_read: val })} />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { sendForm.resetFields(); setSendOpen(true); }}>发送消息</Button>
      </Space>
      {/* 消息列表表格 */}
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} scroll={{ x: 'max-content' }}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }} />

      {/* 消息详情弹窗 */}
      <Modal title="消息详情" open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} destroyOnClose>
        {detailRecord && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="ID">{detailRecord.id}</Descriptions.Item>
            <Descriptions.Item label="用户ID">{detailRecord.user_id}</Descriptions.Item>
            <Descriptions.Item label="消息类型">
              <Tag color={MESSAGE_TYPE_COLORS[detailRecord.message_type] || 'default'}>
                {MESSAGE_TYPE_OPTIONS.find(o => o.value === detailRecord.message_type)?.label || detailRecord.message_type}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="标题">{detailRecord.title}</Descriptions.Item>
            <Descriptions.Item label="内容">{detailRecord.content}</Descriptions.Item>
            <Descriptions.Item label="已读状态">
              {detailRecord.is_read === 1 ? <Tag color="green">已读</Tag> : <Tag color="red">未读</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{detailRecord.created_at}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 发送消息弹窗 */}
      <Modal title="发送消息" open={sendOpen} onOk={handleSend} onCancel={() => setSendOpen(false)} destroyOnClose>
        <Form form={sendForm} layout="vertical">
          <Form.Item name="user_id" label="用户ID" extra="留空则群发给所有用户"><InputNumber placeholder="输入目标用户ID（留空群发）" style={{ width: '100%' }} min={1} /></Form.Item>
          <Form.Item name="message_type" label="消息类型" rules={[{ required: true }]}><Select options={MESSAGE_TYPE_OPTIONS} /></Form.Item>
          <Form.Item name="title" label="标题" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
