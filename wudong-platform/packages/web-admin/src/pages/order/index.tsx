import React, { useRef, useState } from 'react';
import { Button, Tag, Modal, Descriptions, Tabs, Space, Empty, Typography, Card, Table, Popconfirm } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import dayjs from 'dayjs';
import { orderApi } from '../../services/api';
import {
  ShoppingCartOutlined, WarningOutlined, AuditOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

/* ============================================================
   订单类型映射
   ============================================================ */
const orderTypeMap: Record<string, { color: string; label: string }> = {
  clothing: { color: 'blue', label: '商品' },
  food_meal: { color: 'green', label: '餐饮' },
  food_product: { color: 'green', label: '特产' },
  accommodation: { color: 'purple', label: '住宿' },
  travel: { color: 'orange', label: '出行' },
};

/* ============================================================
   状态映射
   ============================================================ */
const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  pending_pay: { bg: '#FFF0CC', color: '#D48806', label: '待支付' },
  paid: { bg: '#D6E4FF', color: '#1D4ED8', label: '已支付' },
  confirmed: { bg: '#C4F0E6', color: '#0C6F5A', label: '已确认' },
  completed: { bg: '#D6F5D6', color: '#3D7A3D', label: '已完成' },
  cancelled: { bg: '#E5E5E5', color: '#6B6B6B', label: '已取消' },
  refunded: { bg: '#FFD6D6', color: '#C0392B', label: '已退款' },
};

const orderTypeEnum: Record<string, { text: string }> = {
  clothing: { text: '商品' },
  food_meal: { text: '餐饮' },
  food_product: { text: '特产' },
  accommodation: { text: '住宿' },
  travel: { text: '出行' },
};

const statusEnum: Record<string, { text: string }> = {
  pending_pay: { text: '待支付' },
  paid: { text: '已支付' },
  confirmed: { text: '已确认' },
  completed: { text: '已完成' },
  cancelled: { text: '已取消' },
  refunded: { text: '已退款' },
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
    { title: '规格', dataIndex: 'skuName', width: 120, render: (v: string) => v ? <Text style={{ fontSize: 12 }}>{v}</Text> : <Text type="secondary" style={{ fontSize: 12 }}>-</Text> },
    { title: '单价', dataIndex: 'unitPrice', width: 80, align: 'right' as const, render: (v: number) => `¥${Number(v).toFixed(2)}` },
    { title: '数量', dataIndex: 'quantity', width: 60, align: 'center' as const },
    { title: '小计', dataIndex: 'subtotal', width: 80, align: 'right' as const, render: (v: number) => <Text style={{ color: '#E85D2F', fontWeight: 600 }}>¥{Number(v).toFixed(2)}</Text> },
  ];

  return (
    <Modal title={`订单详情 - ${order.orderNo}`} open={open} onCancel={onClose} footer={<Button onClick={onClose}>关闭</Button>} width={700}>
      <Descriptions column={2} size="small" bordered style={{ marginBottom: 16 }}>
        <Descriptions.Item label="订单号" span={2}><Text copyable style={{ fontSize: 12 }}>{order.orderNo}</Text></Descriptions.Item>
        <Descriptions.Item label="订单类型"><Tag color={orderTypeMap[order.orderType]?.color}>{orderTypeMap[order.orderType]?.label || order.orderType}</Tag></Descriptions.Item>
        <Descriptions.Item label="订单状态">
          <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600,
            background: (statusStyle[order.status] || statusStyle.cancelled).bg, color: (statusStyle[order.status] || statusStyle.cancelled).color }}>
            {(statusStyle[order.status] || statusStyle.cancelled).label}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="支付金额"><Text style={{ color: '#E85D2F', fontWeight: 600 }}>¥{Number(order.payAmount || 0).toFixed(2)}</Text></Descriptions.Item>
        <Descriptions.Item label="总金额">¥{Number(order.totalAmount || 0).toFixed(2)}</Descriptions.Item>
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
   订单表格组件（公共）
   ============================================================ */
const OrderTable: React.FC<{
  statusFilter?: string;
  extraFilter?: any;
}> = ({ statusFilter, extraFilter }) => {
  const actionRef = useRef<ActionType>();
  const [detailOrder, setDetailOrder] = useState<any>(null);

  const columns: ProColumns<any>[] = [
    { title: '#', width: 45, search: false, render: (_: any, __: any, i: number) => i + 1 },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 160,
      copyable: true,
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      width: 80,
      valueType: 'select',
      valueEnum: orderTypeEnum,
      render: (_, record) => {
        const type = orderTypeMap[record.orderType];
        return <Tag color={type?.color}>{type?.label || record.orderType}</Tag>;
      },
    },
    {
      title: '商品信息', width: 240, search: false,
      render: (_: any, record: any) => {
        try {
          const items = record?.items;
          if (items && Array.isArray(items) && items.length > 0) {
            const first = items[0];
            const name = first?.productName || '-';
            const img = first?.productImage || '';
            return (
              <Space>
                {img ? (
                  <img src={img} width={40} height={40} style={{ borderRadius: 4, objectFit: 'cover', border: '1px solid #f0f0f0' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div style={{ width: 40, height: 40, borderRadius: 4, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍽</div>
                )}
                <div>
                  <Text style={{ fontSize: 13 }}>{name}</Text>
                  {items.length > 1 && <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>+{items.length - 1}件商品</Text>}
                </div>
              </Space>
            );
          }
          if (record?.remark) {
            return <Text type="secondary" style={{ fontSize: 12 }}>{record.remark}</Text>;
          }
          return <Text type="secondary">-</Text>;
        } catch {
          return <Text type="secondary">-</Text>;
        }
      },
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 65,
      search: false,
    },
    {
      title: '金额',
      dataIndex: 'payAmount',
      width: 80,
      search: false,
      render: (v: number) => <Text style={{ color: '#E85D2F', fontWeight: 600 }}>¥{Number(v || 0).toFixed(2)}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      valueType: 'select',
      valueEnum: statusEnum,
      render: (_: any, record: any) => {
        const v = record?.status || '';
        const s = statusStyle[v] || { bg: '#F5F5F5', color: '#6B6B6B', label: v };
        return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 145,
      search: false,
      render: (v: string) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      width: 160,
      search: false,
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
            <Button type="link" size="small" style={{ color: '#1F5FA8' }}
              onClick={async () => { await orderApi.confirm(record.id); message.success('已确认'); actionRef.current?.reload(); }}>确认</Button>
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
          const queryParams: any = {
            page: params.current,
            pageSize: params.pageSize,
            status: statusFilter || params.status,
            orderType: params.orderType,
          };
          if (extraFilter) {
            Object.assign(queryParams, extraFilter);
          }
          const res = await orderApi.list(queryParams);
          const data = res.data?.data || res.data;
          return {
            data: data.list || [],
            success: true,
            total: data.pagination?.total || 0,
          };
        }}
        rowKey="id"
        search={{
          labelWidth: 60,
          defaultCollapsed: false,
        }}
        headerTitle="订单列表"
        toolBarRender={() => []}
      />
      <OrderDetailModal order={detailOrder} open={!!detailOrder} onClose={() => setDetailOrder(null)} />
    </>
  );
};

/* ============================================================
   异常订单页面
   ============================================================ */
const ExceptionOrders: React.FC = () => {
  return <OrderTable statusFilter={'cancelled'} />;
};

/* ============================================================
   退款审批页面
   ============================================================ */
const RefundOrders: React.FC = () => {
  return <OrderTable statusFilter={'refunded'} />;
};

/* ============================================================
   全局订单管理页面 - Tab 容器
   ============================================================ */
const GlobalOrders: React.FC = () => {
  const [activeKey, setActiveKey] = useState('all');

  return (
    <div style={{ padding: 0 }}>
      <Card
        style={{
          borderRadius: 10,
          border: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          marginBottom: 16,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          style={{ margin: 0, padding: '0 24px' }}
          items={[
            {
              key: 'all',
              label: <span><ShoppingCartOutlined /> 全部订单</span>,
              children: (
                <div style={{ padding: '16px 0' }}>
                  <OrderTable />
                </div>
              ),
            },
            {
              key: 'exception',
              label: <span><WarningOutlined /> 异常订单</span>,
              children: (
                <div style={{ padding: '16px 0' }}>
                  <ExceptionOrders />
                </div>
              ),
            },
            {
              key: 'refund',
              label: <span><AuditOutlined /> 退款审批</span>,
              children: (
                <div style={{ padding: '16px 0' }}>
                  <RefundOrders />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default GlobalOrders;
