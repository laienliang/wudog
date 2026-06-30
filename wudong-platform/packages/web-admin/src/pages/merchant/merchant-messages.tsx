import React from 'react';
import { Card, List, Tag, Typography, Space, Empty } from 'antd';
import {
  BellOutlined, ShoppingCartOutlined, WarningOutlined, CheckCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

/* ============================================================
   商家品牌色
   ============================================================ */
const COLORS = {
  primary: '#6B8E3D',
  warning: '#fa8c16',
  danger: '#ff4d4f',
  info: '#1890ff',
  success: '#52c41a',
};

/* ============================================================
   Mock 消息数据
   ============================================================ */
const mockMessages = [
  {
    id: 1,
    type: 'order',
    title: '新订单通知',
    content: '您有一笔新订单，订单号：DD20260627015，金额 ¥128.00',
    time: '2026-06-27 15:30',
    read: false,
  },
  {
    id: 2,
    type: 'system',
    title: '系统通知',
    content: '您的店铺「乌东苗绣工坊」本月营业额已超过上月的 120%',
    time: '2026-06-27 10:00',
    read: false,
  },
  {
    id: 3,
    type: 'warning',
    title: '库存预警',
    content: '商品「苗绣手工香包」库存不足，当前仅剩 3 件',
    time: '2026-06-26 18:20',
    read: true,
  },
  {
    id: 4,
    type: 'order',
    title: '退款申请',
    content: '用户申请退款，订单号：DD20260625003，金额 ¥88.00',
    time: '2026-06-26 14:15',
    read: true,
  },
  {
    id: 5,
    type: 'success',
    title: '结算完成',
    content: '2026年6月第二期结算已完成，金额 ¥12,580.00 已转入您的账户',
    time: '2026-06-25 09:00',
    read: true,
  },
];

const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  order: { icon: <ShoppingCartOutlined />, color: COLORS.info },
  system: { icon: <BellOutlined />, color: COLORS.primary },
  warning: { icon: <WarningOutlined />, color: COLORS.warning },
  success: { icon: <CheckCircleOutlined />, color: COLORS.success },
};

/* ============================================================
   商家消息通知页面
   ============================================================ */
const MerchantMessages: React.FC = () => {
  return (
    <Card
      title={
        <Space>
          <BellOutlined style={{ color: COLORS.primary }} />
          <span style={{ fontSize: 15, fontWeight: 500 }}>消息通知</span>
        </Space>
      }
      style={{
        borderRadius: 10,
        border: 'none',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
      styles={{ body: { padding: '8px 24px' } }}
    >
      <List
        dataSource={mockMessages}
        locale={{
          emptyText: <Empty description="暂无消息" />,
        }}
        renderItem={(item) => {
          const cfg = typeConfig[item.type] || { icon: <BellOutlined />, color: '#8c8c8c' };
          return (
            <List.Item
              style={{
                padding: '16px 0',
                borderBottom: '1px solid #f0f0f0',
                opacity: item.read ? 0.6 : 1,
              }}
              extra={
                <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                  {item.time}
                </Text>
              }
            >
              <List.Item.Meta
                avatar={
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: `${cfg.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cfg.color,
                    fontSize: 18,
                  }}>
                    {cfg.icon}
                  </div>
                }
                title={
                  <Space size={8}>
                    <span style={{ fontWeight: item.read ? 400 : 600, fontSize: 14 }}>
                      {item.title}
                    </span>
                    {!item.read && <Tag color={cfg.color} style={{ fontSize: 11, lineHeight: '18px', borderRadius: 4 }}>新</Tag>}
                  </Space>
                }
                description={
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.content}</Text>
                }
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default MerchantMessages;
