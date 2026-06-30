import React, { useState, useEffect } from 'react';
import { Table, Button, InputNumber, Empty, message, Typography, Divider, Modal, Tag } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../services/api';

const { Title, Text } = Typography;

interface CartItem {
  productId: number; skuId: number; name: string; price: number; image: string; quantity: number; _invalid?: boolean;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('wudong_cart') || '[]');
    Promise.all(data.map(async (item: CartItem) => {
      try {
        const res = await fetch(`/api/v1/products/${item.productId}`);
        return res.ok ? item : { ...item, _invalid: true };
      } catch { return { ...item, _invalid: true }; }
    })).then(validated => {
      const valid = validated.filter((i: any) => !i._invalid);
      const removed = validated.length - valid.length;
      if (removed > 0) {
        localStorage.setItem('wudong_cart', JSON.stringify(valid));
        message.warning(`${removed} 件商品已失效/下架，已自动移除`);
      }
      setCart(valid);
    });
  }, []);

  const saveCart = (newCart: CartItem[]) => { setCart(newCart); localStorage.setItem('wudong_cart', JSON.stringify(newCart)); };
  const updateQuantity = (skuId: number, qty: number) => { if (qty < 1) return; saveCart(cart.map(item => item.skuId === skuId ? { ...item, quantity: qty } : item)); };
  const removeItem = (skuId: number) => { saveCart(cart.filter(item => item.skuId !== skuId)); message.success('已移除'); };
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = () => {
    if (cart.length === 0) { message.warning('购物车为空'); return; }
    const token = localStorage.getItem('token');
    if (!token) { message.warning('请先登录'); navigate('/login'); return; }
    Modal.confirm({
      title: '确认下单', content: `共 ${cart.length} 件商品，合计 ¥${totalAmount.toFixed(2)}`,
      onOk: async () => {
        try {
          const items = cart.map(item => ({
            productType: 'clothing', productId: item.productId, productImage: item.image,
            productName: item.name, skuId: item.skuId, unitPrice: item.price, quantity: item.quantity,
          }));
          await orderApi.create({ orderType: 'clothing', merchantId: 1, items });
          message.success('下单成功');
          localStorage.removeItem('wudong_cart');
          setCart([]);
          navigate('/orders');
        } catch { message.error('下单失败'); }
      },
    });
  };

  const columns = [
    { title: '商品', dataIndex: 'name', key: 'name',
      render: (text: string, record: CartItem) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={record.image || ''} alt={text} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', background: '#f5f5f5' }} />
          <span>{text}</span>
          {record._invalid && <Tag color="red">已失效</Tag>}
        </div>
      ),
    },
    { title: '单价', dataIndex: 'price', key: 'price', render: (v: number) => <span style={{ color: '#E85D2F' }}>¥{v}</span> },
    { title: '数量', dataIndex: 'quantity', key: 'quantity', render: (v: number, record: CartItem) => (
      <InputNumber min={1} max={999} value={v} onChange={qty => updateQuantity(record.skuId, qty || 1)} />
    )},
    { title: '小计', key: 'subtotal', render: (_: any, record: CartItem) => `¥${(record.price * record.quantity).toFixed(2)}` },
    { title: '操作', key: 'action', render: (_: any, record: CartItem) => (
      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeItem(record.skuId)}>删除</Button>
    )},
  ];

  if (cart.length === 0) {
    return <div style={{ textAlign: 'center', padding: 100 }}><Empty description="购物车是空的" /><Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/clothing')}>去逛逛</Button></div>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      <Title level={3}><ShoppingOutlined /> 购物车</Title>
      {cart.some(i => i._invalid) && <Tag color="red" style={{ marginBottom: 8 }}>部分商品已失效</Tag>}
      <Table dataSource={cart} columns={columns} rowKey="skuId" pagination={false} style={{ marginTop: 16 }} />
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24 }}>
        <Text style={{ fontSize: 18 }}>合计：<span style={{ fontSize: 24, fontWeight: 700, color: '#E85D2F' }}>¥{totalAmount.toFixed(2)}</span></Text>
        <Button type="primary" size="large" onClick={checkout} style={{ height: 44, borderRadius: 8, background: '#1F5FA8' }}>去结算</Button>
      </div>
    </div>
  );
};

export default CartPage;
