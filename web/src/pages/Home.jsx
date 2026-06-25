import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: 60 }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🏡</div>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1a3d6e', marginBottom: 12 }}>
        乌东文旅平台
      </h1>
      <p style={{ color: '#666', fontSize: 16, marginBottom: 40 }}>
        探索苗寨美景，预订心仪民宿
      </p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <button className="btn btn-primary" style={{ height: 44, padding: '0 28px', fontSize: 16 }}
          onClick={() => navigate('/accommodation')}>
          🏡 浏览民宿
        </button>
        <button className="btn btn-secondary" style={{ height: 44, padding: '0 28px', fontSize: 16 }}
          onClick={() => navigate('/village')}>
          🏔️ 探索苗寨
        </button>
        <button className="btn btn-secondary" style={{ height: 44, padding: '0 28px', fontSize: 16 }}
          onClick={() => navigate('/order')}>
          📋 我的订单
        </button>
      </div>
    </div>
  )
}
