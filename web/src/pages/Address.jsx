import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import REGIONS from '../data/regions';

const STORAGE_KEY = 'web_addresses';

function loadAddresses(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return all[userId] || [];
  } catch {
    return [];
  }
}

function saveAddresses(userId, addresses) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  all[userId] = addresses;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export default function Address() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const [addresses, setAddresses] = useState(() => loadAddresses(userId));
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setAddresses(loadAddresses(userId));
  }, [userId]);

  useEffect(() => {
    saveAddresses(userId, addresses);
  }, [addresses, userId]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [town, setTown] = useState('');
  const [detail, setDetail] = useState('');

  const provinces = Object.keys(REGIONS);
  const cities = province ? Object.keys(REGIONS[province] || {}) : [];
  const districts = province && city ? (REGIONS[province]?.[city] || []) : [];
  const towns = ['默认街道']; // 简化：实际应根据区县动态获取

  const resetForm = () => {
    setName('');
    setPhone('');
    setProvince('');
    setCity('');
    setDistrict('');
    setTown('');
    setDetail('');
  };

  const handleAdd = () => {
    if (!name.trim()) {
      alert('请输入收货人');
      return;
    }
    if (!/^\d{11}$/.test(phone)) {
      alert('手机号必须为11位数字');
      return;
    }
    if (!province || !city || !detail.trim()) {
      alert('请填写完整的收货地址');
      return;
    }
    const fullAddress = `${province} ${city} ${district} ${town} ${detail}`.trim();
    setAddresses([...addresses, { id: Date.now(), name, phone, address: fullAddress, isDefault: addresses.length === 0 }]);
    resetForm();
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const selectStyle = {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    background: '#fff',
    cursor: 'pointer',
  };

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>地址管理</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {showAdd && (
              <button onClick={() => { setShowAdd(false); resetForm(); }} style={styles.cancelBtn}>取消</button>
            )}
            <button onClick={() => setShowAdd(!showAdd)} style={styles.addBtn}>
              {showAdd ? '' : '+ 新增地址'}
            </button>
          </div>
        </div>

        {showAdd && (
          <div style={styles.addForm}>
            <input type="text" placeholder="收货人" value={name} onChange={e => setName(e.target.value)} style={styles.input} />
            <input type="tel" placeholder="联系电话（11位）" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} style={styles.input} />

            <div style={styles.addressRow}>
              <select value={province} onChange={e => { setProvince(e.target.value); setCity(''); setDistrict(''); setTown(''); }} style={selectStyle}>
                <option value="">省份</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={city} onChange={e => { setCity(e.target.value); setDistrict(''); setTown(''); }} style={selectStyle} disabled={!province}>
                <option value="">城市</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={styles.addressRow}>
              <select value={district} onChange={e => { setDistrict(e.target.value); setTown(''); }} style={selectStyle} disabled={!city}>
                <option value="">区/县</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={town} onChange={e => setTown(e.target.value)} style={selectStyle} disabled={!district}>
                <option value="">镇/街道</option>
                {towns.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <input type="text" placeholder="详细地址（如路名、门牌号、小区楼栋）" value={detail} onChange={e => setDetail(e.target.value)} style={styles.input} />

            <button onClick={handleAdd} style={styles.saveBtn}>保存</button>
          </div>
        )}

        {addresses.length === 0 && !showAdd && (
          <div style={styles.empty}>暂无收货地址</div>
        )}

        {addresses.map(addr => (
          <div key={addr.id} style={styles.card}>
            <div style={styles.cardInfo}>
              <span style={styles.cardName}>{addr.name}</span>
              <span style={styles.cardPhone}>{addr.phone}</span>
              {addr.isDefault && <span style={styles.defaultTag}>默认</span>}
            </div>
            <div style={styles.cardAddress}>{addr.address}</div>
            <div style={styles.cardActions}>
              {!addr.isDefault && (
                <button onClick={() => handleSetDefault(addr.id)} style={styles.setAction}>设为默认</button>
              )}
              <button onClick={() => handleDelete(addr.id)} style={{ ...styles.setAction, color: '#ff4d4f' }}>删除</button>
            </div>
          </div>
        ))}

        <button onClick={() => navigate('/list')} style={styles.backBtn}>返回商品列表</button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa' },
  container: { maxWidth: 600, margin: '0 auto', padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  addBtn: { padding: '8px 16px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer' },
  cancelBtn: { padding: '8px 16px', background: '#fff', color: '#333', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 14, cursor: 'pointer' },
  addForm: {
    background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 12,
  },
  input: { padding: '10px 12px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  addressRow: { display: 'flex', gap: 12 },
  saveBtn: { padding: '10px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer', alignSelf: 'flex-end' },
  empty: { textAlign: 'center', color: '#999', padding: '60px 0', fontSize: 14 },
  card: { background: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardInfo: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 },
  cardName: { fontSize: 15, fontWeight: 600, color: '#333' },
  cardPhone: { fontSize: 14, color: '#666' },
  defaultTag: { padding: '2px 8px', background: '#c9a96e', color: '#fff', fontSize: 12, borderRadius: 4 },
  cardAddress: { fontSize: 14, color: '#555', lineHeight: 1.6, marginBottom: 12 },
  cardActions: { display: 'flex', gap: 16 },
  setAction: { background: 'none', border: 'none', color: '#c9a96e', fontSize: 13, cursor: 'pointer', padding: 0 },
  backBtn: { marginTop: 24, padding: '10px 24px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
};
