/**
 * 结算列表页面
 * 展示平台财务结算记录列表，支持按结算状态和商家ID筛选
 * 提供单条结算和批量结算操作
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Select, message, Popconfirm, Tag } from 'antd';
import { SearchOutlined, CheckOutlined, ThunderboltOutlined, DownloadOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import { exportToExcel } from '../../utils/export';

/**
 * 结算列表页面组件
 * 提供结算记录的查看、单条结算和批量结算功能
 */
export default function SettlementListPage() {
  /** 结算记录列表数据 */
  const [data, setData] = useState<any[]>([]);
  /** 数据总条数 */
  const [total, setTotal] = useState(0);
  /** 当前页码 */
  const [page, setPage] = useState(1);
  /** 每页条数 */
  const [pageSize, setPageSize] = useState(20);
  /** 数据加载状态 */
  const [loading, setLoading] = useState(false);
  /** 筛选条件 */
  const [filters, setFilters] = useState<any>({});
  /** 批量选中的行 ID 列表 */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 加载结算记录列表数据 */
  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/financial-records/list', { params: { page, pageSize, settlementStatus: filters.settlement_status, merchantId: filters.merchant_id } });
      if (res.code === 200) { setData(res.data.list); setTotal(res.data.total); }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [page, pageSize, filters]);

  /**
   * 筛选操作，重置页码并更新筛选条件
   * @param values - 筛选条件对象
   */
  const onFilter = (values: any) => {
    setPage(1);
    setFilters(values);
  };

  /**
   * 单条结算操作
   * @param id - 结算记录 ID
   */
  const handleSettle = async (id: number) => {
    const res: any = await request.post(`/financial-records/settle/${id}`);
    if (res.code === 200) { message.success('结算成功'); loadData(); }
    else message.error(res.message);
  };

  /** 批量结算操作，结算所有选中的记录 */
  const handleBatchSettle = async () => {
    if (selectedRowKeys.length === 0) { message.warning('请先选择要结算的记录'); return; }
    const res: any = await request.post('/financial-records/settle-batch', { ids: selectedRowKeys });
    if (res.code === 200) { message.success(`批量结算成功，共 ${selectedRowKeys.length} 条`); setSelectedRowKeys([]); loadData(); }
    else message.error(res.message);
  };

  /** 自动生成结算单 — 扫描所有已完成且尚无财务记录的订单，创建待结算记录 */
  const handleGenerate = async () => {
    const res: any = await request.post('/financial-records/generate', {});
    if (res.code === 200) { message.success(res.message); setSelectedRowKeys([]); loadData(); }
    else message.error(res.message || '生成失败');
  };

  /** 表格列配置 */
  const columns = [
    { title: '订单号', dataIndex: 'order_no', width: 180 },
    { title: '商家ID', dataIndex: 'merchant_id', width: 100 },
    { title: '订单金额', dataIndex: 'order_amount', render: (v: number) => `¥${Number(v || 0).toFixed(2)}` },
    { title: '佣金比例', dataIndex: 'commission_rate', render: (v: number) => `${(v * 100).toFixed(1)}%` },
    { title: '佣金金额', dataIndex: 'commission_amount', render: (v: number) => `¥${Number(v || 0).toFixed(2)}` },
    { title: '商家收入', dataIndex: 'merchant_income', render: (v: number) => `¥${Number(v || 0).toFixed(2)}` },
    {
      title: '结算状态', dataIndex: 'settlement_status',
      render: (v: string) => v === 'settled' ? <Tag color="green">已结算</Tag> : <Tag color="orange">待结算</Tag>,
    },
    { title: '结算时间', dataIndex: 'settled_at', width: 180 },
    {
      title: '操作', width: 100, fixed: 'right' as const, render: (_: any, record: any) => (
        <>
          {record.settlement_status !== 'settled' && (
            <Popconfirm title="确认结算？" onConfirm={() => handleSettle(record.id)}>
              <Button type="link" size="small" icon={<CheckOutlined />}>结算</Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>财务结算</h2>
        <Button icon={<DownloadOutlined />} onClick={() => exportToExcel(data, [
          { title: 'ID', dataIndex: 'id' },
          { title: '订单号', dataIndex: 'order_no' },
          { title: '商家ID', dataIndex: 'merchant_id' },
          { title: '订单金额', dataIndex: 'order_amount', render: (v: number) => Number(v || 0).toFixed(2) },
          { title: '佣金比例', dataIndex: 'commission_rate', render: (v: number) => `${(v * 100).toFixed(1)}%` },
          { title: '佣金金额', dataIndex: 'commission_amount', render: (v: number) => Number(v || 0).toFixed(2) },
          { title: '商家收入', dataIndex: 'merchant_income', render: (v: number) => Number(v || 0).toFixed(2) },
          { title: '结算状态', dataIndex: 'settlement_status', render: (v: string) => v === 'settled' ? '已结算' : '待结算' },
          { title: '结算时间', dataIndex: 'settled_at' },
        ], `结算数据_${new Date().toLocaleDateString('zh-CN')}`)} disabled={data.length === 0}>导出</Button>
      </div>
      {/* 筛选和批量操作区域 */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Select placeholder="结算状态" allowClear style={{ width: 140 }}
          options={[{ label: '待结算', value: 'pending' }, { label: '已结算', value: 'settled' }]}
          onChange={(val) => onFilter({ ...filters, settlement_status: val })} />
        <Input placeholder="商家ID" style={{ width: 140 }}
          onChange={(e) => onFilter({ ...filters, merchant_id: e.target.value || undefined })} />
        <Popconfirm title={`确认批量结算 ${selectedRowKeys.length} 条记录？`} onConfirm={handleBatchSettle} disabled={selectedRowKeys.length === 0}>
          <Button type="primary" icon={<ThunderboltOutlined />}
            disabled={selectedRowKeys.length === 0}>
            批量结算 ({selectedRowKeys.length})
          </Button>
        </Popconfirm>
        <Popconfirm title="将为所有已完成且尚无结算记录的订单生成待结算记录，确认？" onConfirm={handleGenerate}>
          <Button icon={<CheckOutlined />}>生成结算单</Button>
        </Popconfirm>
      </Space>
      {/* 结算记录列表表格，支持行选择 */}
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} scroll={{ x: 'max-content' }}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }} />
    </div>
  );
}
