/**
 * 图形验证码组件
 *
 * 特点：
 * - 随机生成4位字符（数字+大写字母，排除易混淆字符）
 * - Canvas绘制，带旋转、噪点、干扰线
 * - 点击刷新
 * - 与苗族蜡染风格配色协调
 */
import { useEffect, useRef, useCallback } from 'react';

interface CaptchaProps {
  width?: number;
  height?: number;
  onChange?: (code: string) => void;
}

/** 可用字符（排除 0/O, 1/I/L 等易混淆字符） */
const CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/** 苗族风格配色 */
const COLORS = [
  '#1F5FA8', // 苗银蓝
  '#E85D2F', // 刺绣橙
  '#6B8E3D', // 梯田绿
  '#8B6F47', // 蜡染棕
  '#C49A6C', // 苗银浅
  '#2A5A8A', // 深蓝
];

/** 生成随机验证码 */
function generateCode(length: number): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export default function Captcha({ width = 120, height = 40, onChange }: CaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const codeRef = useRef('');

  /** 绘制验证码 */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 生成新验证码
    const code = generateCode(4);
    codeRef.current = code;
    onChange?.(code);

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 背景渐变（毛玻璃白）
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 6);
    ctx.fill();

    // 绘制干扰线（蜡染风格曲线）
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.strokeStyle = COLORS[i % COLORS.length] + '30'; // 低透明度
      ctx.lineWidth = 1;
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
      );
      ctx.stroke();
    }

    // 绘制噪点
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.fillStyle = COLORS[Math.floor(Math.random() * COLORS.length)] + '25';
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 2 + 0.5,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    // 绘制验证码文字
    const fontSize = height * 0.55;
    ctx.font = `bold ${fontSize}px 'Inter', monospace`;
    ctx.textBaseline = 'middle';

    const charWidth = (width - 20) / 4;

    for (let i = 0; i < 4; i++) {
      const x = 10 + i * charWidth + charWidth / 2;
      const y = height / 2;

      // 随机旋转（-15° ~ 15°）
      const angle = (Math.random() - 0.5) * 0.5;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // 随机颜色
      ctx.fillStyle = COLORS[Math.floor(Math.random() * COLORS.length)];

      // 绘制字符
      ctx.fillText(code[i], -fontSize / 4, 0);

      ctx.restore();
    }

    // 边框（细线，呼应蜡染风格）
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(0.5, 0.5, width - 1, height - 1, 6);
    ctx.stroke();
  }, [width, height, onChange]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={draw}
      style={{
        cursor: 'pointer',
        borderRadius: 6,
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      title="点击刷新验证码"
    />
  );
}
