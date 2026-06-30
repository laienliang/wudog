import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';

// ===== 全局样式 =====
const globalStyle = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f5f7fa;
  }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #bfbfbf; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ProTable 样式优化 */
  .ant-pro-table {
    .ant-pro-table-search {
      margin-bottom: 16px;
    }
    .ant-table-wrapper {
      .ant-table-thead > tr > th {
        background: #fafafa;
        font-weight: 600;
        font-size: 13px;
        color: #262626;
        &::before { display: none; }
      }
      .ant-table-tbody > tr > td {
        padding: 12px 16px;
        transition: background 0.2s;
      }
      .ant-table-tbody > tr:hover > td {
        background: #f0f5ff !important;
      }
    }
  }

  /* Card 统一样式 */
  .ant-card {
    transition: box-shadow 0.2s;
    &:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
  }

  /* ProLayout 内容区背景 */
  .ant-pro-layout-content {
    background: #f5f7fa;
  }
`;

// 注入全局样式
const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyle;
document.head.appendChild(styleSheet);

// ===== 渲染 =====
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          // 品牌色系
          colorPrimary: '#1F5FA8',
          colorSuccess: '#6B8E3D',
          colorWarning: '#E8A838',
          colorError: '#D94A4A',
          colorInfo: '#1F5FA8',
          // 尺寸
          controlHeight: 36,
          borderRadius: 6,
          borderRadiusLG: 10,
          // 字体
          fontSize: 14,
          fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif`,
          // 间距
          marginLG: 24,
          paddingLG: 24,
          paddingMD: 16,
          paddingSM: 12,
          paddingXS: 8,
        },
        components: {
          Table: {
            headerBg: '#fafafa',
            headerColor: '#262626',
            rowHoverBg: '#f0f5ff',
            borderColor: '#f0f0f0',
          },
          Card: {
            paddingLG: 20,
          },
          Menu: {
            itemBg: 'transparent',
            darkItemBg: '#001529',
            darkItemColor: 'rgba(255,255,255,0.75)',
            darkItemSelectedBg: '#1F5FA8',
          },
          Button: {
            primaryShadow: '0 2px 6px rgba(31,95,168,0.25)',
          },
          Tag: {
            borderRadius: 4,
          },
          Badge: {
            dotSize: 8,
          },
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
);
