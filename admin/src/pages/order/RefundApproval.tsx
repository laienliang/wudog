/**
 * 退款审批页面
 * 展示所有待退款审批的订单列表，支持通过或驳回退款申请
 * 驳回时需填写驳回原因
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Tag, message, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import request from '../../utils/request';

/** 订单类型显示映射 */
const ORDER_TYPE_MAP: Record<string, { text: string; color: string }> = {
  product: { text: '商品（衣）', color: 'blue' },
  food_order: { text: '餐饮（食）', color: 'orange' },
  stay: { text: '住宿（住）', color: 'purple' },
  ticket: { text: '门票（行）', color: 'cyan' },
  route: { text: '路线（行）', color: 'geekblue' },
};

/**
 * 退款审批页面组件
 * 提供退款申请的通过和驳回功能
 */
export default function RefundApprovalPage() {
  /** 待退款订单列表数据 */
  const [data, setData] = useState<any[]>([]);
  /** 数据总条数 */
  const [total, setTotal] = useState(0);
  /** 当前页码 */
  const [page, setPage] = useState(1);
  /** 每页条数 */
  const [pageSize, setPageSize] = useState(20);
  /** 数据加载状态 */
  const [loading, setLoading] = useState(false);
  /** 驳回弹窗显示状态 */
  const [rejectOpen, setRejectOpen] = useState(false);
  /** 当前驳回的订单记录 */
  const [rejecting, setRejecting] = useState<any>(null);
  /** 驳回原因表单实例 */
  const [form] = Form.useForm();

  /** 加载待退款订单列表数据（status=refunding） */
  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/orders/list', {
        params: { page, pageSize, status: 'refunding' },
      });
      if (res.code === 200) {
        setData(res.data.list);
        setTotal(res.data.total);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [page, pageSize]);

  /**
   * 审批通过退款申请
   * @param record - 订单记录
   */
  const handleApprove = async (record: any) => {
    const res: any = await request.post(`/orders/refund-approve/${record.id}`);
    if (res.code === 200) {
      message.success('退款审批通过');
      loadData();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 打开驳回弹窗
   * @param record - 要驳回的订单记录
   */
  const openReject = (record: any) => {
    setRejecting(record);
    form.resetFields();
    setRejectOpen(true);
  };

  /** 提交驳回操作，需填写驳回原因 */
  const handleReject = async () => {
    const values = await form.validateFields();
    try {
      const res: any = await request.post(`/orders/refund-reject/${rejecting.id}`, {
        reason: values.reason,
      });
      if (res.code === 200) {
        message.success('已驳回退款申请');
        setRejectOpen(false);
        loadData();
      } else {
        message.error(res.message);
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || '操作失败');
    }
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
    { title: '退款金额', dataIndex: 'total_amount', render: (v: number) => v != null ? `¥${Number(v).toFixed(2)}` : '-' },
    { title: '状态', dataIndex: 'status', render: () => <Tag color="orange">退款中</Tag> },
    { title: '创建时间', dataIndex: 'created_at' },
    {
      title: '操作', width: 180, fixed: 'right' as const, render: (_: any, record: any) => (
        <Space size="small" wrap>
          <Popconfirm title="确认通过该退款申请？" onConfirm={() => handleApprove(record)}>
            <Button type="link" size="small" icon={<CheckOutlined />} style={{ color: 'var(--color-terraced)' }}>通过</Button>
          </Popconfirm>
          <Button type="link" size="small" danger icon={<CloseOutlined />} onClick={() => openReject(record)}>驳回</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>退款审批</h2>
      {/* 待退款订单列表 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: page, pageSize, total, showSizeChanger: true,
          showTotal: t => `共 ${t} 条`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); },
        }}
      />
      {/* 驳回原因弹窗 */}
      <Modal
        title="驳回退款申请"
        open={rejectOpen}
        onOk={handleReject}
        onCancel={() => setRejectOpen(false)}
        destroyOnClose
        okText="确认驳回"
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="reason" label="驳回原因" rules={[{ required: true, message: '请输入驳回原因' }]}>
            <Input.TextArea rows={4} placeholder="请输入驳回退款的原因" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
