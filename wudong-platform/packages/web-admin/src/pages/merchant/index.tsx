import React, { useState, useRef } from 'react';
import {
  Button, Modal, Form, Input, message, Tag, Space, Card, Typography,
  Tooltip, Empty, Select, Descriptions, Divider, Popconfirm, Image,
} from 'antd';
import {
  ReloadOutlined, EyeOutlined, ShopOutlined, CheckCircleOutlined,
  CloseCircleOutlined, ExclamationCircleOutlined, LogoutOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import dayjs from 'dayjs';
import { adminApi } from '../../services/admin';

const { Text } = Typography;

/* ============================================================
   品牌色系统
   ============================================================ */
const COLORS = {
  primary: '#1F5FA8',
  success: '#6B8E3D',
  warning: '#E8A838',
  danger: '#D94A4A',
  textSecondary: '#8C8C8C',
};

/* ============================================================
   模块映射
   ============================================================ */
const MODULE_MAP: Record<string, { label: string; color: string }> = {
  clothing: { label: '民族服饰', color: '#9B59B6' },
  food: { label: '餐饮美食', color: '#E67E22' },
  accommodation: { label: '民宿住宿', color: '#1ABC9C' },
  travel: { label: '旅游线路', color: '#3498DB' },
};

/* ============================================================
   商家状态
   ============================================================ */
const STATUS_MAP: Record<number, { label: string; color: string; icon: React.ReactNode }> = {
  0: { label: '待审核', color: 'processing', icon: <ExclamationCircleOutlined /> },
  1: { label: '已通过', color: 'success', icon: <CheckCircleOutlined /> },
  2: { label: '已驳回', color: 'error', icon: <CloseCircleOutlined /> },
  3: { label: '已封禁', color: 'default', icon: <CloseCircleOutlined /> },
};

/* ============================================================
   商家管理页面
   ============================================================ */
const MerchantList: React.FC = () => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<number>(1);
  const actionRef = useRef<ActionType>();

  // 自定义请求
  const fetchMerchants = async (params: any) => {
    const { current, pageSize, module, status, ...rest } = params;
    try {
      const res = await adminApi.listMerchants({
        page: current,
        pageSize,
        module: module || undefined,
        status: status !== undefined && status !== null ? status : undefined,
        ...rest,
      });
      const data = res.data || res;
      const list = data.list || [];
      const pagination = data.pagination || { total: 0 };
      return { data: list, success: true, total: pagination.total || 0 };
    } catch {
      return { data: [], success: false, total: 0 };
    }
  };

  // 查看详情
  const handleViewDetail = (record: any) => {
    setSelectedMerchant(record);
    setDetailOpen(true);
  };

  // 修改状态
  const handleStatusChange = (record: any) => {
    setSelectedMerchant(record);
    setNewStatus(record.status === 3 ? 1 : 0); // 封禁→已通过, 其他→待审核
    setStatusOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedMerchant) return;
    try {
      await adminApi.updateMerchantStatus(selectedMerchant.id, newStatus);
      message.success('状态已更新');
      setStatusOpen(false);
      setSelectedMerchant(null);
      actionRef.current?.reload();
    } catch {
      message.error('操作失败');
    }
  };

  // 表格列配置
  const columns: ProColumns<any>[] = [
    {
      title: '排序',
      width: 55,
      align: 'center',
      render: (_: any, _r: any, index: number) => (
        <Tag style={{ borderRadius: 8, minWidth: 20, textAlign: 'center', fontSize: 11 }}>{index + 1}</Tag>
      ),
    },
    {
      title: '店铺名',
      dataIndex: 'shopName',
      width: 180,
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {r.coverImage ? (
            <Image src={r.coverImage} width={40} height={40} style={{ borderRadius: 6, objectFit: 'cover' }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" />
          ) : <ShopOutlined style={{ color: COLORS.primary, fontSize: 20 }} />}
          <div>
            <Text strong style={{ fontSize: 14 }}>{r.shopName || r.name || '未命名店铺'}</Text>
            {r.id && <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>ID: {r.id}</Text>}
          </div>
        </div>
      ),
    },
    {
      title: '所属模块',
      dataIndex: 'module',
      width: 120,
      align: 'center',
      valueType: 'select',
      valueEnum: Object.fromEntries(
        Object.entries(MODULE_MAP).map(([key, val]) => [key, { text: val.label }])
      ),
      render: (_: any, record: any) => {
        const mod = MODULE_MAP[record.module];
        if (!mod) return <Tag style={{ borderRadius: 4 }}>-</Tag>;
        return (
          <Tag
            color={mod.color}
            style={{ borderRadius: 4, fontWeight: 500 }}
          >
            {mod.label}
          </Tag>
        );
      },
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      width: 100,
      render: (v) => <Text>{v || '-'}</Text>,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      width: 130,
      render: (v) => v ? <Text>{v.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        0: { text: '待审核', status: 'Processing' },
        1: { text: '已通过', status: 'Success' },
        2: { text: '已驳回', status: 'Error' },
        3: { text: '已封禁', status: 'Default' },
      },
      render: (_: any, record: any) => {
        const st = STATUS_MAP[record.status];
        return st ? (
          <Tag color={st.color} icon={st.icon} style={{ borderRadius: 4 }}>
            {st.label}
          </Tag>
        ) : <Tag style={{ borderRadius: 4 }}>未知({record.status})</Tag>;
      },
    },
    {
      title: '入驻时间',
      dataIndex: 'createdAt',
      width: 130,
      align: 'center',
      sorter: true,
      render: (v) => v ? (
        <Tooltip title={dayjs(v).format('YYYY-MM-DD HH:mm:ss')}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(v).format('YYYY-MM-DD HH:mm')}
          </Text>
        </Tooltip>
      ) : '-',
    },
    {
      title: '操作',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
              style={{ color: COLORS.primary }}
            >
              详情
            </Button>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="修改状态">
            <Button type="text" size="small" onClick={() => handleStatusChange(record)} style={{ color: COLORS.warning }}>状态</Button>
          </Tooltip>
          <Popconfirm title="确定强制该商家下线？" onConfirm={async () => {
            try { await adminApi.forceLogoutMerchant(record.id); message.success('已强制下线'); actionRef.current?.reload(); }
            catch { message.error('操作失败'); }
          }}>
            <Tooltip title="强制下线">
              <Button type="text" size="small" danger icon={<LogoutOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 0 }}>
      <Card
        style={{
          borderRadius: 10,
          border: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
        styles={{ body: { padding: '16px 24px' } }}
      >
        <ProTable
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={fetchMerchants}
          // ---- 搜索栏 ----
          search={{
            labelWidth: 'auto',
            defaultCollapsed: true,
            collapseRender: (collapsed) => collapsed ? '展开筛选' : '收起筛选',
          }}
          // ---- 工具栏 ----
          toolBarRender={() => [
            <Button
              key="refresh"
              icon={<ReloadOutlined />}
              onClick={() => actionRef.current?.reload()}
            >
              刷新
            </Button>,
          ]}
          // ---- 分页 ----
          pagination={{
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50', '100'],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`,
          }}
          options={{
            density: true,
            fullScreen: true,
            reload: true,
            setting: true,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span>暂无商家数据</span>}
              />
            ),
          }}
          sticky={{ offsetHeader: 0 }}
        />
      </Card>

      {/* ===== 详情弹窗 ===== */}
      <Modal
        title={
          <Space>
            <ShopOutlined style={{ color: COLORS.primary }} />
            <span>商家详情</span>
          </Space>
        }
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailOpen(false)}>关闭</Button>,
        ]}
        width={600}
        style={{ top: 40 }}
      >
        {selectedMerchant && (
          <Descriptions
            column={2}
            bordered
            size="small"
            style={{ marginTop: 16 }}
          >
            <Descriptions.Item label="店铺ID" span={2}>
              <Text code>{selectedMerchant.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="店铺名称" span={2}>
              <Text strong>{selectedMerchant.shopName || selectedMerchant.name || '未命名'}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="所属模块">
              {(() => {
                const mod = MODULE_MAP[selectedMerchant.module];
                return mod ? (
                  <Tag color={mod.color} style={{ borderRadius: 4 }}>{mod.label}</Tag>
                ) : <Text type="secondary">-</Text>;
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {(() => {
                const st = STATUS_MAP[selectedMerchant.status];
                return st ? (
                  <Tag color={st.color} icon={st.icon} style={{ borderRadius: 4 }}>{st.label}</Tag>
                ) : <Text type="secondary">-</Text>;
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="联系人">
              {selectedMerchant.contactName || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {selectedMerchant.contactPhone
                ? selectedMerchant.contactPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="联系地址" span={2}>
              {selectedMerchant.address || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="店铺介绍" span={2}>
              {selectedMerchant.description || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="入驻时间">
              {selectedMerchant.createdAt
                ? dayjs(selectedMerchant.createdAt).format('YYYY-MM-DD HH:mm')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {selectedMerchant.updatedAt
                ? dayjs(selectedMerchant.updatedAt).format('YYYY-MM-DD HH:mm')
                : '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* ===== 修改状态弹窗 ===== */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: COLORS.warning }} />
            <span>修改商家状态</span>
          </Space>
        }
        open={statusOpen}
        onOk={confirmStatusChange}
        onCancel={() => { setStatusOpen(false); setSelectedMerchant(null); }}
        okText="确认修改"
        cancelText="取消"
        width={420}
      >
        <div style={{ padding: '12px 0' }}>
          <Text>
            修改商家「{selectedMerchant?.shopName || selectedMerchant?.name || '未知'}」的状态：
          </Text>
          <div style={{ marginTop: 16 }}>
            <Select
              value={newStatus}
              onChange={setNewStatus}
              style={{ width: '100%' }}
              options={[
                { label: '待审核', value: 0 },
                { label: '已通过', value: 1 },
                { label: '已驳回', value: 2 },
                { label: '已封禁', value: 3 },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MerchantList;
