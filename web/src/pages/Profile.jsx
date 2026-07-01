import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, updatePassword, uploadImage } from '../utils/api';
import Header from './Header';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [uploading, setUploading] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      const url = res.data?.url;
      if (url) setAvatar(url);
    } catch {
      alert('上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!nickname.trim()) {
      alert('昵称不能为空');
      return;
    }
    if (phone && !/^\d{11}$/.test(phone)) {
      alert('手机号必须为11位数字');
      return;
    }
    try {
      const res = await updateProfile({ nickname, avatar, phone });
      setUser(res.data);
      localStorage.setItem('web_user', JSON.stringify(res.data));
      setEditing(false);
      alert('更新成功');
    } catch {
      alert('更新失败');
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert('请填写完整');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    if (newPassword.length < 6) {
      alert('新密码至少6位');
      return;
    }
    setChangingPwd(true);
    try {
      await updatePassword({ oldPassword, newPassword });
      alert('密码修改成功');
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      alert('修改失败');
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>个人中心</h2>

        <div style={styles.card}>
          {/* 头像 */}
          <div style={styles.avatarSection}>
            <div style={styles.avatarWrapper}>
              {avatar ? (
                <img src={avatar} alt="头像" style={styles.avatar} />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 40, height: 40, color: '#ccc' }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
            {editing && (
              <label style={styles.uploadBtn}>
                {uploading ? '上传中...' : '更换头像'}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          {/* 信息 */}
          <div style={styles.infoRow}>
            <span style={styles.label}>用户名</span>
            <span style={styles.value}>{user?.username || '-'}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>昵称</span>
            {editing ? (
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                style={styles.input}
              />
            ) : (
              <span style={styles.value}>{user?.nickname || '-'}</span>
            )}
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>手机号</span>
            {editing ? (
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="请输入11位手机号"
                maxLength={11}
                style={styles.input}
              />
            ) : (
              <span style={styles.value}>{user?.phone || '-'}</span>
            )}
          </div>

          {/* 操作按钮 */}
          <div style={styles.actions}>
            {editing ? (
              <>
                <button onClick={handleSaveProfile} style={styles.saveBtn}>保存</button>
                <button onClick={() => { setEditing(false); setNickname(user?.nickname || ''); setPhone(user?.phone || ''); setAvatar(user?.avatar || ''); }} style={styles.cancelBtn}>取消</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} style={styles.editBtn}>编辑资料</button>
                <button onClick={() => setShowPasswordModal(true)} style={styles.pwdBtn}>修改密码</button>
              </>
            )}
          </div>
        </div>

        <button onClick={() => navigate('/list')} style={styles.backBtn}>返回商品列表</button>
      </div>

      {/* 修改密码弹窗 */}
      {showPasswordModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>修改密码</h3>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>原密码</label>
                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="请输入原密码" style={styles.formInput} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>新密码</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="请输入新密码（至少6位）" style={styles.formInput} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>确认新密码</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="请再次输入新密码" style={styles.formInput} />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => { setShowPasswordModal(false); setOldPassword(''); setNewPassword(''); setConfirmPassword(''); }} style={styles.modalCancelBtn}>取消</button>
              <button onClick={handleChangePassword} disabled={changingPwd} style={styles.modalConfirmBtn}>
                {changingPwd ? '修改中...' : '确认修改'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa' },
  container: { maxWidth: 600, margin: '0 auto', padding: '24px' },
  title: { fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: '0 0 24px' },
  card: { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  avatarSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', background: '#f0f0f0', marginBottom: 12 },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  uploadBtn: { padding: '6px 16px', background: '#f0f0f0', color: '#666', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
  infoRow: { display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  label: { width: 80, fontSize: 14, color: '#666' },
  value: { flex: 1, fontSize: 14, color: '#333' },
  input: { flex: 1, padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 14, outline: 'none' },
  actions: { display: 'flex', gap: 12, marginTop: 24 },
  editBtn: { padding: '10px 24px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
  pwdBtn: { padding: '10px 24px', background: '#fff', color: '#333', border: '1px solid #d9d9d9', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
  saveBtn: { padding: '10px 24px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
  cancelBtn: { padding: '10px 24px', background: '#fff', color: '#333', border: '1px solid #d9d9d9', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
  backBtn: { marginTop: 24, padding: '10px 24px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 12, width: 400 },
  modalTitle: { fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: 0, padding: '20px 24px', borderBottom: '1px solid #f0f0f0' },
  modalBody: { padding: '20px 24px' },
  formGroup: { marginBottom: 16 },
  formLabel: { display: 'block', fontSize: 14, fontWeight: 500, color: '#333', marginBottom: 8 },
  formInput: { width: '100%', padding: '10px 12px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 24px', borderTop: '1px solid #f0f0f0' },
  modalCancelBtn: { padding: '8px 20px', background: '#fff', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 14, cursor: 'pointer' },
  modalConfirmBtn: { padding: '8px 20px', background: '#c9a96e', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer' },
};
