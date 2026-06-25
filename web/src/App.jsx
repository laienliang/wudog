import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ListPage from './pages/module5/ListPage';
import LoginPage from './pages/module5/LoginPage';

export default function App() {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/list" />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/module1" element={<Placeholder title="非遗商品" />} />
          <Route path="/module2" element={<Placeholder title="餐饮美食" />} />
          <Route path="/module3" element={<Placeholder title="民宿预订" />} />
          <Route path="/module4" element={<Placeholder title="景区出行" />} />
          <Route path="/community" element={<Placeholder title="社区分享" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function Placeholder({ title }) {
  return <div style={{ textAlign: 'center', padding: 60 }}><h2>{title}</h2><p style={{ color: '#999' }}>模块开发中</p></div>;
}
