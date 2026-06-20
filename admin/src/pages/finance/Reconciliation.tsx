/**
 * 对账管理页面
 * 展示平台订单与财务记录的对比，按商家维度显示差异
 * 标注异常记录（有订单但无财务记录、金额不匹配等）
 */
import { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Tag, Spin, Statistic, Button, Space } from 'antd';
import { ReloadOutlined, DollarOutlined, FileTextOutlined, WarningOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import { exportToExcel } from '../../utils/export';
import { ORDER_TYPE_MAP } from '../../utils/format';

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  matched: { text: '一致', color: 'green' },
  missing_records: { text: '缺少记录', color: 'red' },
  amount_mismatch: { text: '金额不匹配', color: 'orange' },
};

export default function ReconciliationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/financial-records/reconciliation');
      if (res.code === 200) setData(res.data);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const summary = data?.summary || {};
  const merchantDiff = data?.merchantDiff || [];
  const missingOrders = data?.missingOrders || [];

  const diffColumns = [
    { title: '商家ID', dataIndex: 'merchantId', width: 100 },
    { title: '订单数', dataIndex: 'orderCount', width: 100 },
    { title: '订单金额', dataIndex: 'orderAmount', render: (v: number) => `¥${Number(v).toFixed(2)}` },
    { title: '财务记录数', dataIndex: 'recordCount', width: 120 },
    { title: '记录金额', dataIndex: 'recordAmount', render: (v: number) => `¥${Number(v).toFixed(2)}` },
    { title: '差额', dataIndex: 'diff', render: (v: number) => v === 0 ? <Tag color="green">¥0.00</Tag> : <Tag color="red">¥{Number(v).toFixed(2)}</Tag> },
    { title: '状态', dataIndex: 'status', render: (v: string) => {
      const s = STATUS_MAP[v] || { text: v, color: 'default' };
      return <Tag color={s.color}>{s.text}</Tag>;
    }},
  ];

  const missingColumns = [
    { title: '订单ID', dataIndex: 'id', width: 80 },
    { title: '订单号', dataIndex: 'order_no' },
    { title: '商家ID', dataIndex: 'merchant_id', width: 100 },
    { title: '订单金额', dataIndex: 'total_amount', render: (v: number) => `¥${Number(v).toFixed(2)}` },
    { title: '订单类型', dataIndex: 'order_type', render: (v: string) => ORDER_TYPE_MAP[v] || v },
  ];

  return (
    <Spin spinning={loading}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>对账管理</h2>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadData}>刷新</Button>
            <Button onClick={() => exportToExcel(merchantDiff, diffColumns.map(c => ({ title: String(c.title), dataIndex: c.dataIndex, render: c.render as any })), `对账数据_${new Date().toLocaleDateString('zh-CN')}`)} disabled={merchantDiff.length === 0}>导出</Button>
          </Space>
        </div>

        {/* 总体对比卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card><Statistic title="订单总额" value={summary.orderTotal || 0} precision={2} prefix="¥" valueStyle={{ color: '#1F5FA8' }} /></Card>
          </Col>
          <Col span={6}>
            <Card><Statistic title="财务记录总额" value={summary.recordTotal || 0} precision={2} prefix="¥" valueStyle={{ color: '#6B8E3D' }} /></Card>
          </Col>
          <Col span={6}>
            <Card><Statistic title="差额" value={summary.diff || 0} precision={2} prefix="¥" valueStyle={{ color: summary.diff === 0 ? '#52c41a' : '#f5222d' }} /></Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <FileTextOutlined style={{ fontSize: 28, color: '#D4A14B' }} />
                <div>
                  <div style={{ color: '#8C8C8C', fontSize: 13 }}>订单数 / 记录数</div>
                  <div style={{ fontSize: 22, fontWeight: 600 }}>{summary.orderCount || 0} / {summary.recordCount || 0}</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 商家维度对比 */}
        <Card title={<span><DollarOutlined /> 商家维度对账</span>} style={{ marginBottom: 16 }}>
          <Table rowKey="merchantId" columns={diffColumns} dataSource={merchantDiff}
            pagination={{ pageSize: 20, showTotal: (t: number) => `共 ${t} 条` }} size="small" />
        </Card>

        {/* 缺失财务记录的订单 */}
        <Card title={<span><WarningOutlined style={{ color: '#f5222d' }} /> 缺失财务记录的已完成订单（最多50条）</span>}>
          <Table rowKey="id" columns={missingColumns} dataSource={missingOrders}
            pagination={{ pageSize: 10, showTotal: (t: number) => `共 ${t} 条` }} size="small" />
        </Card>
      </div>
    </Spin>
  );
}
