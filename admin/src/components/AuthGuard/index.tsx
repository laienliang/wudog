/* ============================================================
   路由守卫 — 无 token 自动跳转登录
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\components\AuthGuard\index.tsx
   ============================================================ */
import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../../store/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
