/**
 * 财务报表页面
 * 展示平台整体财务概况和商家收入汇总
 * 包含总营收、平台收入、商家收入、待结算金额等关键指标
 */
import { useEffect, useState } from 'react';
import { Table, Card, Col, Row, Spin, Tag, Button } from 'antd';
import { DollarOutlined, ShopOutlined, BankOutlined, ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import { exportToExcel } from '../../utils/export';

/**
 * 财务报表页面组件
 * 加载并展示平台财务汇总数据和商家收入明细
 */
export default function FinancialReportPage() {
  /** 财务汇总数据 */
  const [summary, setSummary] = useState<any>({});
  /** 商家收入汇总列表 */
  const [merchantData, setMerchantData] = useState<any[]>([]);
  /** 数据加载状态 */
  const [loading, setLoading] = useState(false);

  /** 加载财务数据，并行请求汇总数据和商家收入数据 */
  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryRes, merchantRes]: any[] = await Promise.all([
        request.get('/financial-records/summary'),
        request.get('/financial-records/merchant-summary'),
      ]);
      if (summaryRes.code === 200) setSummary(summaryRes.data);
      if (merchantRes.code === 200) setMerchantData(merchantRes.data.list || merchantRes.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  /** 财务概览卡片配置（使用品牌色系） */
  const summaryCards = [
    { title: '总营收', value: summary.total_revenue, icon: <DollarOutlined />, color: 'var(--color-primary)' },
    { title: '平台收入', value: summary.platform_income, icon: <BankOutlined />, color: 'var(--color-terraced)' },
    { title: '商家收入', value: summary.merchant_income, icon: <ShopOutlined />, color: 'var(--color-dawn)' },
    { title: '待结算金额', value: summary.pending_settlement, icon: <ClockCircleOutlined />, color: 'var(--color-embroidery)' },
  ];

  /** 商家收入汇总表格列配置 */
  const columns = [
    { title: '商家ID', dataIndex: 'merchant_id', width: 100 },
    { title: '商家名称', dataIndex: 'merchant_name' },
    { title: '订单数', dataIndex: 'order_count' },
    { title: '订单总额', dataIndex: 'total_amount', render: (v: number) => `¥${Number(v || 0).toFixed(2)}` },
    { title: '平台佣金', dataIndex: 'commission_amount', render: (v: number) => `¥${Number(v || 0).toFixed(2)}` },
    { title: '商家收入', dataIndex: 'merchant_income', render: (v: number) => `¥${Number(v || 0).toFixed(2)}` },
    {
      title: '待结算', dataIndex: 'pending_amount',
      render: (v: number) => v > 0 ? <Tag color="orange">¥{Number(v).toFixed(2)}</Tag> : <Tag color="green">¥0.00</Tag>,
    },
  ];

  return (
    <Spin spinning={loading}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>财务报表</h2>
        <Button icon={<DownloadOutlined />} onClick={() => exportToExcel(merchantData, columns.map((c: any) => ({ title: String(c.title), dataIndex: String(c.dataIndex), render: c.render })), `财务报表_${new Date().toLocaleDateString('zh-CN')}`)} disabled={merchantData.length === 0}>导出报表</Button>
      </div>
      {/* 财务概览统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {summaryCards.map((card) => (
          <Col span={6} key={card.title}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 32, color: card.color }}>{card.icon}</div>
                <div>
                  <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-body)' }}>{card.title}</div>
                  <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>
                    ¥{Number(card.value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      {/* 商家收入汇总表格 */}
      <Card title="商家收入汇总">
        <Table rowKey="merchant_id" columns={columns} dataSource={merchantData}
          pagination={{ pageSize: 20, showTotal: t => `共 ${t} 条` }} />
      </Card>
    </Spin>
  );
}
