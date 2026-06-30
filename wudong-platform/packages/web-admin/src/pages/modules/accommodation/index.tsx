import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import { ShopOutlined, HomeOutlined, CalendarOutlined, OrderedListOutlined, StarOutlined } from '@ant-design/icons';
import HomestayTab from './homestay';
import RoomTypeTab from './room-type';
import CalendarTab from './calendar';
import OrdersTab from './orders';
import ReviewsTab from './reviews';

const AccommodationAdmin: React.FC = () => {
  const [activeKey, setActiveKey] = useState('homestay');

  return (
    <div style={{ padding: 0 }}>
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '0 24px', paddingTop: 0 } }}>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={[
            { key: 'homestay', label: <span><ShopOutlined /> 民宿管理</span>, children: <HomestayTab onJumpToRoom={(id) => { setActiveKey('room-type'); }} /> },
            { key: 'room-type', label: <span><HomeOutlined /> 房型管理</span>, children: <RoomTypeTab /> },
            { key: 'calendar', label: <span><CalendarOutlined /> 房态日历</span>, children: <CalendarTab /> },
            { key: 'orders', label: <span><OrderedListOutlined /> 订单管理</span>, children: <OrdersTab /> },
            { key: 'reviews', label: <span><StarOutlined /> 评价管理</span>, children: <ReviewsTab /> },
          ]}
        />
      </Card>
    </div>
  );
};

export default AccommodationAdmin;
