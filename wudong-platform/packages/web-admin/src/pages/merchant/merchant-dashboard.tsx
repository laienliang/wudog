import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Tag, Space } from 'antd';
import {
  ShoppingCartOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  StarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

/* ============================================================
   商家品牌色
   ============================================================ */
const COLORS = {
  primary: '#6B8E3D',
  primaryLight: '#8DB560',
  accent: '#8B6B4A',
  success: '#52c41a',
  warning: '#fa8c16',
  danger: '#ff4d4f',
  info: '#1890ff',
};

/* ============================================================
   商家工作台 Dashboard
   ============================================================ */
const MerchantDashboard: React.FC = () => {
  /* ---------- 统计数据（Mock） ---------- */
  const stats = [
    {
      title: '今日订单',
      value: 18,
      prefix: <ShoppingCartOutlined />,
      color: COLORS.info,
      change: 12.5,
      changeText: '较昨日',
    },
    {
      title: '待处理',
      value: 5,
      prefix: <ClockCircleOutlined />,
      color: COLORS.warning,
      change: -8.3,
      changeText: '较昨日',
    },
    {
      title: '本月营业额',
      value: 28680,
      prefix: <DollarOutlined />,
      color: COLORS.primary,
      suffix: '¥',
      precision: 2,
      change: 22.1,
      changeText: '较上月',
    },
    {
      title: '好评率',
      value: 98.6,
      prefix: <StarOutlined />,
      color: COLORS.accent,
      suffix: '%',
      precision: 1,
      change: 0.5,
      changeText: '较上月',
    },
  ];

  /* ---------- 最近订单表格 ---------- */
  const recentOrderColumns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 180,
      render: (v: string) => <Text code style={{ fontSize: 12 }}>{v}</Text>,
    },
    {
      title: '商品',
      dataIndex: 'product',
      width: 160,
      ellipsis: true,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 100,
      render: (v: number) => (
        <span style={{ fontWeight: 500, color: COLORS.accent }}>¥{v.toFixed(2)}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      render: (v: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          pending: { text: '待支付', color: COLORS.warning },
          paid: { text: '已支付', color: COLORS.info },
          confirmed: { text: '已确认', color: COLORS.primary },
          completed: { text: '已完成', color: COLORS.success },
          refunded: { text: '已退款', color: '#8c8c8c' },
        };
        const s = statusMap[v] || { text: v, color: '#595959' };
        return (
          <Tag color={s.color} style={{ borderRadius: 4, fontSize: 12 }}>
            {s.text}
          </Tag>
        );
      },
    },
    {
      title: '下单时间',
      dataIndex: 'createdAt',
      width: 150,
    },
  ];

  const recentOrders = [
    { orderNo: 'DD20260627008', product: '苗绣手工香包礼盒', amount: 128.0, status: 'paid', createdAt: '2026-06-27 15:20' },
    { orderNo: 'DD20260627009', product: '蜡染方巾 蓝色经典款', amount: 88.0, status: 'completed', createdAt: '2026-06-27 14:45' },
    { orderNo: 'DD20260627010', product: '银饰手镯 苗族花纹', amount: 368.0, status: 'pending', createdAt: '2026-06-27 13:30' },
    { orderNo: 'DD20260627011', product: '苗绣挂画 山水系列', amount: 588.0, status: 'confirmed', createdAt: '2026-06-27 11:15' },
    { orderNo: 'DD20260627012', product: '民族服饰套装 儿童款', amount: 256.0, status: 'completed', createdAt: '2026-06-27 09:40' },
  ];

  return (
    <div style={{ padding: 0 }}>
      {/* ============== 顶部统计卡片 ============== */}
      <Row gutter={[16, 16]}>
        {stats.map((item) => (
          <Col xs={12} sm={12} md={6} key={item.title}>
            <Card
              hoverable
              style={{
                borderRadius: 10,
                border: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
              styles={{ body: { padding: '20px 24px' } }}
            >
              <Statistic
                title={
                  <span style={{ fontSize: 14, color: '#8c8c8c', fontWeight: 400 }}>
                    {item.title}
                  </span>
                }
                value={item.value}
                precision={item.precision}
                prefix={item.prefix}
                suffix={item.suffix}
                valueStyle={{ color: item.color, fontSize: 28, fontWeight: 600 }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#bfbfbf' }}>
                <Space size={4}>
                  {item.change >= 0 ? (
                    <ArrowUpOutlined style={{ color: COLORS.success, fontSize: 11 }} />
                  ) : (
                    <ArrowDownOutlined style={{ color: COLORS.danger, fontSize: 11 }} />
                  )}
                  <span style={{
                    color: item.change >= 0 ? COLORS.success : COLORS.danger,
                    fontWeight: 500,
                  }}>
                    {Math.abs(item.change)}%
                  </span>
                  <span>{item.changeText}</span>
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ============== 快捷操作提示 ============== */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={16}>
          <Card
            title={
              <Space>
                <ShoppingCartOutlined style={{ color: COLORS.primary }} />
                <span style={{ fontSize: 15, fontWeight: 500 }}>最近订单</span>
              </Space>
            }
            style={{
              borderRadius: 10,
              border: 'none',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
            styles={{ body: { padding: '16px 24px' } }}
          >
            <Table
              dataSource={recentOrders}
              columns={recentOrderColumns}
              rowKey="orderNo"
              pagination={false}
              size="middle"
              style={{ marginTop: -8 }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: COLORS.warning }} />
                <span style={{ fontSize: 15, fontWeight: 500 }}>待处理事项</span>
              </Space>
            }
            style={{
              borderRadius: 10,
              border: 'none',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
            styles={{ body: { padding: '16px 24px' } }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">待发货订单</Text>
                <Tag color="blue" style={{ borderRadius: 6, fontSize: 13, fontWeight: 500 }}>
                  3 笔
                </Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">未读消息</Text>
                <Tag color="orange" style={{ borderRadius: 6, fontSize: 13, fontWeight: 500 }}>
                  5 条
                </Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">待处理退款</Text>
                <Tag color="red" style={{ borderRadius: 6, fontSize: 13, fontWeight: 500 }}>
                  1 笔
                </Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">商品库存预警</Text>
                <Tag color="gold" style={{ borderRadius: 6, fontSize: 13, fontWeight: 500 }}>
                  2 项
                </Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MerchantDashboard;
