import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createOrder, deleteCartItem } from '../utils/api';
import Header from './Header';

const ADDRESS_KEY = 'web_addresses';

function loadAddresses(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(ADDRESS_KEY) || '{}');
    return all[userId] || [];
  } catch {
    return [];
  }
}

export default function OrderConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [items, setItems] = useState(() => {
    const passed = location.state?.items || [];
    return passed.map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }));
  });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('wechat');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const list = loadAddresses(userId);
    setAddresses(list);
    const defaultAddr = list.find(a => a.isDefault);
    if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    else if (list.length > 0) setSelectedAddressId(list[0].id);
  }, [userId]);

  useEffect(() => {
    if (items.length === 0 && !location.state?.items) {
      navigate('/cart');
    }
  }, []);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const updateQuantity = (index, delta) => {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const getPrice = (item) => {
    if (item.sku?.price) return Number(item.sku.price);
    if (item.product?.price) return Number(item.product.price);
    if (item.price) return Number(item.price);
    return 0;
  };

  const totalPrice = items.reduce((sum, item) => sum + getPrice(item) * item.quantity, 0);

  const handleSubmit = async () => {
    if (!selectedAddress) {
      alert('请选择收货地址');
      return;
    }
    setOrdering(true);
    try {
      for (const item of items) {
        const price = getPrice(item);
        await createOrder({
          product_id: item.product_id || item.product?.id,
          sku_id: item.sku_id || item.sku?.id || null,
          product_name: item.product?.name || item.product_name || '',
          spec_name: item.sku?.spec_name || item.spec_name || '',
          price: price,
          quantity: item.quantity,
          receiver_name: selectedAddress.name,
          receiver_phone: selectedAddress.phone,
          receiver_address: selectedAddress.address,
          payment_method: paymentMethod,
        });
        if (item.cart_id) {
          await deleteCartItem(item.cart_id);
        }
      }
      alert('下单成功！');
      navigate('/cart');
    } catch {
      alert('下单失败，请重试');
    } finally {
      setOrdering(false);
    }
  };

  if (items.length === 0) return null;

  const paymentMethods = [
    { key: 'wechat', label: '微信支付', icon: '💳' },
    { key: 'alipay', label: '支付宝', icon: '📱' },
    { key: 'cod', label: '货到付款', icon: '📦' },
  ];

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>确认订单</h2>

        {/* 收货地址 */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>收货地址</h3>
          {addresses.length === 0 ? (
            <div style={styles.noAddress}>
              <p>暂无收货地址</p>
              <button onClick={() => navigate('/address')} style={styles.linkBtn}>去添加</button>
            </div>
          ) : (
            <div style={styles.addressList}>
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  style={{
                    ...styles.addressCard,
                    ...(selectedAddressId === addr.id ? styles.addressCardActive : {}),
                  }}
                >
                  <div style={styles.addressTop}>
                    <span style={styles.addressName}>{addr.name}</span>
                    <span style={styles.addressPhone}>{addr.phone}</span>
                    {addr.isDefault && <span style={styles.defaultTag}>默认</span>}
                  </div>
                  <div style={styles.addressDetail}>{addr.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 商品信息 */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>商品信息</h3>
          {items.map((item, index) => (
            <div key={index} style={styles.productCard}>
              <div style={styles.productImage}>
                {item.product?.images?.length > 0 ? (
                  <img src={item.product.images[0].image_url} alt="" style={styles.productImg} />
                ) : item.image_url ? (
                  <img src={item.image_url} alt="" style={styles.productImg} />
                ) : (
                  <div style={styles.placeholder}>暂无图片</div>
                )}
              </div>
              <div style={styles.productInfo}>
                <div style={styles.productName}>{item.product?.name || item.product_name || '商品'}</div>
                <div style={styles.productSpec}>{item.sku?.spec_name || item.spec_name || ''}</div>
                <div style={styles.stock}>库存: {item.product?.stock ?? '-'}</div>
                <div style={styles.productPriceRow}>
                  <span style={styles.productPrice}>¥{getPrice(item).toFixed(2)}</span>
                  <div style={styles.quantityControl}>
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      style={styles.qtyBtn}
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span style={styles.qtyValue}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      style={styles.qtyBtn}
                      disabled={item.quantity >= (item.product?.stock ?? Infinity)}
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 支付方式 */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>支付方式</h3>
          <div style={styles.paymentList}>
            {paymentMethods.map(pm => (
              <div
                key={pm.key}
                onClick={() => setPaymentMethod(pm.key)}
                style={{
                  ...styles.paymentCard,
                  ...(paymentMethod === pm.key ? styles.paymentCardActive : {}),
                }}
              >
                <span style={styles.paymentIcon}>{pm.icon}</span>
                <span>{pm.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 合计 */}
        <div style={styles.summary}>
          <span style={styles.totalLabel}>合计：</span>
          <span style={styles.totalPrice}>¥{totalPrice.toFixed(2)}</span>
        </div>

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={ordering || items.length === 0 || !selectedAddress}
          style={{
            ...styles.submitBtn,
            ...(ordering || !selectedAddress ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
          }}
        >
          {ordering ? '提交中...' : '确认下单'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa' },
  container: { maxWidth: 700, margin: '0 auto', padding: '24px' },
  title: { fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: '0 0 24px' },
  section: { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  sectionTitle: { fontSize: 16, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' },
  noAddress: { textAlign: 'center', color: '#999', padding: '20px 0' },
  linkBtn: { background: 'none', border: 'none', color: '#c9a96e', cursor: 'pointer', fontSize: 14, marginTop: 8 },
  addressList: { display: 'flex', flexDirection: 'column', gap: 10 },
  addressCard: { padding: '12px 16px', border: '1px solid #e8e8e8', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' },
  addressCardActive: { borderColor: '#c9a96e', background: '#fefcf8', boxShadow: '0 0 0 1px #c9a96e' },
  addressTop: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 },
  addressName: { fontSize: 15, fontWeight: 600, color: '#333' },
  addressPhone: { fontSize: 14, color: '#666' },
  defaultTag: { padding: '1px 6px', background: '#c9a96e', color: '#fff', fontSize: 11, borderRadius: 3 },
  addressDetail: { fontSize: 13, color: '#555', lineHeight: 1.5 },
  productCard: { display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid #f5f5f5' },
  productImage: { width: 72, height: 72, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#f5f5f5' },
  productImg: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#ccc' },
  productInfo: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  productName: { fontSize: 14, fontWeight: 500, color: '#333' },
  productSpec: { fontSize: 12, color: '#999' },
  stock: { fontSize: 12, color: '#999', marginBottom: 4 },
  productPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 15, fontWeight: 600, color: '#c9a96e' },
  quantityControl: { display: 'flex', alignItems: 'center', border: '1px solid #e8e8e8', borderRadius: 6, overflow: 'hidden' },
  qtyBtn: { width: 28, height: 28, border: 'none', background: '#fafafa', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyValue: { width: 36, textAlign: 'center', fontSize: 13, fontWeight: 500 },
  paymentList: { display: 'flex', gap: 12 },
  paymentCard: { flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', border: '1px solid #e8e8e8', borderRadius: 8, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' },
  paymentCardActive: { borderColor: '#c9a96e', background: '#fefcf8', boxShadow: '0 0 0 1px #c9a96e' },
  paymentIcon: { fontSize: 20 },
  summary: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, padding: '16px 0' },
  totalLabel: { fontSize: 16, color: '#333' },
  totalPrice: { fontSize: 24, fontWeight: 700, color: '#c9a96e' },
  submitBtn: { width: '100%', padding: '14px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
};
