import React, { useState, useRef } from 'react';
import { Button, message, Tag, Card, Space, Typography, Empty, Select, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { communityApi } from '../../../services/community';

const { Text } = Typography;

const STATUS_MAP: Record<number, { color: string; text: string }> = {
  0: { color: 'warning', text: '待处理' },
  1: { color: 'success', text: '已处理' },
  2: { color: 'default', text: '已驳回' },
};

const ReportTab: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);

  const columns: ProColumns<any>[] = [
    { title: '#', width: 40, render: (_: any, _r: any, i: number) => i + 1 },
    { title: '举报者', dataIndex: 'user_name', width: 80 },
    { title: '目标类型', dataIndex: 'targetType', width: 80, render: (v) => <Tag>{v}</Tag> },
    { title: '目标ID', dataIndex: 'targetId', width: 60, align: 'center' },
    { title: '举报原因', dataIndex: 'reason', width: 200, ellipsis: true },
    { title: '时间', dataIndex: 'createdAt', width: 80, render: (v) => v ? String(v).slice(0, 10) : '-' },
    { title: '状态', dataIndex: 'status', width: 70, align: 'center', render: (v) => { const c = STATUS_MAP[Number(v)] || {}; return <Tag color={c.color}>{c.text}</Tag>; } },
    {
      title: '操作', width: 150, align: 'center',
      render: (_, r) => Number(r.status) === 0 ? (
        <Space>
          <Button size="small" icon={<CheckCircleOutlined />} onClick={async () => { await communityApi.updateReportStatus(r.id, 1); message.success('已处理'); actionRef.current?.reload(); }} style={{ background: '#52C41A', color: '#fff', borderColor: '#52C41A' }}>处理</Button>
          <Button size="small" icon={<CloseCircleOutlined />} onClick={async () => { await communityApi.updateReportStatus(r.id, 2); message.success('已驳回'); actionRef.current?.reload(); }}>驳回</Button>
        </Space>
      ) : <Text type="secondary">已处理</Text>,
    },
  ];

  return (
    <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 24px' } }}>
      <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
        request={async () => { try { const params: any = { page: 1, pageSize: 100 }; if (statusFilter !== undefined) params.status = statusFilter; const res = await communityApi.listReports(params); return { data: res?.data?.list || [], success: true }; } catch { return { data: [], success: false }; } }}
        toolbar={{
          filter: <Space><span style={{ fontSize: 13, color: '#666' }}>状态：</span>
            <Select placeholder="全部" allowClear style={{ width: 140 }} value={statusFilter} onChange={(v) => { setStatusFilter(v); actionRef.current?.reload(); }}
              options={[{ label: '全部', value: undefined }, { label: '⏳ 待处理', value: 0 }, { label: '✅ 已处理', value: 1 }, { label: '❌ 已驳回', value: 2 }].filter(Boolean)} />
          </Space>,
        }}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无举报" /> }} />
    </Card>
  );
};
export default ReportTab;
