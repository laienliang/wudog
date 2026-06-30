import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import { ShopOutlined, TagOutlined, CompassOutlined, ScanOutlined, OrderedListOutlined } from '@ant-design/icons';
import ScenicSpotTab from './scenic-spot';
import TicketTypeTab from './ticket-type';
import RouteTab from './route';
import ETicketTab from './e-ticket';
import OrdersTab from './orders';

const TravelAdmin: React.FC = () => {
  const [activeKey, setActiveKey] = useState('scenic');
  return (
    <div style={{ padding: 0 }}>
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '0 24px', paddingTop: 0 } }}>
        <Tabs activeKey={activeKey} onChange={setActiveKey} items={[
          { key: 'scenic', label: <span><ShopOutlined /> 景区管理</span>, children: <ScenicSpotTab /> },
          { key: 'ticket', label: <span><TagOutlined /> 票种管理</span>, children: <TicketTypeTab /> },
          { key: 'route', label: <span><CompassOutlined /> 路线管理</span>, children: <RouteTab /> },
          { key: 'eticket', label: <span><ScanOutlined /> 电子票核销</span>, children: <ETicketTab /> },
          { key: 'orders', label: <span><OrderedListOutlined /> 订单管理</span>, children: <OrdersTab /> },
        ]} />
      </Card>
    </div>
  );
};
export default TravelAdmin;
