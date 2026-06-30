import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button, message, Tag, Card, Row, Col, Space, Typography, Empty, Image, Tooltip, Modal, Input, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, AuditOutlined, SearchOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { communityApi } from '../../../services/community';

const { Text } = Typography;
const { Search } = Input;
const C = { primary: '#1F5FA8', success: '#6B8E3D', danger: '#D94A4A', warning: '#E8A838' };

const cardBodyStyle = { padding: '16px 24px' };

const STATUS_MAP: Record<number, { color: string; text: string }> = {
  0: { color: 'warning', text: '待审核' },
  1: { color: 'success', text: '已发布' },
  2: { color: 'default', text: '已驳回' },
};

const PendingTab: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [detailModal, setDetailModal] = useState<{ open: boolean; item: any }>({ open: false, item: null });
  const [stats, setStats] = useState({ pending: 0, published: 0, rejected: 0 });
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const loadStats = useCallback(async () => {
    try {
      const [pen, pub, rej] = await Promise.all([
        communityApi.listTravelogues({ page: 1, pageSize: 1, status: 0 }),
        communityApi.listTravelogues({ page: 1, pageSize: 1, status: 1 }),
        communityApi.listTravelogues({ page: 1, pageSize: 1, status: 2 }),
      ]);
      const g = (r: any) => r?.data?.pagination?.total || 0;
      setStats({ pending: g(pen), published: g(pub), rejected: g(rej) });
    } catch {}
  }, []);
  useEffect(() => { loadStats(); }, [loadStats]);

  const columns: ProColumns<any>[] = [
    {
      title: '标题', dataIndex: 'title', width: 260,
      render: (v, r) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Image src={r.coverImage} width={72} height={54}
              style={{ borderRadius: 6, objectFit: 'cover', border: '1px solid #f0f0f0' }} fallback="" />
            {r.images?.length > 1 && (
              <div style={{ position: 'absolute', bottom: 2, right: 2, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '0 4px', fontSize: 10, color: '#fff' }}>
                +{r.images.length}
              </div>
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Text strong style={{ fontSize: 14, color: '#1A1A1A', cursor: 'pointer' }}
                onClick={() => setDetailModal({ open: true, item: r })}>{v}</Text>
              <Tag color="blue" style={{ borderRadius: 4, fontSize: 10, lineHeight: '16px' }}>图文</Tag>
              {Number(r.likeCount) > 50 && <Tag color="red" style={{ borderRadius: 4, fontSize: 10, lineHeight: '16px' }}>🔥 热门</Tag>}
            </div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', lineHeight: 1.4, height: 32, overflow: 'hidden' }}>
              {(r.content || '').slice(0, 50)}...
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: '作者', width: 130,
      render: (_, r) => (
        <Space>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            {(r.user_name || '匿').charAt(0)}
          </div>
          <div>
            <Text style={{ fontSize: 13 }}>{r.user_name || '匿名'}</Text>
            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>ID: {r.userId}</Text>
          </div>
        </Space>
      ),
    },
    { title: '浏览量', dataIndex: 'viewCount', width: 60, align: 'center', render: (v) => <Text strong>{v || 0}</Text> },
    { title: '点赞', dataIndex: 'likeCount', width: 60, align: 'center', render: (v) => <Text strong>{v || 0}</Text> },
    {
      title: '提交时间', dataIndex: 'createdAt', width: 80,
      render: (v) => v ? (
        <Tooltip title={String(v)}><Text type="secondary" style={{ fontSize: 12 }}>{String(v).slice(0, 10)}</Text></Tooltip>
      ) : '-',
    },
    {
      title: '操作', width: 150, align: 'center', fixed: 'right' as const,
      render: (_, r) => (
        <Space>
          <Button type="primary" size="small" icon={<CheckCircleOutlined />}
            onClick={async () => { await communityApi.updateStatus(r.id, 1); message.success('已通过'); actionRef.current?.reload(); loadStats(); }}
            style={{ background: C.success, borderColor: C.success, fontSize: 12 }}>通过</Button>
          <Button size="small" danger icon={<CloseCircleOutlined />}
            onClick={async () => { await communityApi.updateStatus(r.id, 2); message.success('已驳回'); actionRef.current?.reload(); loadStats(); }}
            style={{ fontSize: 12 }}>驳回</Button>
        </Space>
      ),
    },
  ];

  const statConfigs = [
    { title: '待审核', value: stats.pending, icon: <AuditOutlined />, color: C.warning, bg: '#FFF7E6' },
    { title: '已发布', value: stats.published, icon: <CheckCircleOutlined />, color: C.success, bg: '#EDF7ED' },
    { title: '已驳回', value: stats.rejected, icon: <CloseCircleOutlined />, color: '#BFBFBF', bg: '#FAFAFA' },
  ];

  // 批量操作
  const handleBatchApprove = async () => {
    for (const id of selectedRowKeys) { await communityApi.updateStatus(Number(id), 1); }
    message.success(`已通过 ${selectedRowKeys.length} 条`);
    setSelectedRowKeys([]); actionRef.current?.reload(); loadStats();
  };

  const handleBatchReject = async () => {
    for (const id of selectedRowKeys) { await communityApi.updateStatus(Number(id), 2); }
    message.success(`已驳回 ${selectedRowKeys.length} 条`);
    setSelectedRowKeys([]); actionRef.current?.reload(); loadStats();
  };

  return (
    <div>
      {/* ===== 顶部统计卡片 ===== */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {statConfigs.map(item => (
          <Col xs={12} sm={12} md={8} key={item.title}>
            <Card hoverable style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -10, right: -10, width: 72, height: 72, borderRadius: '50%', background: item.bg, opacity: 0.5 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: item.color, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.title}</Text>
                  <div style={{ fontSize: 26, fontWeight: 700, color: item.color, lineHeight: 1.3 }}>{item.value}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ===== 表格 ===== */}
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: cardBodyStyle }}>
        <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
          request={async () => {
            try {
              const res = await communityApi.listTravelogues({ page: 1, pageSize: 100, status: 0 });
              let list = res?.data?.list || [];
              if (searchText) list = list.filter((r: any) => (r.title || '').includes(searchText) || (r.user_name || '').includes(searchText));
              return { data: list, success: true, total: list.length };
            } catch { return { data: [], success: false }; }
          }}
          rowSelection={{
            selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys),
          }}
          toolbar={{
            search: (
              <Space wrap>
                <Search placeholder="搜索标题/作者" allowClear style={{ width: 220 }}
                  value={searchText} onChange={e => setSearchText(e.target.value)}
                  onSearch={() => actionRef.current?.reload()} />
                <Select placeholder="时间范围" allowClear style={{ width: 130 }}
                  options={[{ label: '近7天', value: '7d' }, { label: '近30天', value: '30d' }, { label: '近90天', value: '90d' }]} />
                <Select placeholder="内容类型" allowClear style={{ width: 130 }}
                  options={[{ label: '图文', value: 'image' }, { label: '视频', value: 'video' }]} />
              </Space>
            ),
          }}
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    暂无待审核内容
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>所有游记已审核完毕，去喝杯咖啡吧 ☕</Text>
                  </span>
                }
              />
            ),
          }}
        />

        {/* ===== 批量操作栏 ===== */}
        {selectedRowKeys.length > 0 && (
          <div style={{ marginTop: 12, padding: '10px 16px', background: '#1A1A1A', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: '#fff', fontSize: 13 }}>已选择 <Text strong style={{ color: '#fff' }}>{selectedRowKeys.length}</Text> 条</Text>
            <Space>
              <Button size="small" icon={<CheckCircleOutlined />} onClick={handleBatchApprove}
                style={{ background: C.success, borderColor: C.success, color: '#fff' }}>批量通过</Button>
              <Button size="small" icon={<CloseCircleOutlined />} onClick={handleBatchReject}
                style={{ background: C.danger, borderColor: C.danger, color: '#fff' }}>批量驳回</Button>
            </Space>
          </div>
        )}
      </Card>

      {/* ===== 预览弹窗 ===== */}
      <Modal title="游记预览" open={detailModal.open}
        onCancel={() => setDetailModal({ open: false, item: null })}
        footer={null} width={640}>
        {detailModal.item && (
          <div>
            <Image src={detailModal.item.coverImage}
              style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8 }} fallback="" />
            <h3 style={{ marginTop: 16 }}>{detailModal.item.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{(detailModal.item.user_name || '匿').charAt(0)}</div>
              <Text type="secondary" style={{ fontSize: 13 }}>{detailModal.item.user_name} · {detailModal.item.createdAt?.slice(0, 10)}</Text>
              <Tag color="blue" style={{ borderRadius: 4, fontSize: 10 }}>{STATUS_MAP[Number(detailModal.item.status)]?.text || '未知'}</Tag>
            </div>
            <div style={{ marginTop: 12, padding: 14, background: '#FAFAFA', borderRadius: 8, lineHeight: 1.8, fontSize: 14, color: '#595959' }}>
              {detailModal.item.content}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default PendingTab;
