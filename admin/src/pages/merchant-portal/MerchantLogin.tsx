/**
 * 商家登录页面
 *
 * 纯 CSS/SVG 动态背景：山水场景 + 船只行走 + 水波荡漾
 * 没有静态图片，整个场景是活的
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import Captcha from '../../components/Captcha';

const styles = `
@keyframes boatSail1 { 0% { transform: translateX(-20%); } 100% { transform: translateX(110vw); } }
@keyframes boatSail2 { 0% { transform: translateX(110vw); } 100% { transform: translateX(-20%); } }
@keyframes bob { 0%, 100% { transform: translateY(0) rotate(-0.2deg); } 50% { transform: translateY(-2px) rotate(0.2deg); } }
@keyframes wave1 { 0% { d: path("M0 20 Q25 14 50 20 Q75 26 100 20"); } 50% { d: path("M0 20 Q25 26 50 20 Q75 14 100 20"); } 100% { d: path("M0 20 Q25 14 50 20 Q75 26 100 20"); } }
@keyframes wave2 { 0% { d: path("M0 22 Q20 16 40 22 Q60 28 80 22 Q100 16 120 22"); } 50% { d: path("M0 22 Q20 28 40 22 Q60 16 80 22 Q100 28 120 22"); } 100% { d: path("M0 22 Q20 16 40 22 Q60 28 80 22 Q100 16 120 22"); } }

/* ═══ 蒙蒙细雨 ═══ */
@keyframes rainFall {
  0% { transform: translateY(-10vh); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(110vh); opacity: 0; }
}
.rain-drop {
  position: absolute;
  width: 0.5px;
  background: rgba(200,220,240,0.15);
  pointer-events: none;
  transform: rotate(2deg);
}
`;

/** SVG 乌篷船 — 传统中式渔船 */
function BoatSVG({ flip }: { flip?: boolean }) {
  return (
    <svg width="140" height="55" viewBox="0 0 140 55" style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
      {/* 船身 — 细长弧形 */}
      <path d="M15 35 Q20 42 70 42 Q120 42 125 35 L120 30 Q70 33 20 30 Z" fill="rgba(70,45,20,0.75)" />
      <path d="M20 30 Q70 33 120 30 L118 28 Q70 31 22 28 Z" fill="rgba(90,60,30,0.6)" />
      {/* 船头翘起 */}
      <path d="M15 35 Q10 32 8 28 Q12 30 18 32" fill="rgba(70,45,20,0.7)" />
      {/* 船尾翘起 */}
      <path d="M125 35 Q130 32 132 28 Q128 30 122 32" fill="rgba(70,45,20,0.7)" />

      {/* 乌篷（竹篷）— 三个弧形棚 */}
      <path d="M45 28 Q45 18 55 16 Q65 18 65 28" fill="rgba(55,40,18,0.65)" stroke="rgba(45,32,12,0.4)" strokeWidth="0.8" />
      <path d="M60 28 Q60 17 70 14 Q80 17 80 28" fill="rgba(60,42,18,0.6)" stroke="rgba(45,32,12,0.4)" strokeWidth="0.8" />
      <path d="M75 28 Q75 18 85 16 Q95 18 95 28" fill="rgba(55,40,18,0.65)" stroke="rgba(45,32,12,0.4)" strokeWidth="0.8" />
      {/* 篷底横梁 */}
      <line x1="44" y1="28" x2="96" y2="28" stroke="rgba(50,35,15,0.5)" strokeWidth="1.2" />

      {/* 撑船人 */}
      <line x1="108" y1="30" x2="108" y2="14" stroke="rgba(50,35,15,0.5)" strokeWidth="1.2" />
      {/* 斗笠 */}
      <ellipse cx="108" cy="14" rx="8" ry="3" fill="rgba(50,38,15,0.5)" />
      {/* 身体 */}
      <line x1="108" y1="17" x2="108" y2="28" stroke="rgba(50,35,15,0.4)" strokeWidth="1.5" />
      {/* 竹篙 */}
      <line x1="115" y1="10" x2="118" y2="38" stroke="rgba(60,42,18,0.45)" strokeWidth="1" />

      {/* 水中倒影 */}
      <path d="M25 44 Q70 46 115 44" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
    </svg>
  );
}

/** 单艘船（带动画） */
function Boat({ top, duration, delay, scale, reverse }: {
  top: string; duration: number; delay: number; scale: number; reverse?: boolean;
}) {
  return (
    <div style={{
      position: 'absolute', top, left: 0,
      animation: `${reverse ? 'boatSail2' : 'boatSail1'} ${duration}s linear ${delay}s infinite`,
      pointerEvents: 'none', zIndex: 1,
    }}>
      <div style={{
        transform: `scale(${scale})`,
        animation: `bob ${5 + scale * 2}s ease-in-out ${delay}s infinite`,
      }}>
        <BoatSVG flip={reverse} />
        {/* 船底水波 */}
        <svg width="110" height="10" style={{ position: 'absolute', bottom: -4, left: -5 }}>
          <ellipse cx="55" cy="5" rx="50" ry="4" fill="rgba(255,255,255,0.08)">
            <animate attributeName="rx" values="50;55;50" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.08;0.04;0.08" dur="2s" repeatCount="indefinite" />
          </ellipse>
        </svg>
      </div>
    </div>
  );
}

export default function MerchantLogin() {
  const [loading, setLoading] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; password: string; captcha: string }) => {
    // 验证码校验（不区分大小写）
    if (values.captcha.toUpperCase() !== captchaCode) {
      message.error('验证码错误');
      form.setFieldValue('captcha', '');
      return;
    }

    setLoading(true);
    try {
      const res: any = await request.post('/merchant-auth/login', {
        username: values.username,
        password: values.password,
      });
      if (res.code === 200) {
        localStorage.setItem('merchant_token', res.data.token);
        localStorage.setItem('merchant', JSON.stringify(res.data.merchant));
        message.success('登录成功');
        navigate('/merchant-portal/dashboard');
      } else {
        message.error(res.message || '登录失败');
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{styles}</style>

      {/* ═══ 天空渐变（清晨色调） ═══ */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #1A3A5C 0%, #2A5A7A 25%, #4A8AA0 50%, #6BAAB0 65%, #8BC4B8 80%, #A0D0C0 100%)',
      }} />

      {/* ═══ 远山层 ═══ */}
      <svg style={{ position: 'absolute', bottom: '28%', width: '200%', height: '40%', pointerEvents: 'none' }} preserveAspectRatio="none">
        <path d="M0 300 Q120 80 300 180 Q480 60 650 150 Q820 40 1000 140 Q1200 70 1400 170 Q1600 50 1800 160 L2000 200 L2000 500 L0 500Z" fill="#1A3A5C" opacity="0.5">
          <animateTransform attributeName="transform" type="translate" values="0,0;-100,0;0,0" dur="90s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* ═══ 中山层 ═══ */}
      <svg style={{ position: 'absolute', bottom: '25%', width: '200%', height: '35%', pointerEvents: 'none' }} preserveAspectRatio="none">
        <path d="M0 300 Q160 120 380 220 Q560 90 780 200 Q960 70 1180 180 Q1360 100 1580 210 Q1760 130 2000 240 L2000 500 L0 500Z" fill="#2A5A7A" opacity="0.7">
          <animateTransform attributeName="transform" type="translate" values="0,0;-70,0;0,0" dur="65s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* ═══ 近山层 ═══ */}
      <svg style={{ position: 'absolute', bottom: '22%', width: '200%', height: '28%', pointerEvents: 'none' }} preserveAspectRatio="none">
        <path d="M0 300 Q200 160 440 250 Q640 140 880 230 Q1080 120 1280 220 Q1480 170 1680 260 Q1880 190 2000 280 L2000 500 L0 500Z" fill="#1A3A5C" opacity="0.9">
          <animateTransform attributeName="transform" type="translate" values="0,0;-50,0;0,0" dur="50s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* ═══ 水面 ═══ */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '25%',
        background: 'linear-gradient(180deg, #3A7A8A 0%, #2A5A6A 40%, #1A3A4A 100%)',
      }} />

      {/* ═══ 水波纹 ═══ */}
      <svg style={{ position: 'absolute', bottom: '18%', width: '100%', height: '10%', pointerEvents: 'none', opacity: 0.15 }}>
        {[0, 1, 2, 3, 4].map(i => (
          <path key={i} d="M0 20 Q25 14 50 20 Q75 26 100 20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1"
            style={{ animation: `wave1 ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite` }}
            transform={`translate(0, ${i * 8})`} />
        ))}
      </svg>
      <svg style={{ position: 'absolute', bottom: '12%', width: '100%', height: '8%', pointerEvents: 'none', opacity: 0.1 }}>
        {[0, 1, 2, 3].map(i => (
          <path key={i} d="M0 22 Q20 16 40 22 Q60 28 80 22 Q100 16 120 22" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"
            style={{ animation: `wave2 ${4 + i * 0.5}s ease-in-out ${i * 0.4}s infinite` }}
            transform={`translate(0, ${i * 6})`} />
        ))}
      </svg>

      {/* ═══ 水面倒影光斑 ═══ */}
      <svg style={{ position: 'absolute', bottom: '5%', width: '100%', height: '20%', pointerEvents: 'none', opacity: 0.06 }}>
        {[15, 30, 50, 70, 85].map((x, i) => (
          <ellipse key={i} cx={`${x}%`} cy="50%" rx="40" ry="3" fill="white">
            <animate attributeName="rx" values="35;45;35" dur={`${4 + i}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.3;0.6" dur={`${4 + i}s`} repeatCount="indefinite" />
          </ellipse>
        ))}
      </svg>

      {/* ═══ 船只行走层（在水面上，缓慢漂行） ═══ */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Boat top="78%" duration={100} delay={0} scale={1} />
        <Boat top="84%" duration={140} delay={15} scale={0.7} reverse />
        <Boat top="76%" duration={120} delay={35} scale={0.55} />
        <Boat top="88%" duration={160} delay={50} scale={0.4} reverse />
      </div>

      {/* ═══ 蒙蒙细雨层 ═══ */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 40 }, (_, i) => {
          const left = (i * 2.5 + Math.sin(i * 7) * 12) % 100;
          const h = 25 + Math.sin(i * 3) * 15;
          const dur = 3 + (i % 5) * 0.6;
          const delay = (i * 0.5) % 6;
          const opacity = 0.06 + (i % 3) * 0.03;
          return (
            <div key={i} className="rain-drop" style={{
              left: `${left}%`, height: h,
              animation: `rainFall ${dur}s linear ${delay}s infinite`,
              opacity,
            }} />
          );
        })}
      </div>

      {/* ═══ 雨雾遮罩（整体蒙蒙感） ═══ */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(180,200,220,0.05) 0%, rgba(160,185,210,0.02) 50%, transparent 100%)',
      }} />

      {/* ═══ 品牌标题 — 左下角 ═══ */}
      <div style={{ position: 'absolute', bottom: 48, left: 48, zIndex: 2 }}>
        <h1 style={{
          fontFamily: "'Ma Shan Zheng', cursive", fontSize: 48, color: '#FFFFFF',
          margin: 0, lineHeight: 1.2, letterSpacing: 4,
          textShadow: '0 2px 30px rgba(0,0,0,0.4)',
        }}>
          乌东文旅 · 商家
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13,
          color: 'rgba(255,255,255,0.45)', margin: '8px 0 0 2px',
          letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500,
        }}>
          Merchant Portal
        </p>
        <div style={{ width: 40, height: 2, background: '#6B8E3D', margin: '16px 0' }} />
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
          管理您的店铺、订单与收入
        </p>
      </div>

      {/* ═══ 底部装饰带 ═══ */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, zIndex: 2,
        background: `repeating-linear-gradient(90deg, #6B8E3D 0px, #6B8E3D 12px, transparent 12px, transparent 16px, #1F5FA8 16px, #1F5FA8 20px, transparent 20px, transparent 24px)`,
        opacity: 0.7,
      }} />

      {/* ═══ 浮动表单卡片（静止） ═══ */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '42%', minWidth: 380, maxWidth: 480,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px', zIndex: 3,
      }}>
        <div style={{
          width: '100%', maxWidth: 380,
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 16, border: '1px solid rgba(255,255,255,0.15)',
          padding: '40px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          position: 'relative',
        }}>
          {/* 右上角 Logo */}
          <img
            src="/logo.png"
            alt="乌东文旅"
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              width: 48,
              height: 48,
              objectFit: 'contain',
              opacity: 0.9,
            }}
          />
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: "'Alibaba PuHuiTi', 'Inter', sans-serif",
              fontSize: 22, fontWeight: 700, color: '#FFFFFF', margin: 0,
            }}>商家后台</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '6px 0 0' }}>
              使用商家账号登录
            </p>
          </div>
          <Form form={form} onFinish={onFinish} size="large" layout="vertical">
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]} style={{ marginBottom: 18 }}>
              <Input prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.35)' }} />} placeholder="商家用户名"
                style={{ height: 46, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]} style={{ marginBottom: 18 }}>
              <Input.Password prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.35)' }} />} placeholder="密码"
                style={{ height: 46, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }} />
            </Form.Item>
            <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码' }]} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Input
                  prefix={<SafetyCertificateOutlined style={{ color: 'rgba(255,255,255,0.35)' }} />}
                  placeholder="验证码"
                  maxLength={4}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                  }}
                />
                <Captcha width={120} height={46} onChange={setCaptchaCode} />
              </div>
            </Form.Item>
            <Form.Item style={{ marginBottom: 20 }}>
              <Button type="primary" htmlType="submit" loading={loading} block
                style={{ height: 46, borderRadius: 10, fontSize: 15, fontWeight: 600, letterSpacing: 2, boxShadow: '0 4px 16px rgba(31,95,168,0.35)' }}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
