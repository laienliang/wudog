/**
 * 异常订单管理页面
 * 展示两类异常订单：长时间未支付 和 退款争议
 * 支持手动关闭未支付订单和催促退款处理
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Card, Tabs, message, Modal, Statistic, Row, Col } from 'antd';
import { ReloadOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import request from '../../utils/request';

/** 订单类型名称映射 */
const ORDER_TYPE_MAP: Record<string, string> = {
  product: '商品（衣）', food_order: '餐饮（食）', stay: '住宿（住）', ticket: '门票（行）', route: '路线（行）',
};

/** 订单状态标签 */
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending_payment: { label: '待支付', color: 'orange' },
  refunding: { label: '退款中', color: 'gold' },
  refund_rejected: { label: '退款被拒', color: 'red' },
  refund_approved: { label: '退款通过', color: 'green' },
  completed: { label: '已完成', color: 'blue' },
  closed: { label: '已关闭', color: 'default' },
};

export default function AbnormalOrderPage() {
  const [unpaidOrders, setUnpaidOrders] = useState<any[]>([]);
  const [refundDisputes, setRefundDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [totalRefund, setTotalRefund] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/orders/abnormal');
      if (res.code === 200) {
        setUnpaidOrders(res.data.unpaidOrders || []);
        setRefundDisputes(res.data.refundDisputes || []);
        setTotalUnpaid(res.data.totalUnpaid || 0);
        setTotalRefund(res.data.totalRefundDisputes || 0);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  /** 手动关闭未支付订单 */
  const handleClose = (id: number) => {
    Modal.confirm({
      title: '确认关闭订单',
      icon: <ExclamationCircleOutlined />,
      content: '关闭后该订单将无法恢复，确认关闭？',
      onOk: async () => {
        try {
          const res: any = await request.post(`/orders/close/${id}`);
          if (res.code === 200) { message.success('订单已关闭'); loadData(); }
          else message.error(res.message);
        } catch { message.error('操作失败'); }
      },
    });
  };

  /** 未支付订单列配置 */
  const unpaidColumns = [
    { title: '订单编号', dataIndex: 'order_no', width: 180 },
    { title: '订单类型', dataIndex: 'order_type', width: 100, render: (v: string) => ORDER_TYPE_MAP[v] || v },
    { title: '用户ID', dataIndex: 'user_id', width: 80 },
    { title: '商家ID', dataIndex: 'merchant_id', width: 80 },
    { title: '金额', dataIndex: 'total_amount', width: 100, render: (v: number) => `¥${Number(v).toFixed(2)}` },
    { title: '状态', dataIndex: 'status', width: 100, render: (v: string) => {
      const s = STATUS_MAP[v]; return s ? <Tag color={s.color}>{s.label}</Tag> : <Tag>{v}</Tag>;
    }},
    { title: '创建时间', dataIndex: 'created_at', width: 170, render: (v: string) => v ? new Date(v).toLocaleString('zh-CN') : '-' },
    {
      title: '操作', width: 120, render: (_: any, record: any) => (
        <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleClose(record.id)}>
          关闭订单
        </Button>
      ),
    },
  ];

  /** 退款争议订单列配置 */
  const refundColumns = [
    { title: '订单编号', dataIndex: 'order_no', width: 180 },
    { title: '订单类型', dataIndex: 'order_type', width: 100, render: (v: string) => ORDER_TYPE_MAP[v] || v },
    { title: '用户ID', dataIndex: 'user_id', width: 80 },
    { title: '金额', dataIndex: 'total_amount', width: 100, render: (v: number) => `¥${Number(v).toFixed(2)}` },
    { title: '状态', dataIndex: 'status', width: 120, render: (v: string) => {
      const s = STATUS_MAP[v]; return s ? <Tag color={s.color}>{s.label}</Tag> : <Tag>{v}</Tag>;
    }},
    { title: '拒绝原因', dataIndex: 'refund_reject_reason', ellipsis: true, render: (v: string) => v || '-' },
    { title: '更新时间', dataIndex: 'updated_at', width: 170, render: (v: string) => v ? new Date(v).toLocaleString('zh-CN') : '-' },
    {
      title: '操作', width: 100, render: () => <Tag color="orange">需人工跟进</Tag>,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>异常订单管理</h2>
        <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>刷新</Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card><Statistic title="长时间未支付订单" value={totalUnpaid} valueStyle={{ color: totalUnpaid > 0 ? '#E85D2F' : '#52c41a' }} suffix="笔" /></Card>
        </Col>
        <Col span={12}>
          <Card><Statistic title="退款争议订单" value={totalRefund} valueStyle={{ color: totalRefund > 0 ? '#faad14' : '#52c41a' }} suffix="笔" /></Card>
        </Col>
      </Row>

      {/* 订单列表 Tabs */}
      <Card>
        <Tabs
          items={[
            {
              key: 'unpaid',
              label: `未支付订单 (${totalUnpaid})`,
              children: (
                <Table
                  rowKey="id"
                  columns={unpaidColumns}
                  dataSource={unpaidOrders}
                  loading={loading}
                  size="small"
                  pagination={{ pageSize: 10, showTotal: t => `共 ${t} 条` }}
                />
              ),
            },
            {
              key: 'refund',
              label: `退款争议 (${totalRefund})`,
              children: (
                <Table
                  rowKey="id"
                  columns={refundColumns}
                  dataSource={refundDisputes}
                  loading={loading}
                  size="small"
                  pagination={{ pageSize: 10, showTotal: t => `共 ${t} 条` }}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
