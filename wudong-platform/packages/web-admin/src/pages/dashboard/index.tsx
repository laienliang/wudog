import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Table, Spin, Tag, Button, Space, Typography, Empty, message,
} from 'antd';
import {
  DollarOutlined, ShoppingCartOutlined, UserOutlined, ShopOutlined,
  EyeOutlined, ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined,
  OrderedListOutlined, StarOutlined, MessageOutlined, InboxOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { adminApi } from '../../services/admin';
import dayjs from 'dayjs';

const { Text } = Typography;

/* ============================================================
   配色 — 品牌色（KPI卡片） + 低饱和图表色
   ============================================================ */
const C = {
  primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838',
  danger: '#D94A4A', price: '#E85D2F', star: '#FAAD14',
  textDark: '#333333', textBody: '#666666',
  textSecondary: '#8C8C8C', textLight: '#AAAAAA',
  border: '#ECECEF', grayLight: '#BFBFBF',
};
// 低饱和柔和图表色 — 暖黄/草绿/暖橘/暗红/清蓝/浅紫/鼠尾草
const SOFT = ['#7AA8C8', '#8FB89A', '#E8C87A', '#D4A07A', '#B87A7A', '#A898C8', '#9AAF88'];

const card: React.CSSProperties = {
  borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: '100%',
};

const ChangeTag: React.FC<{ v: number; up: boolean }> = ({ v, up }) => (
  <span style={{ fontSize: 12, color: up ? C.success : C.danger, marginLeft: 4, whiteSpace: 'nowrap' }}>
    {up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{v}%
  </span>
);

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    adminApi.getDashboard()
      .then((res: any) => setData(res.data || res || {}))
      .catch(() => message.error('加载失败'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;

  const d = data;

  // ===== 近7日趋势 =====
  const days: string[] = [], counts: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const dt = dayjs().subtract(i, 'day');
    days.push(dt.format('MM/DD'));
    const f = (d.dailyOrders || []).find((r: any) => dayjs(r.day).format('MM/DD') === dt.format('MM/DD'));
    counts.push(f ? f.count : 0);
  }

  // ===== 订单占比 =====
  const pieD = (d.moduleOrders || []).map((r: any, i: number) => ({
    value: r.count, name: ({ clothing: '商品', food_meal: '餐饮', accommodation: '住宿', travel: '出行' } as any)[r.module] || r.module,
    itemStyle: { color: SOFT[i % SOFT.length] },
  }));
  const pieTotal = pieD.reduce((s, r) => s + r.value, 0);

  // ===== GMV =====
  const barD = (d.moduleGMV || []).map((r: any, i: number) => ({
    name: ({ clothing: '商品', food_meal: '餐饮', accommodation: '住宿', travel: '出行' } as any)[r.module] || r.module,
    value: r.gmv, color: SOFT[i % SOFT.length],
  }));

  // ===== 用户增长 =====
  const uDays: string[] = [], uCounts: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const dt = dayjs().subtract(i, 'day');
    uDays.push(dt.format('MM/DD'));
    const f = (d.userGrowth || []).find((r: any) => dayjs(r.day).format('MM/DD') === dt.format('MM/DD'));
    uCounts.push(f ? f.count : 0);
  }

  // ===== 用户分层 =====
  const segC: Record<string, string> = { '高消费': C.danger, '中消费': C.warning, '低消费': C.success, '未消费': C.grayLight };
  const segD = (d.userSegmentation || []).map((r: any) => ({ value: r.count, name: r.level, itemStyle: { color: segC[r.level] || C.grayLight } }));

  const topics = (d.hotTopics || []).slice(0, 5);
  const topMerchants = (d.topMerchants || []).slice(0, 5);

  const statusTag = (v: string) => {
    const m: Record<string, any> = {
      pending_pay: { text: '待支付', color: '#D46B08', bg: '#FFF7E6' },
      paid: { text: '已支付', color: C.primary, bg: '#E8F4FD' },
      confirmed: { text: '已确认', color: '#08979C', bg: '#E6FFFB' },
      completed: { text: '已完成', color: C.success, bg: '#EDF7ED' },
      cancelled: { text: '已取消', color: C.textSecondary, bg: '#F5F5F5' },
      refunded: { text: '已退款', color: C.danger, bg: '#FFF1F0' },
    };
    const s = m[v] || { text: v, color: C.textSecondary, bg: '#F5F5F5' };
    return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 4, fontSize: 12, background: s.bg, color: s.color }}>{s.text}</span>;
  };

  const orderCols = [
    { title: '订单号', dataIndex: 'orderNo', width: 180, render: (v: string) => <Text copyable={{ text: v }} style={{ fontSize: 14, fontFamily: 'monospace' }}>{v}</Text> },
    { title: '用户', dataIndex: 'userName', width: 90 },
    { title: '类型', dataIndex: 'module', width: 70, render: (v: string) => <span style={{ color: C.primary }}>{({ clothing: '商品', food_meal: '餐饮', accommodation: '住宿', travel: '出行' } as any)[v] || v}</span> },
    { title: '金额', dataIndex: 'amount', width: 110, align: 'right' as const, render: (v: number) => <Text style={{ color: C.danger, fontWeight: 700, fontFamily: 'monospace' }}>¥{Number(v).toFixed(2)}</Text> },
    { title: '状态', dataIndex: 'status', width: 100, render: (v: string) => statusTag(v) },
    { title: '时间', dataIndex: 'createdAt', width: 140, render: (v: string) => <Text type="secondary" style={{ fontSize: 12 }}>{v ? dayjs(v).format('MM/DD HH:mm') : '-'}</Text> },
  ];

  const handleExport = () => {
    const rows = [['指标', '值'], ...Object.entries({ '总GMV(¥)': d.totalGMV, '总订单数': d.totalOrders, '已支付订单': d.paidOrders, '新增用户': d.newUsers, '活跃商家': d.activeMerchants, '总流水(¥)': d.totalRevenue, '平台收入(¥)': d.platformIncome, '待结算(¥)': d.pendingSettlement })];
    const csv = '﻿' + rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `看板_${dayjs().format('YYYYMMDD')}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    message.success('已导出');
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* ============================================================
          Row 1: KPI × 4 — 等宽等高，充足内边距
          ============================================================ */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* 5个卡片等宽展开，5+5+5+5+4=24 与底部对齐 */}
        {([
          { t: '总 GMV', v: `¥${d.totalGMV}`, c: '#1F5FA8', f: 'totalGMV' },
          { t: '总订单数', v: d.totalOrders, c: '#6B8E3D', f: 'totalOrders' },
          { t: '已支付订单', v: d.paidOrders || 0, c: '#E85D2F', f: '' },
          { t: '今日新增用户', v: d.newUsers, c: '#E8A838', f: 'newUsers' },
          { t: '活跃商家', v: d.activeMerchants, c: '#9B59B6', f: 'activeMerchants' },
        ] as const).map((item, idx) => {
          const ch = item.f ? (item.f === 'totalGMV' ? d.chGMV : item.f === 'totalOrders' ? d.chOrders : item.f === 'newUsers' ? d.chNewUsers : 0) : 0;
          const chUp = ch > 0;
          const chAbs = Math.abs(ch);
          return (
            <Col xs={12} md={idx === 4 ? 4 : 5} key={item.f || item.t}>
              <Card hoverable style={card}>
                <Statistic
                  title={<span style={{ color: C.textBody, fontSize: 15, display: 'flex', alignItems: 'center' }}>{item.t}{chAbs > 0 ? <ChangeTag v={chAbs} up={chUp} /> : null}</span>}
                  value={item.v}
                  prefix={<span style={{ color: item.c, fontSize: 24, marginRight: 10 }}>{item.icon}</span>}
                  valueStyle={{ color: item.c, fontWeight: 700, fontSize: 28 }}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* ============================================================
          Row 2: 三张图表 — 等宽等高，四周留白
          ============================================================ */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} md={8}>
          <Card title="近7日订单趋势" style={card}>
            <ReactECharts option={{
              grid: { left: 48, right: 20, top: 16, bottom: 32 },
              tooltip: { trigger: 'axis' },
              xAxis: { type: 'category', data: days, axisLabel: { color: C.textLight, fontSize: 12 }, axisLine: { show: false }, axisTick: { show: false } },
              yAxis: { type: 'value', minInterval: 1, axisLabel: { color: C.textLight, fontSize: 12 }, splitLine: { lineStyle: { color: C.border, type: 'dashed' } } },
              series: [{ data: counts, type: 'line', smooth: true, lineStyle: { color: C.primary, width: 2 }, itemStyle: { color: C.primary }, symbol: 'circle', symbolSize: 6, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#1F5FA812' }, { offset: 1, color: '#1F5FA800' }] } } }],
            }} style={{ height: 280 }} />
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card title="订单占比" style={card}>
            <ReactECharts option={{
              grid: { left: 20, right: 20, top: 20, bottom: 20 },
              tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
              graphic: pieTotal > 0 ? [
                { type: 'text', left: 'center', top: '38%', style: { text: `${pieTotal}`, textAlign: 'center', fill: C.primary, fontSize: 26, fontWeight: 700 } },
                { type: 'text', left: 'center', top: '54%', style: { text: '总订单', textAlign: 'center', fill: C.textSecondary, fontSize: 12 } },
              ] : [],
              series: [{ type: 'pie', radius: ['52%', '76%'], center: ['50%', '50%'], label: { show: true, formatter: "{d}%", color: C.textSecondary, fontSize: 12 }, data: pieD.length ? pieD : [{ value: 1, name: '无', itemStyle: { color: C.border } }] }],
            }} style={{ height: 280 }} />
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card title="各模块 GMV" style={card}>
            <ReactECharts option={{
              grid: { left: 56, right: 20, top: 20, bottom: 32 },
              tooltip: { trigger: 'axis', formatter: (p: any) => `${p[0].name}: ¥${Number(p[0].value).toLocaleString()}` },
              xAxis: { type: 'category', data: barD.map(r => r.name), axisLabel: { color: C.textLight, fontSize: 12 }, axisLine: { show: false }, axisTick: { show: false } },
              yAxis: { type: 'value', axisLabel: { color: C.textLight, fontSize: 12, formatter: (v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v }, splitLine: { lineStyle: { color: C.border, type: 'dashed' } } },
              series: [{ type: 'bar', barWidth: '40%', data: barD.map(r => ({ value: r.value, itemStyle: { color: r.color, borderRadius: [4, 4, 0, 0] } })), label: { show: true, position: 'top', formatter: (p: any) => `¥${p.value}`, fontSize: 12, color: C.textSecondary } }],
            }} style={{ height: 280 }} />
          </Card>
        </Col>
      </Row>

      {/* ============================================================
          Row 3: 四个小模块 — 等宽等高，优化内边距
          ============================================================ */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} md={6}>
          <Card title="近7日新增用户" style={card}>
            <ReactECharts option={{
              grid: { left: 44, right: 16, top: 16, bottom: 28 },
              tooltip: { trigger: 'axis' },
              xAxis: { type: 'category', data: uDays, axisLabel: { color: C.textLight, fontSize: 12 }, axisLine: { show: false }, axisTick: { show: false } },
              yAxis: { type: 'value', minInterval: 1, axisLabel: { color: C.textLight, fontSize: 12 }, splitLine: { lineStyle: { color: C.border, type: 'dashed' } } },
              series: [{ data: uCounts, type: 'line', smooth: true, lineStyle: { color: C.success, width: 2 }, itemStyle: { color: C.success }, symbol: 'circle', symbolSize: 5, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#6B8E3D12' }, { offset: 1, color: '#6B8E3D00' }] } } }],
            }} style={{ height: 240 }} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card title="用户分层" style={card}>
            <ReactECharts option={{
              grid: { left: 16, right: 16, top: 16, bottom: 20 },
              tooltip: { trigger: 'item', formatter: '{b}: {c}人 ({d}%)' },
              series: [{ type: 'pie', radius: ['48%', '72%'], center: ['50%', '50%'], label: { show: true, formatter: "{b}", color: C.textSecondary, fontSize: 12 }, data: segD.length ? segD : [{ value: 1, name: '暂无', itemStyle: { color: C.border } }] }],
            }} style={{ height: 240 }} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card title="热门话题" style={card}>
            {topics.length > 0 ? (
              <div style={{ padding: '4px 0' }}>
                {topics.map((t: any, i: number) => {
                  const rankColors = ['#D94A4A', '#E8A838', '#1F5FA8'];
                  const rankBg = i < 3 ? rankColors[i] : '#F0F0F0';
                  return (
                  <div key={t.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 4px', borderBottom: i < topics.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <Space size={10}>
                      <span style={{ width: 18, height: 18, borderRadius: 4, background: rankBg, color: i < 3 ? '#fff' : C.textSecondary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{i + 1}</span>
                      <Text style={{ fontSize: 14 }}>{t.name}</Text>
                    </Space>
                    <Text style={{ color: C.primary, fontWeight: 600, fontSize: 13 }}>{t.count}</Text>
                  </div>
                  );
                })}
              </div>
            ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无话题" />}
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card title="辅助指标" style={card}>
            <Row gutter={[8, 20]} style={{ padding: '8px 0' }}>
              {[
                { t: '用户总数', v: d.totalUsers, icon: <UserOutlined />, c: C.primary },
                { t: '游记总数', v: d.totalTravelogues, icon: <MessageOutlined />, c: C.success },
                { t: '点赞总数', v: d.totalLikes, icon: <StarOutlined />, c: C.danger },
                { t: '商家总数', v: d.totalMerchants, icon: <ShopOutlined />, c: C.warning },
                { t: '总流水', v: d.totalRevenue, suf: '¥', p: 2, c: C.price },
                { t: '平台收入', v: d.platformIncome, suf: '¥', p: 2, c: '#9B59B6' },
              ].map((item: any) => (
                <Col span={12} key={item.t}>
                  <Statistic
                    title={<Text style={{ color: C.textBody, fontSize: 13, display: "block", marginBottom: 2 }}>{item.t}</Text>}
                    value={item.v || 0}
                    precision={item.p}
                    suffix={item.suf}
                    prefix={item.icon ? <span style={{ color: item.c, fontSize: 18, marginRight: 6 }}>{item.icon}</span> : undefined}
                    valueStyle={{ color: item.c, fontWeight: 700, fontSize: 22 }}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* ============================================================
          Row 4: 四个数据小卡片 + 导出
          ============================================================ */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} md={4}>
          <Card title="今日 DAU" style={card}>
            <Statistic value={d.todayDAU} valueStyle={{ color: C.primary, fontWeight: 700, fontSize: 28 }} />
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginTop: 4 }}>本周 {d.weekDAU} · 本月 {d.monthDAU}</Text>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card title="支付转化率" style={card}>
            <Statistic value={`${d.conversionRate}%`} valueStyle={{ color: C.warning, fontWeight: 700, fontSize: 28 }} />
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginTop: 4 }}>已支付 / 总订单</Text>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card title="待结算金额" style={card}>
            <Statistic value={d.pendingSettlement} suffix="¥" valueStyle={{ color: C.warning, fontWeight: 700, fontSize: 28 }} />
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginTop: 4 }}>已支付未完成</Text>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ height: '100%', borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
              <Text type="secondary" style={{ fontSize: 13 }}>导出 CSV 报表</Text>
              <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}
                style={{ background: C.primary, borderColor: C.primary, boxShadow: '0 2px 6px rgba(31,95,168,0.25)', borderRadius: 6 }}>
                导出
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ============================================================
          Row 5: 最近订单 — 通栏，列宽优化
          ============================================================ */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="最近订单" style={card}
            extra={<Button size="small" type="link" style={{ color: C.primary }} onClick={() => window.location.href = '/order'}>查看全部</Button>}>
            <Table dataSource={(d.recentOrders || []).slice(0, 10)} columns={orderCols} rowKey="orderNo" pagination={false}
              size="middle" locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无订单" /> }}
              rowClassName={(_, i) => i !== undefined && i % 2 === 1 ? 'row-striped' : ''}
            />
          </Card>
        </Col>
      </Row>

      <style>{`
        .ant-table-thead > tr > th {
          background: #FAFAFA !important;
          font-size: 14px; font-weight: 600; color: ${C.textDark};
          padding: 11px 14px !important;
          border-bottom: 1px solid ${C.border} !important;
        }
        .ant-table-tbody > tr > td {
          padding: 10px 14px !important;
          border-bottom: 1px solid ${C.border};
          font-size: 14px;
        }
        .ant-table-tbody > tr.ant-table-row:hover > td {
          background: #F0F5FF !important;
        }
        .row-striped { background: #FAFAFA; }
        .ant-card-body { padding: 18px 20px !important; }
      `}</style>

    </div>
  );
};

export default Dashboard;
