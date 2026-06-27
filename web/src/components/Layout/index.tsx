/* ============================================================
   全局布局组件
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\components\Layout\index.tsx
   ============================================================ */
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Input, Button } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './style.css';

const { Header, Content, Footer } = AntLayout;

export default function Layout() {
  const nav = useNavigate();
  const [keyword, setKeyword] = useState('');

  const onSearch = () => {
    nav(`/list?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header className="site-header">
        <div className="header-inner">
          <div className="logo" onClick={() => nav('/')}>
            <EnvironmentOutlined style={{ fontSize: 22, color: 'var(--color-primary)' }} />
            <span className="logo-text">乌东苗寨民宿</span>
          </div>
          <div className="header-search">
            <Input
              placeholder="搜索民宿名称、地址..."
              prefix={<SearchOutlined />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={onSearch}
              style={{ width: 320 }}
              allowClear
            />
            <Button type="primary" onClick={onSearch}>搜索</Button>
          </div>
          <div className="header-nav">
            <Button type="link" onClick={() => nav('/list')}>民宿列表</Button>
          </div>
        </div>
      </Header>
      <Content className="site-content">
        <div className="content-inner">
          <Outlet />
        </div>
      </Content>
      <Footer className="site-footer">
        <div className="footer-inner">
          <span>© 2026 乌东文旅 — 苗寨民宿预订平台</span>
        </div>
      </Footer>
    </AntLayout>
  );
}
