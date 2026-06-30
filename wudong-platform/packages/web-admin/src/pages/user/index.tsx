import React, { useState, useRef } from 'react';
import {
  Button, Modal, Form, Input, message, Tag, Space, Card, Typography, Tooltip, Empty, Descriptions,
} from 'antd';
import {
  ReloadOutlined, LockOutlined, UnlockOutlined, UserOutlined, EyeOutlined, EditOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import dayjs from 'dayjs';
import { adminApi } from '../../services/admin';

const { Text } = Typography;

const COLORS = {
  primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838',
  danger: '#D94A4A', textSecondary: '#8C8C8C',
};

const UserList: React.FC = () => {
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [banAction, setBanAction] = useState<'ban' | 'unban'>('ban');
  const actionRef = useRef<ActionType>();

  // 自定义请求
  const fetchUsers = async (params: any) => {
    const { current, pageSize, keyword, ...rest } = params;
    try {
      const res = await adminApi.listUsers({
        page: current,
        pageSize,
        keyword: keyword || undefined,
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

  // 封禁/解封确认
  const handleToggleStatus = (record: any) => {
    const isBanned = record.status === 0;
    setSelectedUser(record);
    setBanAction(isBanned ? 'unban' : 'ban');
    setBanModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedUser) return;
    const newStatus = banAction === 'ban' ? 0 : 1;
    try {
      await adminApi.toggleUserStatus(selectedUser.id, newStatus);
      message.success(banAction === 'ban' ? '已封禁该用户' : '已解封该用户');
      setBanModalOpen(false);
      setSelectedUser(null);
      actionRef.current?.reload();
    } catch {
      message.error('操作失败');
    }
  };

  // 表格列配置
  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 70,
      align: 'center',
      render: (v) => <Text code style={{ fontSize: 12 }}>{v}</Text>,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: 160,
      ellipsis: true,
      render: (_, r) => (
        <Space>
          <UserOutlined style={{ color: COLORS.primary, fontSize: 16 }} />
          <Text strong>{r.nickname || '未知用户'}</Text>
        </Space>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 140,
      render: (v) => v ? (
        <Text>{v.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text>
      ) : <Text type="secondary">-</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        1: { text: '正常', status: 'Success' },
        0: { text: '封禁', status: 'Error' },
      },
      render: (v) => v === 1 ? (
        <Tag color="success" style={{ borderRadius: 4 }}>正常</Tag>
      ) : (
        <Tag color="error" style={{ borderRadius: 4 }}>封禁</Tag>
      ),
    },
    {
      title: '注册时间',
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
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />}
              onClick={() => { setSelectedUser(record); setDetailModalOpen(true); }}
              style={{ color: COLORS.primary }} />
          </Tooltip>
          <Tooltip title="编辑资料">
            <Button type="text" size="small" icon={<EditOutlined />}
              onClick={() => { setSelectedUser(record); setEditModalOpen(true); }}
              style={{ color: COLORS.warning }} />
          </Tooltip>
          <Tooltip title={record.status === 0 ? '解封用户' : '封禁用户'}>
            <Button type="text" size="small"
              icon={record.status === 0 ? <UnlockOutlined /> : <LockOutlined />}
              onClick={() => handleToggleStatus(record)}
              style={{ color: record.status === 0 ? COLORS.success : COLORS.danger }} />
          </Tooltip>
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
          request={fetchUsers}
          // ---- 搜索栏 ----
          search={{
            labelWidth: 'auto',
            defaultCollapsed: false,
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
          // ---- 样式 ----
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
                description={<span>暂无用户数据</span>}
              />
            ),
          }}
          sticky={{ offsetHeader: 0 }}
        />
      </Card>

      {/* ===== 封禁/解封确认弹窗 ===== */}
      <Modal
        title={
          <Space>
            {banAction === 'ban' ? <LockOutlined style={{ color: COLORS.danger }} /> : <UnlockOutlined style={{ color: COLORS.success }} />}
            <span>{banAction === 'ban' ? '封禁用户' : '解封用户'}</span>
          </Space>
        }
        open={banModalOpen}
        onOk={confirmToggleStatus}
        onCancel={() => { setBanModalOpen(false); setSelectedUser(null); }}
        okText={banAction === 'ban' ? '确认封禁' : '确认解封'}
        cancelText="取消"
        okButtonProps={{ danger: banAction === 'ban' }}
        width={420}
      >
        <div style={{ padding: '16px 0' }}>
          <Text>
            {banAction === 'ban'
              ? `确定要封禁用户「${selectedUser?.nickname || '未知'}」(ID: ${selectedUser?.id}) 吗？封禁后该用户将无法正常使用平台功能。`
              : `确定要解封用户「${selectedUser?.nickname || '未知'}」(ID: ${selectedUser?.id}) 吗？解封后用户可正常使用平台功能。`
            }
          </Text>
        </div>
      </Modal>

      {/* ===== 查看详情弹窗 ===== */}
      <Modal title="用户详情" open={detailModalOpen} onCancel={() => setDetailModalOpen(false)} footer={null} width={480}>
        {selectedUser && (
          <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="用户 ID">{selectedUser.id}</Descriptions.Item>
            <Descriptions.Item label="昵称">{selectedUser.nickname || '-'}</Descriptions.Item>
            <Descriptions.Item label="手机号">{selectedUser.phone ? selectedUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">{selectedUser.status === 1 ? <Tag color="success">正常</Tag> : <Tag color="error">封禁</Tag>}</Descriptions.Item>
            <Descriptions.Item label="注册时间">{selectedUser.createdAt ? dayjs(selectedUser.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* ===== 编辑资料弹窗 ===== */}
      <Modal title="编辑用户资料" open={editModalOpen} onOk={async () => {
        try { await adminApi.updateUser(selectedUser.id, { nickname: selectedUser.nickname, phone: selectedUser.phone }); message.success('已更新'); setEditModalOpen(false); actionRef.current?.reload(); }
        catch { message.error('更新失败'); }
      }} onCancel={() => setEditModalOpen(false)} okText="保存" width={400}>
        {selectedUser && (
          <Form layout="vertical" style={{ marginTop: 16 }} initialValues={{ nickname: selectedUser.nickname, phone: selectedUser.phone }}>
            <Form.Item label="昵称" name="nickname"><Input onChange={e => selectedUser.nickname = e.target.value} /></Form.Item>
            <Form.Item label="手机号" name="phone"><Input onChange={e => selectedUser.phone = e.target.value} /></Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default UserList;
