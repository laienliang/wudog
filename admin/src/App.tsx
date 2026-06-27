/* ============================================================
   管理后台 App
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\App.tsx
   ============================================================ */
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppRouter from './router';

const theme = {
  token: {
    colorPrimary: '#1F5FA8',
    borderRadius: 8,
  },
};

export default function App() {
  return (
    <ConfigProvider theme={theme} locale={zhCN}>
      <AppRouter />
    </ConfigProvider>
  );
}
