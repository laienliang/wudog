/**
 * 应用入口文件
 * 初始化 React 应用，配置 Ant Design 中文语言包、品牌主题、React Router 路由
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { themeConfig } from './theme';
import App from './App';
import './index.css';

/** 挂载根组件到 DOM */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);
