/* ============================================================
   路由配置
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\router\index.tsx
   ============================================================ */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/List';
import DetailPage from '../pages/Detail';
import BookPage from '../pages/Book';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'list', element: <HomePage /> },
      { path: 'detail/:id', element: <DetailPage /> },
      { path: 'book/:roomId', element: <BookPage /> },
      { path: 'edit/:id', element: <BookPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
