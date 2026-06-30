import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Modal, Form, Input, message, Popconfirm, Tag, Card, Row, Col,
  Statistic, Space, Typography, Divider, Tooltip, Empty, Image, Select, Rate,
  Badge, App,
} from 'antd';
import {
  EyeOutlined, EditOutlined, DeleteOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
  MessageOutlined, StarOutlined, TeamOutlined, SearchOutlined,
  AuditOutlined, RollbackOutlined, PushpinOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { reviewApi } from '../../services/api';

const { Text, Paragraph } = Typography;

/* ============================================================
   品牌色
   ============================================================ */
const COLORS = {
  primary: '#1F5FA8',
  success: '#6B8E3D',
  warning: '#E8A838',
  danger: '#D94A4A',
};

/* ============================================================
   状态配置
   ============================================================ */
const STATUS_MAP: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
  public: { color: 'success', text: '已公开', icon: <CheckCircleOutlined /> },
  pending: { color: 'warning', text: '待审核', icon: <ExclamationCircleOutlined /> },
  hidden: { color: 'default', text: '已屏蔽', icon: <CloseCircleOutlined /> },
};

/* ============================================================
   敏感词列表
   ============================================================ */
const SENSITIVE_WORDS = ['垃圾', '骗子', '假货', '坑人', '差评', '退货', '退款'];

/* ============================================================
   辅助：高亮敏感词
   ============================================================ */
const highlightSensitive = (text: string) => {
  if (!text) return text;
  let result = text;
  let hasSensitive = false;
  for (const word of SENSITIVE_WORDS) {
    if (result.includes(word)) {
      hasSensitive = true;
      result = result.split(word).join(`@@HIGHLIGHT@@${word}@@END@@`);
    }
  }
  if (!hasSensitive) return text;
  const parts = result.split('@@END@@');
  return (
    <span>
      {parts.map((part, i) => {
        if (part.includes('@@HIGHLIGHT@@')) {
          const [before, word] = part.split('@@HIGHLIGHT@@');
          return (
            <span key={i}>
              {before}
              <Text style={{ color: COLORS.danger, fontWeight: 600 }}>{word}</Text>
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

/* ============================================================
   主组件
   ============================================================ */
const Reviews: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<any>(null);
  const [replyForm] = Form.useForm();
  const [filters, setFilters] = useState({ keyword: '', rating: undefined, status: undefined });
  const [stats, setStats] = useState({ total: 0, public: 0, pending: 0, hidden: 0 });

  // 加载统计
  const loadStats = async () => {
    try {
      const [all, pub, pen, hid] = await Promise.all([
        reviewApi.list({ page: 1, pageSize: 1 }),
        reviewApi.list({ page: 1, pageSize: 1, status: 'public' }),
        reviewApi.list({ page: 1, pageSize: 1, status: 'pending' }),
        reviewApi.list({ page: 1, pageSize: 1, status: 'hidden' }),
      ]);
      const extractTotal = (res: any) => res?.data?.pagination?.total || 0;
      setStats({
        total: extractTotal(all),
        public: extractTotal(pub),
        pending: extractTotal(pen),
        hidden: extractTotal(hid),
      });
    } catch {}
  };

  useEffect(() => { loadStats(); }, []);

  // 提交流
  const fetchReviews = async (params: any) => {
    const { current, pageSize, ...rest } = params;
    try {
      const res = await reviewApi.list({
        page: current,
        pageSize,
        keyword: filters.keyword || rest.keyword,
        rating: filters.rating || rest.rating,
        status: filters.status || rest.status,
        ...rest,
      });
      const data = res?.data || res;
      return { data: data.list || [], success: true, total: data.pagination?.total || 0 };
    } catch {
      return { data: [], success: false, total: 0 };
    }
  };

  // ===== 操作处理 =====

  const handleStatus = async (id: number, status: string) => {
    try {
      await reviewApi.updateStatus(id, status);
      message.success(STATUS_MAP[status]?.text || '操作成功');
      actionRef.current?.reload();
      loadStats();
    } catch { message.error('操作失败'); }
  };

  const handleBatchStatus = async (status: string) => {
    if (!selectedRowKeys.length) { message.warning('请先选择评价'); return; }
    try {
      await reviewApi.batchStatus(selectedRowKeys.map(Number), status);
      message.success(`批量操作成功（${selectedRowKeys.length}条）`);
      setSelectedRowKeys([]);
      actionRef.current?.reload();
      loadStats();
    } catch { message.error('批量操作失败'); }
  };

  const handleBatchDelete = async () => {
    if (!selectedRowKeys.length) { message.warning('请先选择评价'); return; }
    try {
      await reviewApi.batchDelete(selectedRowKeys.map(Number));
      message.success(`已删除 ${selectedRowKeys.length} 条评价`);
      setSelectedRowKeys([]);
      actionRef.current?.reload();
      loadStats();
    } catch { message.error('批量删除失败'); }
  };

  const handleReply = async () => {
    if (!replyTarget) return;
    try {
      const values = await replyForm.validateFields();
      await reviewApi.reply(replyTarget.id, values.reply);
      message.success('回复成功');
      setReplyModalOpen(false);
      replyForm.resetFields();
      actionRef.current?.reload();
    } catch { message.error('回复失败'); }
  };

  // ===== 表格列 =====
  const columns: ProColumns<any>[] = [
    // ---- 商品信息 ----
    {
      title: '商品信息',
      dataIndex: 'product_name',
      width: 200,
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image
            src={r.product_image}
            width={40}
            height={40}
            style={{ borderRadius: 6, objectFit: 'cover', border: '1px solid #f0f0f0' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            preview={{ mask: <EyeOutlined style={{ fontSize: 14 }} /> }}
          />
          <div style={{ minWidth: 0 }}>
            <Text
              ellipsis={{ tooltip: r.product_name }}
              style={{ fontSize: 13, fontWeight: 500, display: 'block', maxWidth: 120, cursor: 'pointer', color: COLORS.primary }}
              onClick={() => navigate(`/modules/clothing`)}
            >
              {r.product_name || '未知商品'}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>ID: {r.product_id}</Text>
          </div>
        </div>
      ),
    },
    // ---- 评价内容 ----
    {
      title: '评价内容',
      dataIndex: 'content',
      width: 260,
      render: (v, r) => (
        <div>
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
            style={{ marginBottom: 0, fontSize: 13, lineHeight: 1.6 }}
          >
            {highlightSensitive(v || '')}
          </Paragraph>
          {r.images && (
            <Space size={4} style={{ marginTop: 6 }}>
              {(Array.isArray(r.images) ? r.images : []).slice(0, 3).map((img: string, i: number) => (
                <Image
                  key={i}
                  src={img}
                  width={36}
                  height={36}
                  style={{ borderRadius: 4, objectFit: 'cover', border: '1px solid #f0f0f0' }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
              ))}
              {Array.isArray(r.images) && r.images.length > 3 && (
                <Text type="secondary" style={{ fontSize: 11 }}>+{r.images.length - 3}</Text>
              )}
            </Space>
          )}
        </div>
      ),
    },
    // ---- 评分 ----
    {
      title: '评分',
      dataIndex: 'rating',
      width: 120,
      align: 'center',
      render: (v) => (
        <Space>
          <Rate disabled value={Number(v)} style={{ fontSize: 12, color: '#FAAD14', whiteSpace: 'nowrap' }} />
          <Text style={{ fontSize: 12, color: '#8C8C8C' }}>{v}</Text>
        </Space>
      ),
    },
    // ---- 评价人 ----
    {
      title: '评价人',
      dataIndex: 'user_name',
      width: 100,
      render: (v, r) => (
        <Space>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: COLORS.primary, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, flexShrink: 0,
          }}>
            {(v || '?').charAt(0)}
          </div>
          <Text style={{ fontSize: 13 }}>{v || `用户${r.user_id}`}</Text>
        </Space>
      ),
    },
    // ---- 时间 ----
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 100,
      align: 'center',
      render: (v) => v ? (
        <Text type="secondary" style={{ fontSize: 12 }}>{v.slice(0, 16).replace('T', ' ')}</Text>
      ) : '-',
    },
    // ---- 状态 ----
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      align: 'center',
      render: (v) => {
        const cfg = STATUS_MAP[v] || STATUS_MAP.public;
        return <Tag color={cfg.color} icon={cfg.icon} style={{ borderRadius: 4 }}>{cfg.text}</Tag>;
      },
    },
    // ---- 操作 ----
    {
      title: '操作',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size={0}>
          {record.status === 'hidden' && (
            <Tooltip title="恢复公开">
              <Button
                type="text" size="small"
                icon={<RollbackOutlined />}
                onClick={() => handleStatus(record.id, 'public')}
                style={{ color: COLORS.success }}
              />
            </Tooltip>
          )}
          {record.status === 'public' && (
            <>
              <Tooltip title="屏蔽评价">
                <Button
                  type="text" size="small"
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleStatus(record.id, 'hidden')}
                  style={{ color: COLORS.danger }}
                />
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="置顶评价（预留）">
                <Button
                  type="text" size="small"
                  icon={<PushpinOutlined />}
                  style={{ color: COLORS.warning }}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'pending' && (
            <>
              <Tooltip title="审核通过">
                <Button
                  type="text" size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleStatus(record.id, 'public')}
                  style={{ color: COLORS.success }}
                />
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="屏蔽">
                <Button
                  type="text" size="small"
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleStatus(record.id, 'hidden')}
                  style={{ color: COLORS.danger }}
                />
              </Tooltip>
            </>
          )}
          <Divider type="vertical" />
          <Tooltip title="回复评价">
            <Button
              type="text" size="small"
              icon={<MessageOutlined />}
              onClick={() => { setReplyTarget(record); replyForm.setFieldsValue({ reply: record.reply || '' }); setReplyModalOpen(true); }}
              style={{ color: COLORS.primary }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除此评价？"
            onConfirm={async () => {
              try { await reviewApi.delete(record.id); message.success('已删除'); actionRef.current?.reload(); loadStats(); }
              catch { message.error('删除失败'); }
            }}
          >
            <Tooltip title="删除评价">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 0 }}>
      {/* ===== 顶部统计 ===== */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {[
          { title: '全部评价', value: stats.total, icon: <MessageOutlined />, color: COLORS.primary, bg: '#E8F4FD' },
          { title: '已公开', value: stats.public, icon: <CheckCircleOutlined />, color: COLORS.success, bg: '#EDF7ED' },
          { title: '待审核', value: stats.pending, icon: <AuditOutlined />, color: COLORS.warning, bg: '#FFF7E6' },
          { title: '已屏蔽', value: stats.hidden, icon: <CloseCircleOutlined />, color: COLORS.danger, bg: '#FFF1F0' },
        ].map(item => (
          <Col xs={12} sm={12} md={6} key={item.title}>
            <Card hoverable style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -10, right: -10, width: 72, height: 72, borderRadius: '50%', background: item.bg, opacity: 0.5 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: item.color, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.title}</Text>
                  <div style={{ fontSize: 26, fontWeight: 700, color: item.color, lineHeight: 1.3 }}>{item.value}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ===== 主表格 ===== */}
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 24px' } }}>
        <ProTable
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={fetchReviews}
          search={false}
          // ---- 自定义筛选栏 ----
          toolbar={{
            search: {
              placeholder: '搜索商品名称或ID',
              style: { width: 260 },
              onSearch: (v) => { setFilters(prev => ({ ...prev, keyword: v })); actionRef.current?.reload(); },
            },
            filter: (
              <Space>
                <Select
                  placeholder="评分筛选"
                  allowClear
                  style={{ width: 140 }}
                  onChange={(v) => { setFilters(prev => ({ ...prev, rating: v })); actionRef.current?.reload(); }}
                  options={[
                    { label: '⭐ 全部评分', value: undefined },
                    { label: '🌟🌟🌟🌟🌟 好评 (5分)', value: '5' },
                    { label: '🌟🌟🌟🌟 好评 (4分)', value: '4' },
                    { label: '🌟🌟🌟 中评 (3分)', value: '3' },
                    { label: '差评 (1-2分)', value: '1' },
                  ]}
                />
                <Select
                  placeholder="状态筛选"
                  allowClear
                  style={{ width: 150 }}
                  onChange={(v) => { setFilters(prev => ({ ...prev, status: v })); actionRef.current?.reload(); }}
                  options={[
                    { label: '全部状态', value: undefined },
                    { label: '✅ 已公开', value: 'public' },
                    { label: '⏳ 待审核', value: 'pending' },
                    { label: '🚫 已屏蔽', value: 'hidden' },
                  ]}
                />
              </Space>
            ),
          }}
          // ---- 勾选 ----
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
            selections: [
              { key: 'all', text: '全选当前页', onSelect: (keys) => setSelectedRowKeys(keys) },
              { key: 'none', text: '取消选择', onSelect: () => setSelectedRowKeys([]) },
            ],
          }}
          // ---- 批量操作栏 ----
          toolBarRender={() => selectedRowKeys.length > 0 ? [
            <Space key="batch" style={{ animation: 'fadeIn 0.2s' }}>
              <Badge count={selectedRowKeys.length} style={{ backgroundColor: COLORS.primary }} overflowCount={999} />
              <Button size="small" icon={<CheckCircleOutlined />} onClick={() => handleBatchStatus('public')}>批量公开</Button>
              <Button size="small" icon={<CloseCircleOutlined />} onClick={() => handleBatchStatus('hidden')}>批量屏蔽</Button>
              <Popconfirm title={`确定删除 ${selectedRowKeys.length} 条评价？`} onConfirm={handleBatchDelete}>
                <Button size="small" danger icon={<DeleteOutlined />}>批量删除</Button>
              </Popconfirm>
            </Space>,
          ] : [
            <Button key="refresh" onClick={() => { actionRef.current?.reload(); loadStats(); }}>刷新</Button>,
          ]}
          // ---- 分页 ----
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`,
          }}
          options={{ density: true, fullScreen: true, reload: true }}
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>暂无评价数据</span>} />
            ),
          }}
        />
      </Card>

      {/* ===== 回复弹窗 ===== */}
      <Modal
        title={<Space><MessageOutlined /> 回复评价</Space>}
        open={replyModalOpen}
        onOk={handleReply}
        onCancel={() => { setReplyModalOpen(false); replyForm.resetFields(); }}
        okText="发布回复"
        cancelText="取消"
        width={520}
        destroyOnClose
      >
        {replyTarget && (
          <div style={{ marginBottom: 16, padding: 12, background: '#f9f9f9', borderRadius: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>正在回复</Text>
            <div style={{ fontWeight: 500, margin: '4px 0' }}>{replyTarget.user_name}：</div>
            <Text style={{ fontSize: 13, color: '#666' }}>"{replyTarget.content}"</Text>
          </div>
        )}
        <Form form={replyForm} layout="vertical">
          <Form.Item name="reply" label="回复内容" rules={[{ required: true, message: '请输入回复内容' }]}>
            <Input.TextArea rows={4} placeholder="请输入商家回复..." maxLength={500} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reviews;
