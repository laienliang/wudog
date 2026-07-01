import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendChatMessage, getChatConversation } from '../utils/api';

export default function ChatDrawer({ open, onClose, adminId = 1 }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    if (open && user) {
      loadMessages();
      // 轮询新消息
      pollRef.current = setInterval(loadMessages, 3000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [open, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    if (!user) return;
    try {
      const res = await getChatConversation(adminId);
      setMessages(res.data?.list || []);
    } catch {}
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await sendChatMessage({
        receiver_type: 'admin',
        receiver_id: adminId,
        content: input.trim(),
      });
      setInput('');
      await loadMessages();
    } catch {
      alert('发送失败');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.title}>在线客服</span>
          <button onClick={onClose} style={styles.closeBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={styles.messages}>
          {messages.length === 0 && (
            <div style={styles.emptyHint}>
              <p>您好！有什么可以帮您的吗？</p>
            </div>
          )}
          {messages.map(msg => (
            <div
              key={msg.id}
              style={msg.sender_type === 'user' ? styles.msgRight : styles.msgLeft}
            >
              <div style={msg.sender_type === 'user' ? styles.bubbleRight : styles.bubbleLeft}>
                {msg.content}
              </div>
              <span style={styles.time}>{new Date(msg.created_at).toLocaleTimeString()}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            style={styles.input}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            style={{ ...styles.sendBtn, opacity: (!input.trim() || sending) ? 0.5 : 1 }}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.3)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  drawer: {
    width: 380,
    maxWidth: '100%',
    height: '100%',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0',
    background: '#1a1a2e',
    color: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: 4,
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  emptyHint: {
    textAlign: 'center',
    color: '#999',
    padding: '40px 0',
    fontSize: 14,
  },
  msgLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '80%',
  },
  msgRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  bubbleLeft: {
    padding: '10px 14px',
    background: '#f0f0f0',
    borderRadius: '12px 12px 12px 4px',
    fontSize: 14,
    lineHeight: 1.5,
    color: '#333',
  },
  bubbleRight: {
    padding: '10px 14px',
    background: '#c9a96e',
    borderRadius: '12px 12px 4px 12px',
    fontSize: 14,
    lineHeight: 1.5,
    color: '#fff',
  },
  time: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 4,
  },
  inputArea: {
    display: 'flex',
    gap: 8,
    padding: '12px 20px',
    borderTop: '1px solid #f0f0f0',
    background: '#fafafa',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
  },
  sendBtn: {
    padding: '10px 20px',
    background: '#c9a96e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
};
