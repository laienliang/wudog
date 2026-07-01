import { useState, useEffect, useRef } from 'react';
import { Input, Button, List, Badge, Empty, Spin } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { getAdminConversations, getChatConversation, sendChatMessage } from '../utils/api';

export default function ChatManage() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    loadConversations();
    pollRef.current = setInterval(loadConversations, 5000);
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser);
      const msgPoll = setInterval(() => loadMessages(selectedUser), 3000);
      return () => clearInterval(msgPoll);
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await getAdminConversations();
      setConversations(res.data || []);
    } catch {}
  };

  const selectedNickname = conversations.find(c => c.user_id === selectedUser)?.nickname || `用户 #${selectedUser}`;

  const loadMessages = async (userId) => {
    try {
      const res = await getChatConversation(userId);
      setMessages(res.data?.list || []);
    } catch {}
  };

  const handleSend = async () => {
    if (!input.trim() || sending || !selectedUser) return;
    setSending(true);
    try {
      await sendChatMessage({
        receiver_type: 'user',
        receiver_id: selectedUser,
        content: input.trim(),
      });
      setInput('');
      await loadMessages(selectedUser);
      await loadConversations();
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

  return (
    <div style={styles.container}>
      {/* 左侧会话列表 */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>客服会话</div>
        {conversations.length === 0 ? (
          <div style={styles.emptySidebar}>暂无会话</div>
        ) : (
          <div style={styles.convList}>
            {conversations.map(conv => (
              <div
                key={conv.user_id}
                onClick={() => setSelectedUser(conv.user_id)}
                style={{
                  ...styles.convItem,
                  ...(selectedUser === conv.user_id ? styles.convItemActive : {}),
                }}
              >
                <div style={styles.convInfo}>
                  <span style={styles.convName}>{conv.nickname || `用户 #${conv.user_id}`}</span>
                  <span style={styles.convTime}>
                    {conv.last_message ? new Date(conv.last_message.created_at).toLocaleTimeString() : ''}
                  </span>
                </div>
                <div style={styles.convLastMsg}>
                  {conv.last_message?.content?.slice(0, 30) || '暂无消息'}
                </div>
                {conv.unread > 0 && (
                  <Badge count={conv.unread} style={styles.badge} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 右侧聊天区域 */}
      <div style={styles.chatArea}>
        {selectedUser ? (
          <>
            <div style={styles.chatHeader}>{selectedNickname}</div>
            <div style={styles.messages}>
              {messages.length === 0 && (
                <div style={styles.emptyChat}>暂无消息</div>
              )}
              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={msg.sender_type === 'admin' ? styles.msgRight : styles.msgLeft}
                >
                  <div style={msg.sender_type === 'admin' ? styles.bubbleRight : styles.bubbleLeft}>
                    {msg.content}
                  </div>
                  <span style={styles.time}>{new Date(msg.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={styles.inputArea}>
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入回复内容..."
                style={styles.input}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={sending}
                disabled={!input.trim()}
                style={styles.sendBtn}
              >
                发送
              </Button>
            </div>
          </>
        ) : (
          <div style={styles.placeholder}>
            <Empty description="请选择一个会话" />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 64px)',
    background: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #f0f0f0',
  },
  sidebar: {
    width: 280,
    borderRight: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '16px 20px',
    fontWeight: 600,
    fontSize: 16,
    borderBottom: '1px solid #f0f0f0',
    background: '#fafafa',
  },
  emptySidebar: {
    padding: '40px 0',
    textAlign: 'center',
    color: '#999',
  },
  convList: {
    flex: 1,
    overflowY: 'auto',
  },
  convItem: {
    padding: '14px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid #f5f5f5',
    transition: 'background 0.2s',
    position: 'relative',
  },
  convItemActive: {
    background: '#e6f7ff',
  },
  convInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  convName: {
    fontWeight: 500,
    fontSize: 14,
  },
  convTime: {
    fontSize: 11,
    color: '#999',
  },
  convLastMsg: {
    fontSize: 12,
    color: '#999',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  badge: {
    position: 'absolute',
    bottom: 12,
    right: 16,
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chatHeader: {
    padding: '14px 20px',
    fontWeight: 600,
    fontSize: 15,
    borderBottom: '1px solid #f0f0f0',
    background: '#fafafa',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  emptyChat: {
    textAlign: 'center',
    color: '#999',
    padding: '40px 0',
  },
  msgLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '70%',
  },
  msgRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    maxWidth: '70%',
    alignSelf: 'flex-end',
  },
  bubbleLeft: {
    padding: '10px 14px',
    background: '#f0f0f0',
    borderRadius: '12px 12px 12px 4px',
    fontSize: 14,
    lineHeight: 1.5,
  },
  bubbleRight: {
    padding: '10px 14px',
    background: '#1890ff',
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
    padding: '16px 20px',
    borderTop: '1px solid #f0f0f0',
    background: '#fafafa',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  sendBtn: {
    height: 40,
    background: '#c9a96e',
    borderColor: '#c9a96e',
    fontSize: 14,
  },
  placeholder: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
