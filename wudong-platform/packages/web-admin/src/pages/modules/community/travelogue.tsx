import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button, message, Popconfirm, Tag, Card, Row, Col, Statistic, Space, Typography, Empty, Image, Select, Tooltip, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { communityApi } from '../../../services/community';

const { Text } = Typography;
const C = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A' };

const STATUS_MAP: Record<number, { color: string; text: string }> = {
  0: { color: 'orange', text: '待审核' }, 1: { color: 'success', text: '已发布' }, 2: { color: 'default', text: '已驳回' },
};

const TravelogueTab: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [detailModal, setDetailModal] = useState<{ open: boolean; item: any }>({ open: false, item: null });
  const [stats, setStats] = useState({ total: 0, published: 0, pending: 0 });

  const loadStats = useCallback(async () => {
    try {
      const [all, pub, pen] = await Promise.all([
        communityApi.listTravelogues({ page: 1, pageSize: 1 }),
        communityApi.listTravelogues({ page: 1, pageSize: 1, status: 1 }),
        communityApi.listTravelogues({ page: 1, pageSize: 1, status: 0 }),
      ]);
      const g = (r: any) => r?.data?.pagination?.total || 0;
      setStats({ total: g(all), published: g(pub), pending: g(pen) });
    } catch {}
  }, []);
  useEffect(() => { loadStats(); }, [loadStats]);

  const columns: ProColumns<any>[] = [
    { title: '#', width: 40, align: 'center', render: (_: any, _r: any, i: number) => <Tag style={{ borderRadius: 6, minWidth: 18, textAlign: 'center', fontSize: 10 }}>{i + 1}</Tag> },
    { title: '封面', width: 56, render: (_, r) => <Image src={r.coverImage} width={36} height={36} style={{ borderRadius: 4, objectFit: 'cover' }} fallback="" /> },
    { title: '标题', dataIndex: 'title', width: 200, ellipsis: true, render: (v, r) => <a onClick={() => setDetailModal({ open: true, item: r })}><Text strong style={{ color: C.primary }}>{v}</Text></a> },
    {
      title: '作者', width: 100,
      render: (_, r) => (
        <Space>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#1F5FA8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
            {(r.user_name || '匿').charAt(0)}
          </div>
          <Text style={{ fontSize: 13 }}>{r.user_name || '匿名'}</Text>
        </Space>
      ),
    },
    { title: '数据', width: 120, align: 'center', render: (_, r) => <Text style={{ fontSize: 12 }}>👁️{r.viewCount || 0} 👍{r.likeCount || 0} 💬{r.commentCount || 0}</Text> },
    { title: '状态', dataIndex: 'status', width: 70, align: 'center', render: (v) => { const c = STATUS_MAP[Number(v)] || { color: 'default', text: '未知' }; return <Tag color={c.color} style={{ borderRadius: 4 }}>{c.text}</Tag>; } },
    { title: '时间', dataIndex: 'createdAt', width: 80, render: (v) => v ? String(v).slice(0, 10) : '-' },
    {
      title: '操作', width: 140, align: 'center',
      render: (_, r) => (
        <Space size={0}>
          <Tooltip title="查看"><Button type="text" size="small" icon={<EyeOutlined />} onClick={() => setDetailModal({ open: true, item: r })} style={{ color: C.primary }} /></Tooltip>
          {Number(r.status) === 0 && (<><Tooltip title="通过"><Button type="text" size="small" icon={<CheckCircleOutlined />} onClick={async () => { await communityApi.updateStatus(r.id, 1); message.success('已发布'); actionRef.current?.reload(); loadStats(); }} style={{ color: C.success }} /></Tooltip>
            <Tooltip title="驳回"><Button type="text" size="small" icon={<CloseCircleOutlined />} onClick={async () => { await communityApi.updateStatus(r.id, 2); message.success('已驳回'); actionRef.current?.reload(); loadStats(); }} style={{ color: C.danger }} /></Tooltip></>)}
          <Popconfirm title="确定删除？" onConfirm={async () => { await communityApi.deleteTravelogue(r.id); message.success('已删除'); actionRef.current?.reload(); loadStats(); }}>
            <Tooltip title="删除"><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (<>
    <Row gutter={12} style={{ marginBottom: 16 }}>
      {[
        { title: '全部游记', value: stats.total, icon: <FileTextOutlined />, color: C.primary, bg: '#E8F4FD' },
        { title: '已发布', value: stats.published, icon: <CheckCircleOutlined />, color: C.success, bg: '#EDF7ED' },
        { title: '待审核', value: stats.pending, icon: <BarChartOutlined />, color: C.warning, bg: '#FFF7E6' },
      ].map(item => (
        <Col xs={8} key={item.title}><Card hoverable style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: 72, height: 72, borderRadius: '50%', background: item.bg, opacity: 0.5 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: item.color }}>{item.icon}</div>
            <div><Text type="secondary" style={{ fontSize: 12 }}>{item.title}</Text><div style={{ fontSize: 26, fontWeight: 700, color: item.color }}>{item.value}</div></div>
          </div>
        </Card></Col>
      ))}
    </Row>
    <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 24px' } }}>
      <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
        request={async () => { try { const params: any = { page: 1, pageSize: 100 }; if (statusFilter !== undefined) params.status = statusFilter; const res = await communityApi.listTravelogues(params); return { data: res?.data?.list || [], success: true }; } catch { return { data: [], success: false }; } }}
        toolbar={{
          filter: <Space><span style={{ fontSize: 13, color: '#666' }}>状态：</span>
            <Select placeholder="全部状态" allowClear style={{ width: 140 }} value={statusFilter} onChange={(v) => { setStatusFilter(v); actionRef.current?.reload(); }}
              options={[{ label: '全部', value: undefined }, { label: '⏳ 待审核', value: 0 }, { label: '✅ 已发布', value: 1 }, { label: '❌ 已驳回', value: 2 }].filter(Boolean)} />
          </Space>,
        }}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无游记" /> }} />
    </Card>
    <Modal title="游记详情" open={detailModal.open} onCancel={() => setDetailModal({ open: false, item: null })} footer={null} width={640}>
      {detailModal.item && <>
        <Image src={detailModal.item.coverImage} style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8 }} fallback="" />
        <h3 style={{ marginTop: 16 }}>{detailModal.item.title}</h3>
        <Text type="secondary">作者：{detailModal.item.user_name} · 浏览 {detailModal.item.viewCount || 0} · 点赞 {detailModal.item.likeCount || 0}</Text>
        <div style={{ marginTop: 12, padding: 12, background: '#FAFAFA', borderRadius: 8, lineHeight: 1.8, fontSize: 14, color: '#595959' }}>{detailModal.item.content}</div>
      </>}
    </Modal>
  </>);
};
export default TravelogueTab;
