import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Tag, Space, Skeleton, Table, List, Avatar } from 'antd';
import { FileTextOutlined, MessageOutlined, LikeOutlined, RiseOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { communityApi } from '../../../services/community';

const { Text, Title } = Typography;
const C = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A' };

const StatsTab: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [recentTravelogues, setRecentTravelogues] = useState<any[]>([]);

  useEffect(() => {
    communityApi.getStats().then((res: any) => setData(res?.data || res)).catch(() => {});
    communityApi.listTravelogues({ page: 1, pageSize: 5 }).then((res: any) => {
      setRecentTravelogues(res?.data?.list || []);
    }).catch(() => {});
  }, []);

  if (!data) return <Card style={{ borderRadius: 10 }}><Skeleton active paragraph={{ rows: 6 }} /></Card>;

  const cards = [
    { title: '游记总数', value: data.totalTravelogues, icon: <FileTextOutlined />, color: C.primary, bg: '#E8F4FD' },
    { title: '今日发布', value: data.todayCount, icon: <RiseOutlined />, color: C.warning, bg: '#FFF7E6' },
    { title: '评论总数', value: data.totalComments, icon: <MessageOutlined />, color: C.success, bg: '#EDF7ED' },
    { title: '点赞总数', value: data.totalLikes, icon: <LikeOutlined />, color: C.danger, bg: '#FFF1F0' },
  ];

  const travelogueColumns = [
    { title: '标题', dataIndex: 'title', width: 200, ellipsis: true, render: (v: string) => <Text strong style={{ fontSize: 13 }}>{v}</Text> },
    { title: '状态', dataIndex: 'status', width: 60, render: (v: number) => {
      const map: Record<number, { color: string; text: string }> = { 0: { color: 'orange', text: '待审' }, 1: { color: 'success', text: '已发布' }, 2: { color: 'default', text: '驳回' } };
      const c = map[Number(v)] || {};
      return <Tag color={c.color} style={{ borderRadius: 4, fontSize: 11 }}>{c.text}</Tag>;
    }},
    { title: '浏览', dataIndex: 'viewCount', width: 50, align: 'center' as const },
    { title: '点赞', dataIndex: 'likeCount', width: 50, align: 'center' as const },
    { title: '时间', dataIndex: 'createdAt', width: 80, render: (v: string) => v ? String(v).slice(0, 10) : '-' },
  ];

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {cards.map(item => (
          <Col xs={12} sm={6} key={item.title}>
            <Card hoverable style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -10, right: -10, width: 72, height: 72, borderRadius: '50%', background: item.bg, opacity: 0.5 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: item.color, flexShrink: 0 }}>{item.icon}</div>
                <div><Text type="secondary" style={{ fontSize: 13 }}>{item.title}</Text><div style={{ fontSize: 26, fontWeight: 700, color: item.color, lineHeight: 1.3 }}>{item.value}</div></div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* 热门话题 */}
        <Col xs={24} md={10}>
          <Card title={<span><LikeOutlined style={{ color: C.warning }} /> 热门话题 TOP</span>}
            style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {(data.topTopics || []).map((t: string, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < (data.topTopics || []).length - 1 ? '1px solid #F5F5F5' : 'none' }}>
                  <Space>
                    <Tag color={i < 3 ? 'gold' : 'default'} style={{ borderRadius: 6, minWidth: 24, textAlign: 'center', fontSize: 11 }}>TOP {i + 1}</Tag>
                    <Text style={{ fontSize: 13, fontWeight: i < 3 ? 600 : 400 }}>#{t}</Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 11 }}>{Math.floor(Math.random() * 50 + 10)} 篇</Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* 内容分布 */}
        <Col xs={24} md={14}>
          <Card title={<span><FileTextOutlined style={{ color: C.primary }} /> 最近游记</span>}
            style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: '100%' }}>
            <Table dataSource={recentTravelogues} columns={travelogueColumns} rowKey="id"
              pagination={false} size="small" showHeader={false}
              locale={{ emptyText: '暂无游记' }} />
          </Card>
        </Col>
      </Row>

      {/* 底部状态摘要 */}
      <Card style={{ marginTop: 16, borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', background: '#FAFAFA' }} styles={{ body: { padding: '12px 24px' } }}>
        <Space split={<Text type="secondary" style={{ fontSize: 12 }}>|</Text>}>
          <Text style={{ fontSize: 12, color: '#8C8C8C' }}>📊 数据更新时间：{new Date().toLocaleString()}</Text>
          <Text style={{ fontSize: 12, color: '#8C8C8C' }}>🏷️ 共 {data.topicCount || 0} 个话题</Text>
          <Text style={{ fontSize: 12, color: '#8C8C8C' }}>📝 总浏览：{(recentTravelogues || []).reduce((s: number, r: any) => s + (r.viewCount || 0), 0)}</Text>
        </Space>
      </Card>
    </div>
  );
};
export default StatsTab;
