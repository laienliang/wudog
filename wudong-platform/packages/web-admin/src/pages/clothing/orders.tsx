import React, { useRef, useState } from 'react';
import { Button, message, Tag, Popconfirm, Typography, Space, Modal, Table, Descriptions } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import dayjs from 'dayjs';
import { orderApi } from '../../services/api';

const { Text } = Typography;

const statusMap: Record<string, { color: string; label: string }> = {
  pending_pay: { color: 'orange', label: '待支付' },
  paid: { color: 'blue', label: '已支付' },
  confirmed: { color: 'cyan', label: '已确认' },
  completed: { color: 'green', label: '已完成' },
  cancelled: { color: 'default', label: '已取消' },
  refunded: { color: 'red', label: '已退款' },
};

const orderTypeNames: Record<string, string> = {
  clothing: '商品', food_meal: '餐饮', food_product: '特产',
  accommodation: '住宿', travel: '出行',
};

/** 商品列渲染 */
const renderProduct = (record: any) => {
  try {
    const items = record?.items;
    if (items && Array.isArray(items) && items.length > 0) {
      const first = items[0];
      const name = first?.productName || '-';
      const img = first?.productImage || '';
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {img ? (
            <img src={img} alt="" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover', border: '1px solid #f0f0f0' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: 4, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍽</div>
          )}
          <div>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>{name}</Text>
            {items.length > 1 && <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>+{items.length - 1}件</Text>}
          </div>
        </div>
      );
    }
    // 无明细时显示备注
    if (record?.remark) {
      const shortRemark = record.remark.length > 40 ? record.remark.slice(0, 40) + '...' : record.remark;
      return (
        <Text type="secondary" style={{ fontSize: 12 }}>{shortRemark}</Text>
      );
    }
    return <Text type="secondary">-</Text>;
  } catch {
    return <Text type="secondary">-</Text>;
  }
};

/* ============================================================
   订单详情弹窗
   ============================================================ */
const OrderDetailModal: React.FC<{ order: any; open: boolean; onClose: () => void }> = ({ order, open, onClose }) => {
  if (!order) return null;

  const items = order.items || [];

  const itemColumns = [
    { title: '商品', dataIndex: 'productName', width: 180,
      render: (v: string, r: any) => (
        <Space>
          {r.productImage ? (
            <img src={r.productImage} alt="" style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: 4, background: '#f5f5f5' }} />
          )}
          <Text style={{ fontSize: 13 }}>{v}</Text>
        </Space>
      ),
    },
    { title: '规格', dataIndex: 'skuName', width: 100, render: (v: string) => v ? <Text style={{ fontSize: 12 }}>{v}</Text> : <Text type="secondary" style={{ fontSize: 12 }}>-</Text> },
    { title: '单价', dataIndex: 'unitPrice', width: 80, align: 'right' as const, render: (v: number) => `¥${Number(v).toFixed(2)}` },
    { title: '数量', dataIndex: 'quantity', width: 60, align: 'center' as const },
    { title: '小计', dataIndex: 'subtotal', width: 80, align: 'right' as const, render: (v: number) => <Text style={{ color: '#E85D2F', fontWeight: 600 }}>¥{Number(v).toFixed(2)}</Text> },
  ];

  return (
    <Modal title={`订单详情 - ${order.orderNo}`} open={open} onCancel={onClose} footer={<Button onClick={onClose}>关闭</Button>} width={700}>
      <Descriptions column={2} size="small" bordered style={{ marginBottom: 16 }}>
        <Descriptions.Item label="订单号" span={2}><Text copyable style={{ fontSize: 12 }}>{order.orderNo}</Text></Descriptions.Item>
        <Descriptions.Item label="订单类型"><Tag>{orderTypeNames[order.orderType] || order.orderType}</Tag></Descriptions.Item>
        <Descriptions.Item label="订单状态"><Tag color={statusMap[order.status]?.color}>{statusMap[order.status]?.label || order.status}</Tag></Descriptions.Item>
        <Descriptions.Item label="支付金额"><Text style={{ color: '#E85D2F', fontWeight: 600 }}>¥{Number(order.payAmount || 0).toFixed(2)}</Text></Descriptions.Item>
        <Descriptions.Item label="总金额"><Text>¥{Number(order.totalAmount || 0).toFixed(2)}</Text></Descriptions.Item>
        <Descriptions.Item label="用户ID">{order.userId}</Descriptions.Item>
        <Descriptions.Item label="商家ID">{order.merchantId || '-'}</Descriptions.Item>
        <Descriptions.Item label="下单时间">{order.createdAt ? dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
        {order.payTime && <Descriptions.Item label="支付时间">{dayjs(order.payTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>}
        {order.remark && <Descriptions.Item label="备注" span={2}><Text type="secondary">{order.remark}</Text></Descriptions.Item>}
      </Descriptions>

      {items.length > 0 ? (
        <Table dataSource={items} columns={itemColumns} rowKey="id" pagination={false} size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4} align="right"><Text strong>合计</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={1}><Text style={{ color: '#E85D2F', fontWeight: 700 }}>¥{Number(order.payAmount || 0).toFixed(2)}</Text></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      ) : (
        <Text type="secondary">暂无商品明细</Text>
      )}
    </Modal>
  );
};

/* ============================================================
   订单管理页面
   ============================================================ */
const Orders: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [detailOrder, setDetailOrder] = useState<any>(null);

  const columns: ProColumns<any>[] = [
    { title: '#', width: 45, search: false, render: (_: any, __: any, i: number) => i + 1 },
    { title: '订单号', dataIndex: 'orderNo', width: 150, copyable: true },
    {
      title: '商品', width: 220, search: false, hideInSearch: true,
      render: (_, record) => renderProduct(record),
    },
    { title: '金额', dataIndex: 'payAmount', width: 80, search: false, render: (v) => <Text style={{ color: '#E85D2F', fontWeight: 600 }}>¥{Number(v).toFixed(2)}</Text> },
    { title: '类型', dataIndex: 'orderType', width: 70, search: false,
      render: (v: string) => <Tag>{orderTypeNames[v] || v}</Tag> },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (v: string) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.label || v}</Tag> },
    { title: '下单时间', dataIndex: 'createdAt', width: 145, search: false,
      render: (v: string) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-' },
    {
      title: '操作', width: 180, search: false,
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" size="small" onClick={() => setDetailOrder(record)}>详情</Button>
          {record.status === 'pending_pay' && (
            <>
              <Popconfirm title="确认支付？" onConfirm={async () => { await orderApi.pay(record.id); message.success('已支付'); actionRef.current?.reload(); }}>
                <Button type="link" size="small" style={{ color: '#52c41a' }}>支付</Button>
              </Popconfirm>
              <Popconfirm title="确定取消？" onConfirm={async () => { await orderApi.cancel(record.id); message.success('已取消'); actionRef.current?.reload(); }}>
                <Button type="link" size="small" danger>取消</Button>
              </Popconfirm>
            </>
          )}
          {record.status === 'paid' && (
            <Popconfirm title="确定发货？" onConfirm={async () => { await orderApi.confirm(record.id); message.success('已确认'); actionRef.current?.reload(); }}>
              <Button type="link" size="small">发货</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const res = await orderApi.list({ page: params.current, pageSize: params.pageSize, status: params.status });
          const data = res.data?.data || res.data;
          return { data: data.list || [], success: true, total: data.pagination?.total || 0 };
        }}
        rowKey="id"
        search={{ labelWidth: 60 }}
      />
      <OrderDetailModal order={detailOrder} open={!!detailOrder} onClose={() => setDetailOrder(null)} />
    </>
  );
};

export default Orders;
