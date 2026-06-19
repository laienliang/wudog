/**
 * 商家工作台
 * 展示商家运营数据概览：今日订单数、待发货数、待退款数、营业额
 * 以及最近订单概览（仅展示，不提供增删改搜索——订单管理由业务模块组负责）
 */
import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Spin } from 'antd';
import { ShoppingCartOutlined, CarOutlined, DollarOutlined, ReloadOutlined } from '@ant-design/icons';
import request from '../../utils/request';

export default function MerchantDashboard() {
  const merchantStr = localStorage.getItem('merchant');
  const merchant = merchantStr ? JSON.parse(merchantStr) : {};

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingShipped: 0,
    pendingRefund: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  /** 加载商家统计数据（含最近订单概览） */
  const loadStats = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/merchant-dashboard/stats');
      if (res.code === 200) {
        setStats({
          todayOrders: res.data.todayOrders || 0,
          pendingShipped: res.data.pendingShipped || 0,
          pendingRefund: res.data.pendingRefund || 0,
          totalRevenue: res.data.totalRevenue || 0,
        });
      }
    } catch { /* 静默处理 */ } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div>
        <h2 style={{
          marginBottom: 'var(--spacing-lg)',
          fontSize: 'var(--text-h2)',
          fontFamily: 'var(--font-family-heading)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--color-text-primary)',
        }}>
          商家工作台
        </h2>

        {/* 欢迎卡片 */}
        <Card style={{ marginBottom: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{
            fontSize: 'var(--text-h3)',
            fontFamily: 'var(--font-family-heading)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-xs)',
          }}>
            欢迎回来，{merchant.shop_name || '商家'}
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            所属模块：{merchant.module_type || '-'}
          </p>
        </Card>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-light)', border: 'none' }}>
              <Statistic title="今日订单" value={stats.todayOrders} prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: 'var(--color-primary)' }} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-light)', border: 'none' }}>
              <Statistic title="待发货" value={stats.pendingShipped} prefix={<CarOutlined />}
                valueStyle={{ color: 'var(--color-dawn)' }} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-light)', border: 'none' }}>
              <Statistic title="待退款" value={stats.pendingRefund} prefix={<ReloadOutlined />}
                valueStyle={{ color: 'var(--color-embroidery)' }} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-light)', border: 'none' }}>
              <Statistic title="营业额" value={stats.totalRevenue} prefix={<DollarOutlined />}
                precision={2} valueStyle={{ color: 'var(--color-terraced)' }} />
            </Card>
          </Col>
        </Row>

        {/* 订单管理区域（由业务模块组负责开发，此处为占位） */}
        <Card
          title="订单管理"
          style={{
            marginTop: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-light)',
            border: 'none',
          }}
        >
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: 'var(--color-text-tertiary)',
          }}>
            <ShoppingCartOutlined style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }} />
            <p style={{ fontSize: 'var(--text-body)', margin: 0 }}>
              此模块由业务模块组（第 1-4 组）开发并嵌入
            </p>
            <p style={{ fontSize: 'var(--text-caption)', margin: '8px 0 0', opacity: 0.6 }}>
              订单管理、商品管理、房源管理等业务页面不属于本组（第 6 组）职责范围
            </p>
          </div>
        </Card>
      </div>
    </Spin>
  );
}
