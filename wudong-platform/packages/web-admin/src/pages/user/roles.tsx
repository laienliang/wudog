import React, { useState, useRef } from 'react';
import {
  Button, Modal, Form, Input, message, Tag, Space, Card, Typography,
  Tooltip, Empty, Checkbox, Popconfirm,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SafetyOutlined,
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
   权限定义
   ============================================================ */
const ALL_PERMISSIONS = [
  { key: 'user:list', label: '用户列表', desc: '查看用户列表' },
  { key: 'user:edit', label: '用户编辑', desc: '编辑用户信息/状态' },
  { key: 'merchant:list', label: '商家列表', desc: '查看商家列表' },
  { key: 'merchant:review', label: '商家审核', desc: '审核商家入驻申请' },
  { key: 'order:list', label: '订单列表', desc: '查看订单列表' },
  { key: 'order:edit', label: '订单编辑', desc: '编辑订单状态' },
  { key: 'banner:crud', label: '轮播管理', desc: '轮播图增删改' },
  { key: 'announcement:crud', label: '公告管理', desc: '公告增删改' },
  { key: 'config:edit', label: '系统配置', desc: '修改系统配置' },
];

/* ============================================================
   权限标签颜色映射
   ============================================================ */
const PERMISSION_COLORS: Record<string, string> = {
  'user:list': 'blue',
  'user:edit': 'blue',
  'merchant:list': 'cyan',
  'merchant:review': 'cyan',
  'order:list': 'purple',
  'order:edit': 'purple',
  'banner:crud': 'orange',
  'announcement:crud': 'orange',
  'config:edit': 'red',
};

/* ============================================================
   角色管理页面
   ============================================================ */
const RoleList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  // 自定义请求
  const fetchRoles = async (params: any) => {
    const { current, pageSize, ...rest } = params;
    try {
      const res = await adminApi.listRoles();
      // listRoles 可能不分页，根据响应格式处理
      const data = res.data || res;
      const list = Array.isArray(data) ? data : (data.list || []);
      return { data: list, success: true, total: list.length };
    } catch {
      return { data: [], success: false, total: 0 };
    }
  };

  // 打开新增/编辑弹窗
  const handleOpenModal = (record?: any) => {
    setEditingRole(record || null);
    if (record) {
      const perms = Array.isArray(record.permissions) ? record.permissions :
        (typeof record.permissions === 'string' ? (() => { try { return JSON.parse(record.permissions); } catch { return []; } })() : []);
      form.setFieldsValue({ name: record.name, permissions: perms });
    } else {
      form.resetFields();
    }
    setModalOpen(true);
  };

  // 提交角色
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        await adminApi.updateRole(editingRole.id, values);
        message.success('角色更新成功');
      } else {
        await adminApi.createRole(values);
        message.success('角色创建成功');
      }
      setModalOpen(false);
      actionRef.current?.reload();
    } catch (err: any) {
      if (err.errorFields) return;
      message.error('操作失败');
    }
  };

  // 删除角色
  const handleDelete = async (id: number) => {
    try {
      await adminApi.deleteRole(id);
      message.success('角色已删除');
      actionRef.current?.reload();
    } catch {
      message.error('删除失败');
    }
  };

  // 表格列配置
  const columns: ProColumns<any>[] = [
    {
      title: '排序',
      width: 60,
      align: 'center',
      render: (_: any, _r: any, index: number) => (
        <Tag style={{ borderRadius: 8, minWidth: 20, textAlign: 'center' }}>{index + 1}</Tag>
      ),
    },
    {
      title: '角色名',
      dataIndex: 'name',
      width: 180,
      render: (_, r) => (
        <Space>
          <SafetyOutlined style={{ color: COLORS.primary, fontSize: 16 }} />
          <Text strong>{r.name}</Text>
        </Space>
      ),
    },
    {
      title: '权限列表',
      dataIndex: 'permissions',
      width: 400,
      render: (permissions: any) => {
        let list: string[] = [];
        if (Array.isArray(permissions)) list = permissions;
        else if (typeof permissions === 'string') try { list = JSON.parse(permissions); } catch { list = []; }
        return list.length > 0 ? (
          <Space size={4} wrap>
            {list.map((perm: string) => {
              const permDef = ALL_PERMISSIONS.find(p => p.key === perm);
              return (
                <Tag key={perm} color={PERMISSION_COLORS[perm] || 'default'} style={{ borderRadius: 4, marginBottom: 2 }}>
                  {permDef?.label || perm}
                </Tag>
              );
            })}
          </Space>
        ) : <Text type="secondary">-</Text>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 130,
      align: 'center',
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
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="编辑角色">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
              style={{ color: COLORS.primary }}
            />
          </Tooltip>
          <Popconfirm
            title="确定删除该角色吗？"
            description="删除后不可恢复"
            onConfirm={() => handleDelete(record.id)}
            okText="确定删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="删除角色">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
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
          request={fetchRoles}
          search={false}
          // ---- 工具栏 ----
          toolBarRender={() => [
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
              style={{
                background: COLORS.primary,
                borderColor: COLORS.primary,
                boxShadow: '0 2px 6px rgba(31,95,168,0.25)',
              }}
            >
              新增角色
            </Button>,
          ]}
          // ---- 分页 ----
          pagination={{
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50'],
            showSizeChanger: true,
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
                description={<span>暂无角色数据<br /><Text type="secondary" style={{ fontSize: 12 }}>点击「新增角色」开始添加</Text></span>}
              />
            ),
          }}
          sticky={{ offsetHeader: 0 }}
        />
      </Card>

      {/* ===== 新增/编辑角色弹窗 ===== */}
      <Modal
        title={
          <Space>
            {editingRole ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingRole ? '编辑角色' : '新增角色'}</span>
          </Space>
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={520}
        okText={editingRole ? '保存修改' : '创建角色'}
        cancelText="取消"
        destroyOnClose
        style={{ top: 40 }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 8 }}
          initialValues={{ permissions: [] }}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[
              { required: true, message: '请输入角色名称' },
              { max: 20, message: '角色名称不超过20个字符' },
            ]}
          >
            <Input placeholder="请输入角色名称，如：运营编辑" maxLength={20} showCount />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="权限配置"
            rules={[{ required: true, type: 'array', min: 1, message: '请至少选择一个权限' }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Card
                size="small"
                style={{
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                  background: '#fafafa',
                }}
              >
                {ALL_PERMISSIONS.map((perm) => (
                  <div
                    key={perm.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px 0',
                      borderBottom: '1px solid #f5f5f5',
                    }}
                  >
                    <Checkbox value={perm.key} style={{ width: 120 }}>
                      <Text strong style={{ fontSize: 13 }}>{perm.label}</Text>
                    </Checkbox>
                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                      {perm.desc}
                    </Text>
                    <Tag
                      color={PERMISSION_COLORS[perm.key] || 'default'}
                      style={{ borderRadius: 4, marginLeft: 'auto', fontSize: 11 }}
                    >
                      {perm.key}
                    </Tag>
                  </div>
                ))}
              </Card>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleList;
