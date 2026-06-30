import React, { useRef, useState } from 'react';
import { Button, message, Popconfirm, Tag, Card, Space, Typography, Empty, Tooltip, Modal, Input, Select, Avatar } from 'antd';
import { DeleteOutlined, EyeOutlined, MessageOutlined, WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { communityApi } from '../../../services/community';

const { Text } = Typography;
const { Search } = Input;
const C = { primary: '#1F5FA8', success: '#6B8E3D', danger: '#D94A4A', warning: '#E8A838' };

const previewStyle = {
  padding: 12, background: '#FAFAFA', borderRadius: 8, lineHeight: 1.8,
  fontSize: 14, color: '#595959', whiteSpace: 'pre-wrap' as const,
};

const SENSITIVE_WORDS = ['广告', '加微信', '代购', '刷单', '骗子'];

const highlightSensitive = (text: string) => {
  if (!text) return text;
  let result = text;
  let hasSensitive = false;
  for (const word of SENSITIVE_WORDS) {
    if (result.includes(word)) {
      hasSensitive = true;
      result = result.split(word).join(`@@HL@@${word}@@END@@`);
    }
  }
  if (!hasSensitive) return text;
  const parts = result.split('@@END@@');
  return (
    <span>
      {parts.map((part, i) => {
        if (part.includes('@@HL@@')) {
          const [before, word] = part.split('@@HL@@');
          return <span key={i}>{before}<Text style={{ color: C.danger, fontWeight: 600 }}>{word}</Text></span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

const CommentTab: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const columns: ProColumns<any>[] = [
    {
      title: '#', width: 40, align: 'center',
      render: (_: any, _r: any, i: number) => (
        <Tag style={{ borderRadius: 6, minWidth: 18, textAlign: 'center', fontSize: 10 }}>{i + 1}</Tag>
      ),
    },
    {
      title: '用户', width: 160,
      render: (_, r) => (
        <Space>
          <Avatar size={32} style={{ backgroundColor: C.primary, verticalAlign: 'middle', fontSize: 13, flexShrink: 0 }}>
            {(r.user_name || '匿').charAt(0)}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 13, display: 'block' }}>{r.user_name || '匿名'}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>ID: {r.userId || r.user_id || '-'}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '评论内容', width: 360,
      render: (_, r) => (
        <div>
          <Text style={{ fontSize: 13, lineHeight: 1.6 }}>{highlightSensitive(r.content || '')}</Text>
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 11, cursor: 'pointer', color: C.primary }}>
              评论于：游记 #{r.targetId}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: '热度', width: 80, align: 'center',
      render: () => <Text style={{ fontSize: 12 }}>👍 0 | 💬 0</Text>,
    },
    {
      title: '类型', width: 60, align: 'center',
      render: (_, r) => <Tag color="blue" style={{ borderRadius: 4, fontSize: 11 }}>{r.targetType === 'travelogue' ? '游记' : '回复'}</Tag>,
    },
    {
      title: '状态', width: 70, align: 'center',
      render: () => <Tag color="success" style={{ borderRadius: 4, fontSize: 11 }}>正常</Tag>,
    },
    { title: '时间', dataIndex: 'createdAt', width: 80, render: (v) => v ? String(v).slice(0, 10) : '-' },
    {
      title: '操作', width: 130, align: 'center',
      render: (_, r) => (
        <Space size={0}>
          <Tooltip title="查看全文">
            <Button type="text" size="small" icon={<EyeOutlined />}
              onClick={() => { setPreviewContent(r.content || ''); setPreviewOpen(true); }}
              style={{ color: C.primary }} />
          </Tooltip>
          <Tooltip title="回复">
            <Button type="text" size="small" icon={<MessageOutlined />}
              style={{ color: C.success }} />
          </Tooltip>
          <Popconfirm title="确定删除该评论？" description="删除后不可恢复"
            onConfirm={async () => { await communityApi.deleteComment(r.id); message.success('已删除'); actionRef.current?.reload(); }}
            okText="删除" cancelText="取消" okButtonProps={{ danger: true }}>
            <Tooltip title="删除">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        styles={{ body: { padding: '16px 24px' } }}>
        <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
          request={async () => {
            try {
              const res = await communityApi.listComments({ page: 1, pageSize: 100 });
              let list = res?.data?.list || [];
              if (searchText) list = list.filter((r: any) => (r.content || '').includes(searchText) || (r.user_name || '').includes(searchText));
              return { data: list || [], success: true };
            } catch { return { data: [], success: false }; }
          }}
          toolbar={{
            filter: (
              <Space wrap>
                <Search placeholder="搜索评论内容/用户名" allowClear style={{ width: 240 }}
                  value={searchText} onChange={e => setSearchText(e.target.value)}
                  onSearch={() => actionRef.current?.reload()} />
                <Select placeholder="状态筛选" allowClear style={{ width: 130 }} value={statusFilter}
                  onChange={(v) => { setStatusFilter(v); actionRef.current?.reload(); }}
                  options={[{ label: '全部状态', value: undefined }, { label: '正常', value: 'normal' }, { label: '待审核', value: 'pending' }, { label: '违规', value: 'violation' }].filter(Boolean)} />
                <Select placeholder="时间范围" allowClear style={{ width: 130 }}
                  options={[{ label: '全部', value: undefined }, { label: '近7天', value: '7d' }, { label: '近30天', value: '30d' }]} />
              </Space>
            ),
          }}
          pagination={{
            pageSize: 10, showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`,
            size: 'default',
          }}
          rowClassName={(_, index) => index % 2 === 0 ? undefined : 'row-odd'}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无评论" /> }}
        />
      </Card>
      <style>{`.row-odd { background: #FAFAFA; } .ant-table-row:hover td { background: #F0F5FF !important; }`}</style>
      <Modal title="评论全文" open={previewOpen}
        onCancel={() => { setPreviewOpen(false); setPreviewContent(''); }}
        footer={null} width={480}>
        <div style={previewStyle}>{previewContent}</div>
      </Modal>
    </>
  );
};

export default CommentTab;
