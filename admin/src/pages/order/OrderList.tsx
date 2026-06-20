/**
 * 全局订单页面
 * 展示平台所有类型的订单列表，支持按订单号、类型、状态筛选搜索
 * 订单类型包括：商品、餐位、住宿、门票、路线
 * 可查看详情弹窗
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Select, Tag, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import request from '../../utils/request';

/** 订单类型选项配置 */
const ORDER_TYPE_OPTIONS = [
  { label: '商品（衣）', value: 'product' },
  { label: '餐饮（食）', value: 'food_order' },
  { label: '住宿（住）', value: 'stay' },
  { label: '门票（行）', value: 'ticket' },
  { label: '路线（行）', value: 'route' },
];

/** 订单类型显示映射（品牌色系） */
const ORDER_TYPE_MAP: Record<string, { text: string; color: string }> = {
  product: { text: '商品（衣）', color: 'blue' },
  food_order: { text: '餐饮（食）', color: 'orange' },
  stay: { text: '住宿（住）', color: 'green' },
  ticket: { text: '门票（行）', color: 'cyan' },
  route: { text: '路线（行）', color: 'geekblue' },
};

/** 订单状态选项配置 */
const STATUS_OPTIONS = [
  { label: '待支付', value: 'pending_payment' },
  { label: '已支付', value: 'paid' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
  { label: '已关闭', value: 'closed' },
  { label: '退款中', value: 'refunding' },
  { label: '退款通过', value: 'refund_approved' },
  { label: '退款被拒', value: 'refund_rejected' },
  { label: '已退款', value: 'refunded' },
];

/** 订单状态显示映射（品牌色系） */
const STATUS_MAP: Record<string, { text: string; color: string }> = {
  pending_payment: { text: '待支付', color: 'blue' },
  paid: { text: '已支付', color: 'processing' },
  shipped: { text: '已发货', color: 'geekblue' },
  completed: { text: '已完成', color: 'success' },
  cancelled: { text: '已取消', color: 'default' },
  closed: { text: '已关闭', color: 'default' },
  refunding: { text: '退款中', color: 'warning' },
  refund_approved: { text: '退款通过', color: 'green' },
  refund_rejected: { text: '退款被拒', color: 'error' },
  refunded: { text: '已退款', color: 'error' },
};

/**
 * 全局订单页面组件
 * 提供订单列表的查看和筛选功能
 */
export default function OrderListPage() {
  /** 订单列表数据 */
  const [data, setData] = useState<any[]>([]);
  /** 数据总条数 */
  const [total, setTotal] = useState(0);
  /** 当前页码 */
  const [page, setPage] = useState(1);
  /** 每页条数 */
  const [pageSize, setPageSize] = useState(20);
  /** 搜索关键词（订单号） */
  const [keyword, setKeyword] = useState('');
  /** 订单类型筛选条件 */
  const [orderType, setOrderType] = useState<string | undefined>(undefined);
  /** 订单状态筛选条件 */
  const [status, setStatus] = useState<string | undefined>(undefined);
  /** 数据加载状态 */
  const [loading, setLoading] = useState(false);
  /** 详情弹窗显示状态 */
  const [detailOpen, setDetailOpen] = useState(false);
  /** 当前查看的订单详情记录 */
  const [detailRecord, setDetailRecord] = useState<any>(null);

  /** 加载订单列表数据 */
  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/orders/list', {
        params: { page, pageSize, keyword, orderType: orderType, status },
      });
      if (res.code === 200) {
        setData(res.data.list);
        setTotal(res.data.total);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [page, pageSize, orderType, status, keyword]);

  /** 搜索操作，重置页码后加载数据 */
  const onSearch = () => { setPage(1); loadData(); };

  /**
   * 打开订单详情弹窗
   * @param record - 订单记录
   */
  const openDetail = (record: any) => {
    setDetailRecord(record);
    setDetailOpen(true);
  };

  /** 表格列配置 */
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '订单号', dataIndex: 'order_no' },
    {
      title: '订单类型', dataIndex: 'order_type',
      render: (v: string) => {
        const t = ORDER_TYPE_MAP[v];
        return t ? <Tag color={t.color}>{t.text}</Tag> : <Tag>{v}</Tag>;
      },
    },
    { title: '用户ID', dataIndex: 'user_id' },
    { title: '商家ID', dataIndex: 'merchant_id' },
    { title: '订单金额', dataIndex: 'total_amount', render: (v: number) => v != null ? `¥${Number(v).toFixed(2)}` : '-' },
    {
      title: '状态', dataIndex: 'status',
      render: (v: string) => {
        const s = STATUS_MAP[v];
        return s ? <Tag color={s.color}>{s.text}</Tag> : <Tag>{v}</Tag>;
      },
    },
    { title: '支付时间', dataIndex: 'pay_time' },
    { title: '创建时间', dataIndex: 'created_at' },
    {
      title: '操作', width: 100, render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => openDetail(record)}>详情</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>订单管理</h2>
      {/* 搜索和筛选区域 */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="搜索订单号"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onPressEnter={onSearch}
          prefix={<SearchOutlined />}
          style={{ width: 220 }}
        />
        <Select
          placeholder="订单类型"
          allowClear
          value={orderType}
          onChange={v => { setOrderType(v); setPage(1); }}
          style={{ width: 130 }}
          options={ORDER_TYPE_OPTIONS}
        />
        <Select
          placeholder="订单状态"
          allowClear
          value={status}
          onChange={v => { setStatus(v); setPage(1); }}
          style={{ width: 130 }}
          options={STATUS_OPTIONS}
        />
        <Button type="primary" onClick={onSearch}>搜索</Button>
      </Space>
      {/* 订单列表表格 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: page, pageSize, total, showSizeChanger: true,
          showTotal: t => `共 ${t} 条`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); },
        }}
      />
      {/* 订单详情弹窗 */}
      <Modal title="订单详情" open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} destroyOnClose width={600}>
        {detailRecord && (
          <div style={{ lineHeight: 2.2 }}>
            <p><strong>ID：</strong>{detailRecord.id}</p>
            <p><strong>订单号：</strong>{detailRecord.order_no}</p>
            <p><strong>订单类型：</strong>{(ORDER_TYPE_MAP[detailRecord.order_type] || { text: detailRecord.order_type }).text}</p>
            <p><strong>用户ID：</strong>{detailRecord.user_id}</p>
            <p><strong>商家ID：</strong>{detailRecord.merchant_id}</p>
            <p><strong>订单金额：</strong>¥{Number(detailRecord.total_amount).toFixed(2)}</p>
            <p><strong>状态：</strong><Tag color={(STATUS_MAP[detailRecord.status] || { color: 'default', text: detailRecord.status }).color}>{(STATUS_MAP[detailRecord.status] || { text: detailRecord.status }).text}</Tag></p>
            <p><strong>支付时间：</strong>{detailRecord.pay_time || '-'}</p>
            <p><strong>创建时间：</strong>{detailRecord.created_at || '-'}</p>
            <p><strong>更新时间：</strong>{detailRecord.updated_at || '-'}</p>
            {detailRecord.remark && <p><strong>备注：</strong>{detailRecord.remark}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
