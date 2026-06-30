import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import {
  PictureOutlined, BellOutlined, StarOutlined, GiftOutlined,
} from '@ant-design/icons';
import BannerList from './banners';
import AnnouncementList from './announcements';
import RecommendationList from './recommendations';
import ActivityBannerList from './activity-banners';

/* ============================================================
   首页运营管理 - Tab 容器
   ============================================================ */
const OperationPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState('banners');

  return (
    <div style={{ padding: 0 }}>
      <Card
        style={{
          borderRadius: 10,
          border: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          marginBottom: 16,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          style={{ margin: 0, padding: '0 24px' }}
          items={[
            {
              key: 'banners',
              label: <span><PictureOutlined /> 轮播图管理</span>,
              children: <BannerList />,
            },
            {
              key: 'announcements',
              label: <span><BellOutlined /> 公告管理</span>,
              children: <AnnouncementList />,
            },
            {
              key: 'recommendations',
              label: <span><StarOutlined /> 推荐位管理</span>,
              children: <RecommendationList />,
            },
            {
              key: 'activity-banners',
              label: <span><GiftOutlined /> 活动横幅</span>,
              children: <ActivityBannerList />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default OperationPage;
