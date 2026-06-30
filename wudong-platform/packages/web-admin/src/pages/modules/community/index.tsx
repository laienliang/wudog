import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import { AuditOutlined, FileTextOutlined, MessageOutlined, TagOutlined, WarningOutlined, BarChartOutlined } from '@ant-design/icons';
import PendingTab from './pending';
import TravelogueTab from './travelogue';
import CommentTab from './comment';
import TopicTab from './topic';
import ReportTab from './report';
import StatsTab from './stats';

const CommunityAdmin: React.FC = () => {
  const [activeKey, setActiveKey] = useState('pending');
  return (
    <div style={{ padding: 0 }}>
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '0 24px', paddingTop: 0 } }}>
        <Tabs activeKey={activeKey} onChange={setActiveKey} items={[
          { key: 'pending', label: <span><AuditOutlined /> 待审核</span>, children: <PendingTab /> },
          { key: 'travelogue', label: <span><FileTextOutlined /> 游记管理</span>, children: <TravelogueTab /> },
          { key: 'comment', label: <span><MessageOutlined /> 评论管理</span>, children: <CommentTab /> },
          { key: 'report', label: <span><WarningOutlined /> 举报处理</span>, children: <ReportTab /> },
          { key: 'topic', label: <span><TagOutlined /> 话题管理</span>, children: <TopicTab /> },
          { key: 'stats', label: <span><BarChartOutlined /> 数据统计</span>, children: <StatsTab /> },
        ]} />
      </Card>
    </div>
  );
};
export default CommunityAdmin;
