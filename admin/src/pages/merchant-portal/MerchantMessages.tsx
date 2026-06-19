/**
 * 商家消息通知页面
 * 展示与当前商家相关的系统消息（订单消息、退款消息等）
 * 支持按消息类型筛选、标记已读
 *
 * 数据来源：GET /api/merchant-dashboard/messages
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Select, message, Badge, Empty } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import request from '../../utils/request';

/** 消息类型选项 */
const MESSAGE_TYPE_OPTIONS = [
  { label: '全部类型', value: '' },
  { label: '订单消息', value: 'order' },
  { label: '支付消息', value: 'payment' },
  { label: '退款消息', value: 'refund' },
  { label: '系统消息', value: 'system' },
  { label: '互动消息', value: 'interaction' },
];

/** 消息类型标签颜色 */
const MESSAGE_TYPE_MAP: Record<string, { text: string; color: string }> = {
  order: { text: '订单', color: 'blue' },
  payment: { text: '支付', color: 'green' },
  refund: { text: '退款', color: 'orange' },
  system: { text: '系统', color: 'default' },
  interaction: { text: '互动', color: 'purple' },
};

export default function MerchantMessages() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [messageType, setMessageType] = useState('');
  const [isRead, setIsRead] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  /** 加载消息列表 */
  const loadData = async () => {
    setLoading(true);
    try {
      const params: any = { page, pageSize };
      if (messageType) params.messageType = messageType;
      if (isRead !== undefined) params.isRead = isRead;

      const res: any = await request.get('/merchant-dashboard/messages', { params });
      if (res.code === 200) {
        setData(res.data.list);
        setTotal(res.data.total);
      }
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [page, pageSize, messageType, isRead]);

  /** 标记消息为已读 */
  const markAsRead = async (id: number) => {
    try {
      const res: any = await request.get(`/merchant-dashboard/messages/read/${id}`);
      if (res.code === 200) {
        message.success('已标记为已读');
        loadData();
      }
    } catch (err) {
      message.error('操作失败');
    }
  };

  /** 表格列配置 */
  const columns = [
    {
      title: '',
      width: 40,
      render: (_: any, record: any) => (
        record.is_read === 0
          ? <Badge status="processing" />
          : <Badge status="default" />
      ),
    },
    {
      title: '类型',
      dataIndex: 'message_type',
      width: 100,
      render: (v: string) => {
        const t = MESSAGE_TYPE_MAP[v];
        return t ? <Tag color={t.color}>{t.text}</Tag> : <Tag>{v}</Tag>;
      },
    },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    { title: '时间', dataIndex: 'created_at', width: 170, render: (v: string) => v?.slice(0, 16) },
    {
      title: '操作',
      width: 100,
      render: (_: any, record: any) => (
        record.is_read === 0 ? (
          <Button
            type="link"
            icon={<CheckOutlined />}
            onClick={() => markAsRead(record.id)}
            style={{ color: 'var(--color-terraced)' }}
          >
            已读
          </Button>
        ) : (
          <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-caption)' }}>已读</span>
        )
      ),
    },
  ];

  return (
    <div>
      <h2 style={{
        marginBottom: 'var(--spacing-lg)',
        fontSize: 'var(--text-h2)',
        fontFamily: 'var(--font-family-heading)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--color-text-primary)',
      }}>
        <BellOutlined style={{ marginRight: 'var(--spacing-xs)' }} />
        消息通知
      </h2>

      {/* 筛选区域 */}
      <Space style={{ marginBottom: 'var(--spacing-md)' }} wrap>
        <Select
          value={messageType}
          onChange={(v) => { setMessageType(v); setPage(1); }}
          style={{ width: 130 }}
          options={MESSAGE_TYPE_OPTIONS}
        />
        <Select
          placeholder="已读状态"
          allowClear
          value={isRead}
          onChange={(v) => { setIsRead(v); setPage(1); }}
          style={{ width: 130 }}
          options={[
            { label: '未读', value: '0' },
            { label: '已读', value: '1' },
          ]}
        />
      </Space>

      {/* 消息列表 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); },
        }}
        locale={{
          emptyText: <Empty description="暂无消息" />,
        }}
      />
    </div>
  );
}
