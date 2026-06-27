/* ============================================================
   App 入口
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\App.tsx
   ============================================================ */
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppRouter from './router';

const theme = {
  token: {
    colorPrimary: '#1F5FA8',
    borderRadius: 8,
    fontFamily: "-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif",
  },
};

export default function App() {
  return (
    <ConfigProvider theme={theme} locale={zhCN}>
      <AppRouter />
    </ConfigProvider>
  );
}
