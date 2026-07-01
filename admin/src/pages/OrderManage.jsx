import { useState, useEffect } from 'react';
import { Table, Select, Space, message, Tag } from 'antd';
import { getOrderList, updateOrderStatus, approveCancelOrder, rejectCancelOrder } from '../utils/api';

const STATUS_MAP = {
  0: { text: '待处理', color: 'blue' },
  1: { text: '已确认', color: 'green' },
  2: { text: '已发货', color: 'orange' },
  3: { text: '已完成', color: 'default' },
  4: { text: '已取消', color: 'red' },
};

const STATUS_OPTIONS = [
  { label: '待处理', value: 0 },
  { label: '已确认', value: 1 },
  { label: '已发货', value: 2 },
  { label: '已完成', value: 3 },
];

export default function OrderManage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(undefined);

  const pageSize = 10;

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = { page, pageSize };
      const res = await getOrderList(params);
      let list = res.data?.list || [];
      if (statusFilter !== undefined) {
        list = list.filter(o => o.status === statusFilter);
      }
      setOrders(list);
      setTotal(res.data?.total || 0);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, { status });
      message.success('状态更新成功');
      loadOrders();
    } catch {
      message.error('更新失败');
    }
  };

  const handleApproveCancel = async (id) => {
    try {
      await approveCancelOrder(id);
      message.success('审批通过，订单已取消');
      loadOrders();
    } catch {
      message.error('审批失败');
    }
  };

  const handleRejectCancel = async (id) => {
    try {
      await rejectCancelOrder(id);
      message.success('已驳回取消申请');
      loadOrders();
    } catch {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: '订单号', dataIndex: 'order_no', width: 180 },
    { title: '商品名称', dataIndex: 'product_name', ellipsis: true },
    { title: '规格', dataIndex: 'spec_name', width: 100 },
    {
      title: '价格',
      dataIndex: 'price',
      width: 80,
      render: (v) => `¥${v}`,
    },
    { title: '数量', dataIndex: 'quantity', width: 60 },
    { title: '收货人', dataIndex: 'receiver_name', width: 80 },
    { title: '手机号', dataIndex: 'receiver_phone', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 140,
      render: (status, record) => {
        const s = STATUS_MAP[status] || { text: '未知', color: 'default' };
        return (
          <span>
            <Tag color={s.color}>{s.text}</Tag>
            {record.cancel_request === 1 && <Tag color="warning">{record.cancel_type === 2 ? '待退货' : '待取消'}</Tag>}
          </span>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 180,
      render: (text) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '操作',
      width: 200,
      render: (_, record) => {
        if (record.cancel_request === 1) {
          return (
            <Space>
              <a onClick={() => handleApproveCancel(record.id)} style={{ color: '#67c23a' }}>审批通过</a>
              <a onClick={() => handleRejectCancel(record.id)} style={{ color: '#f56c6c' }}>驳回</a>
            </Space>
          );
        }
        if (record.status === 4) {
          return <Tag color="default">已终止</Tag>;
        }
        return (
          <Select
            value={record.status}
            onChange={(v) => handleStatusChange(record.id, v)}
            options={STATUS_OPTIONS}
            style={{ width: 120 }}
            size="small"
          />
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Select
            placeholder="状态筛选"
            value={statusFilter}
            onChange={v => { setStatusFilter(v); setPage(1); }}
            allowClear
            style={{ width: 120 }}
            options={STATUS_OPTIONS}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: setPage,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </div>
  );
}
