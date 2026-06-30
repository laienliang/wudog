import React, { useState } from 'react';
import { Card, Space, Typography, Tag, Select, Empty, Rate } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { accommodationApi } from '../../../services/accommodation';

const { Text } = Typography;

const ReviewsTab: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const actionRef = React.useRef<ActionType>();

  const columns: ProColumns<any>[] = [
    { title: '#', width: 50, align: 'center', render: (_: any, _r: any, i: number) => <Tag style={{ borderRadius: 10, minWidth: 22, textAlign: 'center' }}>{i + 1}</Tag> },
    { title: '民宿', dataIndex: 'homestay_name', width: 150, render: (v) => v || '-' },
    {
      title: '用户', dataIndex: 'user_name', width: 120,
      render: (v) => (
        <Space>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#1F5FA8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            {(v || '?').charAt(0)}
          </div>
          <Text style={{ fontSize: 13 }}>{v || '匿名用户'}</Text>
        </Space>
      ),
    },
    { title: '评分', dataIndex: 'rating', width: 130, align: 'center', render: (v) => <Rate disabled value={Number(v)} style={{ fontSize: 12, whiteSpace: 'nowrap' }} /> },
    { title: '评价内容', dataIndex: 'content', ellipsis: true },
    { title: '时间', dataIndex: 'createdAt', width: 90, render: (v) => v ? <Text type="secondary" style={{ fontSize: 12 }}>{String(v).slice(0, 10)}</Text> : '-' },
    {
      title: '状态', dataIndex: 'status', width: 80, align: 'center',
      render: (v) => {
        if (v === 'hidden') return <Tag color="default">已隐藏</Tag>;
        if (v === 'pending') return <Tag color="warning">待审核</Tag>;
        return <Tag color="success">已公开</Tag>;
      },
    },
  ];

  const fetchReviews = async () => {
    try {
      const res = await accommodationApi.listAccommodationReviews();
      const data = res?.data || res;
      const list = data?.list || [];
      if (statusFilter) return { data: list.filter((r: any) => r.status === statusFilter), success: true };
      return { data: list, success: true };
    } catch { return { data: [], success: false }; }
  };

  return (
    <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 24px' } }}>
      <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
        request={fetchReviews}
        toolbar={{
          filter: (
            <Space>
              <span style={{ fontSize: 13, color: '#666' }}>状态：</span>
              <Select placeholder="全部状态" allowClear style={{ width: 140 }} value={statusFilter}
                onChange={(v) => { setStatusFilter(v); actionRef.current?.reload(); }}
                options={[
                  { label: '全部状态', value: undefined },
                  { label: '已公开', value: 'public' },
                  { label: '待审核', value: 'pending' },
                  { label: '已隐藏', value: 'hidden' },
                ].filter(Boolean)} />
            </Space>
          ),
        }}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>暂无评价数据</span>} />
          ),
        }}
      />
    </Card>
  );
};

export default ReviewsTab;
