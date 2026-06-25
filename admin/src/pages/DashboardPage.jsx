import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, AuditOutlined } from '@ant-design/icons';
import request from '../utils/request';

export default function DashboardPage() {
  const [data, setData] = useState({});

  useEffect(() => {
    request.get('/admin/dashboard').then(res => setData(res.data || {})).catch(() => {});
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>工作台</h2>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="总用户数" value={data.totalUsers || 0} prefix={<UserOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="总订单数" value={data.totalOrders || 0} prefix={<ShoppingCartOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="总交易额" value={data.totalRevenue || 0} prefix={<DollarOutlined />} suffix="元" /></Card></Col>
        <Col span={6}><Card><Statistic title="待审核商家" value={data.pendingMerchants || 0} prefix={<AuditOutlined />} /></Card></Col>
      </Row>
    </div>
  );
}
