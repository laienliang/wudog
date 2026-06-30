import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Typography, Space, Tag, Button, Spin, Rate, Divider } from 'antd';
import {
  StarFilled, RightOutlined, EnvironmentOutlined, ArrowRightOutlined, LeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const api = axios.create({ baseURL: '/api/v1' });

const C = {
  primary: '#1F5FA8', success: '#6B8E3D', price: '#E85D2F',
  textSecondary: '#8C8C8C', border: '#E8E8E8', indigo: '#162B42', bgLight: '#F7F8FA',
};
const CONTAINER: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };

const modules = [
  { key: 'clothing', title: '民族服饰', icon: '🧣', desc: '苗绣·蜡染·银饰' },
  { key: 'food', title: '餐饮美食', icon: '🍜', desc: '苗家特色·长桌宴' },
  { key: 'accommodation', title: '民宿预订', icon: '🏡', desc: '吊脚楼·梯田景观' },
  { key: 'travel', title: '苗寨出游', icon: '🗺️', desc: '景区门票·路线套餐' },
  { key: 'community', title: '社区分享', icon: '📸', desc: '游记·照片·互动' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [homestays, setHomestays] = useState<any[]>([]);
  const [scenicSpots, setScenicSpots] = useState<any[]>([]);
  const [travelogues, setTravelogues] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      api.get('/products?page=1&pageSize=8'),
      api.get('/homestays?page=1&pageSize=4'),
      api.get('/scenic-spots?page=1&pageSize=4'),
      api.get('/travelogues?page=1&pageSize=4'),
    ]).then(([pRes, hRes, sRes, tRes]) => {
      setProducts(pRes.data?.data?.list || []);
      setHomestays(hRes.data?.data?.list || []);
      setScenicSpots(sRes.data?.data?.list || []);
      setTravelogues(tRes.data?.data?.list || []);
    });
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#F8F7F4' }}>

      {/* ================================================================
          HERO — 全屏首屏
          ================================================================ */}
      <div style={{
        position: 'relative', overflow: 'hidden', minHeight: 520,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(to bottom, rgba(22,43,66,0.2) 0%, rgba(22,43,66,0.5) 50%, rgba(22,43,66,0.85) 100%), url(/hero-bg.jpg) center/cover no-repeat`,
      }}>
        <div style={{ ...CONTAINER, width: '100%', textAlign: 'center', padding: '120px 24px 140px', color: '#fff' }}>
          <Tag style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 20, padding: '4px 18px', fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 28,
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          }}>🌿 黔东南 · 雷山 · 乌东苗寨</Tag>
          <Title style={{
            color: '#fff', fontSize: 60, marginBottom: 20, fontWeight: 700,
            fontFamily: '"Noto Serif SC", "STSong", "SimSun", serif', letterSpacing: 8,
            textShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}>探寻苗寨之美</Title>
          <Paragraph style={{
            color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: 500,
            margin: '0 auto 44px', lineHeight: 2, letterSpacing: 2,
            textShadow: '0 2px 12px rgba(0,0,0,0.2)',
          }}>苗族非遗文化 · 千户苗寨 · 梯田风光 · 长桌盛宴</Paragraph>
          <Space size={16} wrap style={{ justifyContent: 'center' }}>
            {[
              { text: '🏔️ 探苗寨', path: '/travel' }, { text: '🍜 品苗宴', path: '/food' },
              { text: '🏡 住苗居', path: '/accommodation' }, { text: '🎁 购苗礼', path: '/clothing' },
            ].map(item => (
              <Button key={item.text} size="large" onClick={() => navigate(item.path)}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 24, color: '#fff', fontSize: 15, height: 48, padding: '0 30px',
                  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                {item.text}
              </Button>
            ))}
          </Space>
        </div>
        <div style={{ position: 'absolute', bottom: 32, fontSize: 22, opacity: 0.4, animation: 'bounce 2s infinite', color: '#fff' }}>⌄</div>
      </div>

      {/* ================================================================
          SERVICES — 6卡片 Grid 工整排列
          ================================================================ */}
      <div style={{ ...CONTAINER, paddingTop: 48, paddingBottom: 24 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16,
        }}>
          {modules.map(m => (
            <div key={m.key} onClick={() => navigate(`/${m.key}`)}
              style={{
                background: '#fff', borderRadius: 14, padding: '28px 12px', textAlign: 'center',
                cursor: 'pointer', transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
              <div style={{ fontSize: 34, marginBottom: 10, lineHeight: 1 }}>{m.icon}</div>
              <Title level={4} style={{ fontSize: 15, margin: 0, color: '#333', fontWeight: 600 }}>{m.title}</Title>
              <Text type="secondary" style={{ fontSize: 12, marginTop: 2, display: 'block' }}>{m.desc}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================
          非遗好物 — 横向滚动
          ================================================================ */}
      {products.length > 0 && (
        <div style={{ ...CONTAINER, paddingTop: 40, paddingBottom: 56 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <Text style={{ color: C.indigo, fontSize: 13, letterSpacing: 3, fontWeight: 500 }}>HANDICRAFT</Text>
              <Title level={2} style={{ margin: '2px 0 0', fontWeight: 700, color: C.indigo, fontFamily: '"Noto Serif SC", serif' }}>非遗好物</Title>
            </div>
            <Space>
              <Button shape="circle" icon={<LeftOutlined />} size="small" onClick={() => scroll('left')} />
              <Button shape="circle" icon={<ArrowRightOutlined />} size="small" onClick={() => scroll('right')} />
              <Button type="link" onClick={() => navigate('/clothing')} style={{ color: C.primary }}>全部 <RightOutlined /></Button>
            </Space>
          </div>
          <div ref={scrollRef} style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
            {products.map((p: any) => (
              <div key={p.id} onClick={() => navigate(`/clothing/detail/${p.id}`)}
                style={{ flex: '0 0 220px', borderRadius: 12, overflow: 'hidden', background: '#fff', cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: `1px solid ${C.border}`, transition: 'all 0.3s',
                  display: 'flex', flexDirection: 'column' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
                <div style={{ height: 200, background: '#f5f5f5', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={p.mainImage} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
                    onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="%23f5f5f5"/%3E'; }} />
                </div>
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</Text>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>{p.subtitle || ''}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <Text style={{ color: C.price, fontSize: 18, fontWeight: 700 }}>¥{p.price}</Text>
                    {p.rating && <span><StarFilled style={{ color: '#FAAD14', fontSize: 11 }} /><Text type="secondary" style={{ fontSize: 11, marginLeft: 2 }}>{p.rating}</Text></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================
          民宿 + 景区 — 等高等宽 Flex 对齐
          ================================================================ */}
      <div style={{ background: '#fff', padding: '56px 0' }}>
        <div style={{ ...CONTAINER }}>
          <div style={{ display: 'flex', gap: 32, alignItems: 'stretch' }}>
            {/* 左：民宿 */}
            <div style={{ flex: '14 0 0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <Text style={{ color: C.indigo, fontSize: 13, letterSpacing: 3, fontWeight: 500 }}>STAY</Text>
                  <Title level={3} style={{ margin: '2px 0 0', fontWeight: 700, color: C.indigo, fontFamily: '"Noto Serif SC", serif' }}>特色民宿</Title>
                </div>
                <Button type="link" onClick={() => navigate('/accommodation')} style={{ color: C.primary }}>全部 <RightOutlined /></Button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1 }}>
                {homestays.map((h: any) => (
                  <div key={h.id} onClick={() => navigate(`/accommodation/${h.id}`)}
                    style={{ borderRadius: 12, overflow: 'hidden', background: '#fff', cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: `1px solid ${C.border}`, transition: 'all 0.3s',
                      display: 'flex', flexDirection: 'column' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
                    <div style={{ height: 160, background: '#f5f5f5', flexShrink: 0 }}>
                      <img src={h.coverImage} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="160" fill="%23f5f5f5"/%3E'; }} />
                    </div>
                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 2 }}>{h.name}</Text>
                      </div>
                      <Space size={10}>
                        <span style={{ fontSize: 12 }}><StarFilled style={{ color: '#FAAD14', fontSize: 11 }} /> {h.rating}</span>
                        <span style={{ color: C.price, fontWeight: 700, fontSize: 15 }}>¥{h.min_price}<Text style={{ fontSize: 11, fontWeight: 400, color: C.textSecondary }}> 起</Text></span>
                      </Space>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右：景区 */}
            <div style={{ flex: '10 0 0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <Text style={{ color: C.indigo, fontSize: 13, letterSpacing: 3, fontWeight: 500 }}>SCENERY</Text>
                  <Title level={3} style={{ margin: '2px 0 0', fontWeight: 700, color: C.indigo, fontFamily: '"Noto Serif SC", serif' }}>热门景区</Title>
                </div>
                <Button type="link" onClick={() => navigate('/travel')} style={{ color: C.primary }}>全部 <RightOutlined /></Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {scenicSpots.map((s: any) => (
                  <div key={s.id} onClick={() => navigate(`/travel/scenic/${s.id}`)}
                    style={{ borderRadius: 12, background: '#fff', cursor: 'pointer', border: `1px solid ${C.border}`, transition: 'all 0.3s', flex: 1, display: 'flex' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ display: 'flex', gap: 12, padding: '14px 12px', alignItems: 'center', width: '100%' }}>
                      <img src={s.coverImage} alt={s.name} style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                        onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="%23f5f5f5"/%3E'; }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 2 }}>{s.name}</Text>
                        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}><EnvironmentOutlined /> {s.address || '乌东苗寨'}</Text>
                        <Rate disabled value={Number(s.rating)} style={{ fontSize: 11 }} />
                        <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>{s.rating}</Text>
                      </div>
                      <ArrowRightOutlined style={{ color: C.textSecondary, fontSize: 12, flexShrink: 0 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          游客分享
          ================================================================ */}
      {travelogues.length > 0 && (
        <div style={{ ...CONTAINER, paddingTop: 56, paddingBottom: 56 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <Text style={{ color: C.indigo, fontSize: 13, letterSpacing: 3, fontWeight: 500 }}>COMMUNITY</Text>
              <Title level={2} style={{ margin: '2px 0 0', fontWeight: 700, color: C.indigo, fontFamily: '"Noto Serif SC", serif' }}>游客分享</Title>
            </div>
            <Button type="link" onClick={() => navigate('/community')} style={{ color: C.primary }}>更多游记 <RightOutlined /></Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {travelogues.map((t: any) => (
              <div key={t.id} onClick={() => navigate(`/community/travelogue/${t.id}`)}
                style={{ borderRadius: 12, overflow: 'hidden', background: '#fff', cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: `1px solid ${C.border}`, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
                <div style={{ height: 170, background: '#f5f5f5' }}>
                  <img src={t.coverImage} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</Text>
                  <Space>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>
                      {(t.user_name || '匿').charAt(0)}
                    </div>
                    <Text style={{ fontSize: 11, color: C.textSecondary }}>{t.user_name || '匿名'}</Text>
                  </Space>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <div style={{ background: '#0D2137', color: 'rgba(255,255,255,0.65)' }}>
        <div style={{ ...CONTAINER, paddingTop: 48, paddingBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1.5fr 3fr', gap: 40 }}>
            <div>
              <Title level={4} style={{ color: '#fff', marginBottom: 12, fontFamily: '"Noto Serif SC", serif' }}>乌东苗寨</Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.8 }}>
                位于贵州黔东南苗族侗族自治州雷山县，是典型的特色苗寨，拥有丰富的苗族非遗文化旅游资源。
              </Paragraph>
            </div>
            <div>
              <Text style={{ color: '#fff', fontWeight: 600, display: 'block', marginBottom: 12 }}>服务</Text>
              {['民族服饰', '餐饮美食', '民宿预订', '苗寨出游'].map(text => (
                <div key={text} style={{ marginBottom: 6, fontSize: 13, cursor: 'pointer', opacity: 0.7 }}>{text}</div>
              ))}
            </div>
            <div>
              <Text style={{ color: '#fff', fontWeight: 600, display: 'block', marginBottom: 12 }}>关于</Text>
              {['关于我们', '帮助中心', '用户协议', '隐私政策'].map(text => (
                <div key={text} style={{ marginBottom: 6, fontSize: 13, cursor: 'pointer', opacity: 0.7 }}>{text}</div>
              ))}
            </div>
            <div>
              <Text style={{ color: '#fff', fontWeight: 600, display: 'block', marginBottom: 12 }}>联系方式</Text>
              <div style={{ fontSize: 13, marginBottom: 6, opacity: 0.7 }}>📧 contact@wudongmiao.com</div>
              <div style={{ fontSize: 13, marginBottom: 6, opacity: 0.7 }}>📞 0855-XXXXXXX</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>📍 贵州省黔东南州雷山县乌东村</div>
            </div>
          </div>
          <Divider style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '24px 0 16px' }} />
          <div style={{ textAlign: 'center', fontSize: 12, opacity: 0.5 }}>
            © {new Date().getFullYear()} 乌东文旅综合服务平台
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default HomePage;
