/**
 * 数据看板页面
 * 展示平台运营数据概览，包含统计卡片和 ECharts 图表
 *
 * 设计特色：
 * - 统计卡片使用左侧彩色竖条装饰，颜色对应数据维度
 * - 用户=苗银蓝、商家=梯田绿、待审=刺绣橙、订单=黎明金
 * - ECharts 图表使用品牌色系
 * - 标题使用品牌字体层级
 */
import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Spin } from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  PictureOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  AuditOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import request from '../utils/request';
import { MODULE_TYPE_MAP, AUDIT_STATUS_MAP } from '../utils/format';

/** 统计卡片数据维度配色 */
const CARD_COLORS = {
  user: { color: '#1F5FA8', bg: '#E8F1FB', icon: <TeamOutlined /> },
  merchant: { color: '#6B8E3D', bg: '#F0F7E8', icon: <ShopOutlined /> },
  pending: { color: '#E85D2F', bg: '#FFF1EA', icon: <AuditOutlined /> },
  order: { color: '#D4A14B', bg: '#FDF6E9', icon: <ShoppingCartOutlined /> },
  admin: { color: '#1F5FA8', bg: '#E8F1FB', icon: <UserOutlined /> },
  application: { color: '#7A5230', bg: '#F5EDE6', icon: <FileTextOutlined /> },
  announcement: { color: '#595959', bg: '#F7F8FA', icon: <FileTextOutlined /> },
  carousel: { color: '#8C8C8C', bg: '#FAFAFA', icon: <PictureOutlined /> },
};

/** ECharts 品牌色系 */
const CHART_COLORS = ['#1F5FA8', '#E85D2F', '#6B8E3D', '#D4A14B', '#7A5230', '#3B7BC5'];

/**
 * 带左侧彩色竖条的统计卡片
 * 这是本页面的设计签名元素
 */
function StatCard({
  title,
  value,
  colorConfig,
  style,
}: {
  title: string;
  value: number;
  colorConfig: typeof CARD_COLORS[keyof typeof CARD_COLORS];
  style?: React.CSSProperties;
}) {
  return (
    <Card
      hoverable
      style={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-light)',
        border: 'none',
        overflow: 'hidden',
        ...style,
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {/* 左侧彩色竖条 */}
        <div style={{
          width: 4,
          background: colorConfig.color,
          borderRadius: '4px 0 0 4px',
          flexShrink: 0,
        }} />
        {/* 内容区域 */}
        <div style={{
          flex: 1,
          padding: 'var(--spacing-md) var(--spacing-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
        }}>
          {/* 图标 */}
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            background: colorConfig.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            color: colorConfig.color,
            flexShrink: 0,
          }}>
            {colorConfig.icon}
          </div>
          {/* 数据 */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
              marginBottom: 4,
            }}>
              {title}
            </div>
            <div style={{
              fontSize: 'var(--text-h2)',
              fontWeight: 'var(--weight-bold)',
              fontFamily: 'var(--font-family-number)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
            }}>
              {value.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    userCount: 0,
    adminCount: 0,
    merchantCount: 0,
    applicationCount: 0,
    orderCount: 0,
    announcementCount: 0,
    carouselCount: 0,
    pendingApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadRecentApplications();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [users, admins, merchants, apps, orders, announcements, carousels, pendingApps]: any[] = await Promise.all([
        request.get('/users/list', { params: { page: 1, pageSize: 1 } }).catch(() => ({ data: { total: 0 } })),
        request.get('/admin/list', { params: { page: 1, pageSize: 1 } }).catch(() => ({ data: { total: 0 } })),
        request.get('/merchants/list', { params: { page: 1, pageSize: 1 } }).catch(() => ({ data: { total: 0 } })),
        request.get('/merchant-applications/list', { params: { page: 1, pageSize: 1 } }).catch(() => ({ data: { total: 0 } })),
        request.get('/orders/list', { params: { page: 1, pageSize: 1 } }).catch(() => ({ data: { total: 0 } })),
        request.get('/announcements/list', { params: { page: 1, pageSize: 1 } }).catch(() => ({ data: { total: 0 } })),
        request.get('/carousels/list', { params: { page: 1, pageSize: 1 } }).catch(() => ({ data: { total: 0 } })),
        request.get('/merchant-applications/list', { params: { page: 1, pageSize: 1, status: 'pending' } }).catch(() => ({ data: { total: 0 } })),
      ]);
      setStats({
        userCount: users?.data?.total || 0,
        adminCount: admins?.data?.total || 0,
        merchantCount: merchants?.data?.total || 0,
        applicationCount: apps?.data?.total || 0,
        orderCount: orders?.data?.total || 0,
        announcementCount: announcements?.data?.total || 0,
        carouselCount: carousels?.data?.total || 0,
        pendingApplications: pendingApps?.data?.total || 0,
      });
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const loadRecentApplications = async () => {
    try {
      const res: any = await request.get('/merchant-applications/list', { params: { page: 1, pageSize: 5 } });
      if (res.code === 200) setRecentApplications(res.data.list);
    } catch (err) { /* ignore */ }
  };

  /** 模块分布饼图配置 */
  const getPieOption = () => ({
    title: {
      text: '商家模块分布',
      left: 'center',
      textStyle: {
        fontFamily: "'Alibaba PuHuiTi', 'Inter', sans-serif",
        fontSize: 16,
        fontWeight: 500,
        color: '#1A1A1A',
      },
    },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    color: CHART_COLORS,
    series: [{
      name: '商家模块',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 0, name: '非遗商品（衣）' },
        { value: 0, name: '餐饮美食（食）' },
        { value: 0, name: '住宿预订（住）' },
        { value: 0, name: '线路订票（行）' },
      ],
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
      },
    }],
  });

  /** 订单趋势折线图配置 */
  const getLineOption = () => ({
    title: {
      text: '近7天订单趋势',
      left: 'center',
      textStyle: {
        fontFamily: "'Alibaba PuHuiTi', 'Inter', sans-serif",
        fontSize: 16,
        fontWeight: 500,
        color: '#1A1A1A',
      },
    },
    tooltip: { trigger: 'axis' },
    color: [CHART_COLORS[0]],
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: { type: 'value' },
    series: [{
      name: '订单数',
      type: 'line',
      smooth: true,
      data: [0, 0, 0, 0, 0, 0, 0],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(31,95,168,0.30)' },
            { offset: 1, color: 'rgba(31,95,168,0.02)' },
          ],
        },
      },
      lineStyle: { width: 2 },
    }],
  });

  const appColumns = [
    { title: '申请人', dataIndex: 'applicant_name' },
    { title: '店铺名称', dataIndex: 'shop_name' },
    { title: '申请模块', dataIndex: 'module_type', render: (v: string) => MODULE_TYPE_MAP[v] || v },
    { title: '状态', dataIndex: 'status', render: (v: string) => {
      const s = AUDIT_STATUS_MAP[v] || { color: 'default', text: v };
      return <Tag color={s.color}>{s.text}</Tag>;
    }},
    { title: '申请时间', dataIndex: 'created_at', render: (v: string) => v?.slice(0, 16) },
  ];

  return (
    <Spin spinning={loading}>
      <div>
        {/* 页面标题 */}
        <h2 style={{
          marginBottom: 'var(--spacing-lg)',
          fontSize: 'var(--text-h2)',
          fontFamily: 'var(--font-family-heading)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--color-text-primary)',
        }}>
          数据看板
        </h2>

        {/* 核心统计卡片 - 第一行 */}
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} lg={6}>
            <StatCard title="注册用户" value={stats.userCount} colorConfig={CARD_COLORS.user} />
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <StatCard title="商家数量" value={stats.merchantCount} colorConfig={CARD_COLORS.merchant} />
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <StatCard title="待审核申请" value={stats.pendingApplications} colorConfig={CARD_COLORS.pending} />
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <StatCard title="平台订单" value={stats.orderCount} colorConfig={CARD_COLORS.order} />
          </Col>
        </Row>

        {/* 次要统计卡片 - 第二行 */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={12} sm={8} lg={6}>
            <StatCard title="管理员" value={stats.adminCount} colorConfig={CARD_COLORS.admin} />
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <StatCard title="入驻申请" value={stats.applicationCount} colorConfig={CARD_COLORS.application} />
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <StatCard title="平台公告" value={stats.announcementCount} colorConfig={CARD_COLORS.announcement} />
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <StatCard title="轮播图" value={stats.carouselCount} colorConfig={CARD_COLORS.carousel} />
          </Col>
        </Row>

        {/* ECharts 图表 */}
        <Row gutter={[16, 16]} style={{ marginTop: 'var(--spacing-lg)' }}>
          <Col xs={24} lg={12}>
            <Card
              style={{
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-light)',
                border: 'none',
              }}
            >
              <ReactECharts option={getPieOption()} style={{ height: 300 }} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              style={{
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-light)',
                border: 'none',
              }}
            >
              <ReactECharts option={getLineOption()} style={{ height: 300 }} />
            </Card>
          </Col>
        </Row>

        {/* 最近入驻申请 */}
        <Card
          title="最近入驻申请"
          style={{
            marginTop: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-light)',
            border: 'none',
          }}
        >
          <Table
            rowKey="id"
            columns={appColumns}
            dataSource={recentApplications}
            pagination={false}
            size="small"
          />
        </Card>
      </div>
    </Spin>
  );
}
