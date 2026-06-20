/**
 * 角色管理页面
 * 展示系统角色列表，支持搜索、新增、编辑、删除角色操作
 * 支持 RBAC 菜单权限分配（R11-06）
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Select, message, Popconfirm, Tag, Tree } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import request from '../../utils/request';

/** 系统菜单树数据（与 MainLayout 菜单项一致） */
const MENU_TREE_DATA = [
  { title: '数据看板', key: '/dashboard' },
  { title: '管理员管理', key: 'admin-mgmt', children: [
    { title: '管理员列表', key: '/admin/list' },
    { title: '角色管理', key: '/role/list' },
  ]},
  { title: '用户管理', key: 'user-mgmt', children: [
    { title: '用户列表', key: '/user/list' },
  ]},
  { title: '商家管理', key: 'merchant-mgmt', children: [
    { title: '商家列表', key: '/merchant/list' },
    { title: '入驻审核', key: '/merchant/application' },
  ]},
  { title: '内容管理', key: 'content-mgmt', children: [
    { title: '公告管理', key: '/content/announcement' },
    { title: '轮播图管理', key: '/content/carousel' },
    { title: '活动横幅', key: '/content/banner' },
    { title: '推荐位管理', key: '/content/recommendation' },
  ]},
  { title: '订单管理', key: 'order-mgmt', children: [
    { title: '全局订单', key: '/order/list' },
    { title: '退款审批', key: '/order/refund' },
    { title: '异常订单', key: '/order/abnormal' },
  ]},
  { title: '消息中心', key: 'message-mgmt', children: [
    { title: '系统消息', key: '/message/list' },
    { title: '消息模板', key: '/message/template' },
  ]},
  { title: '财务结算', key: 'finance-mgmt', children: [
    { title: '结算列表', key: '/finance/list' },
    { title: '财务报表', key: '/finance/report' },
    { title: '对账管理', key: '/finance/reconciliation' },
  ]},
  { title: '系统设置', key: 'system-mgmt', children: [
    { title: '系统配置', key: '/system/config' },
    { title: '敏感词库', key: '/system/sensitive' },
    { title: '操作日志', key: '/system/log' },
  ]},
];

/** 收集所有叶子节点的 key */
function getAllLeafKeys(nodes: any[]): string[] {
  const keys: string[] = [];
  const walk = (items: any[]) => {
    items.forEach(item => {
      if (item.children) walk(item.children);
      else keys.push(item.key);
    });
  };
  walk(nodes);
  return keys;
}

/**
 * 角色管理页面组件
 * 提供角色的增删改查功能，支持 RBAC 菜单权限分配
 */
export default function RoleListPage() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  /** 权限分配弹窗 */
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [permRole, setPermRole] = useState<any>(null);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [permSaving, setPermSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/roles/list', { params: { page, pageSize, keyword } });
      if (res.code === 200) { setData(res.data.list); setTotal(res.data.total); }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [page, pageSize]);

  const onSearch = () => { setPage(1); loadData(); };

  const openModal = (record?: any) => {
    setEditing(record || null);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        const res: any = await request.put(`/roles/update/${editing.id}`, values);
        if (res.code === 200) { message.success('更新成功'); setModalOpen(false); loadData(); }
        else message.error(res.message);
      } else {
        const res: any = await request.post('/roles/create', values);
        if (res.code === 200) { message.success('创建成功'); setModalOpen(false); loadData(); }
        else message.error(res.message);
      }
    } catch (err: any) { message.error(err?.response?.data?.message || '操作失败'); }
  };

  const handleDelete = async (id: number) => {
    const res: any = await request.delete(`/roles/delete/${id}`);
    if (res.code === 200) { message.success('删除成功'); loadData(); }
  };

  /** 打开权限分配弹窗 */
  const openPermModal = (record: any) => {
    setPermRole(record);
    try {
      const perms = typeof record.permissions === 'string'
        ? JSON.parse(record.permissions || '[]')
        : (record.permissions || []);
      setCheckedKeys(perms);
    } catch { setCheckedKeys([]); }
    setPermModalOpen(true);
  };

  /** 保存权限分配 */
  const handleSavePerm = async () => {
    setPermSaving(true);
    try {
      const res: any = await request.put(`/roles/update/${permRole.id}`, {
        permissions: JSON.stringify(checkedKeys),
      });
      if (res.code === 200) { message.success('权限分配成功'); setPermModalOpen(false); loadData(); }
      else message.error(res.message);
    } catch { message.error('操作失败'); } finally { setPermSaving(false); }
  };

  /** 解析已有权限数量用于展示 */
  const getPermCount = (record: any) => {
    try {
      const perms = typeof record.permissions === 'string'
        ? JSON.parse(record.permissions || '[]')
        : (record.permissions || []);
      return Array.isArray(perms) ? perms.length : 0;
    } catch { return 0; }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '角色名称', dataIndex: 'name' },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    { title: '已分配权限', render: (_: any, record: any) => {
      const count = getPermCount(record);
      return count > 0 ? <Tag color="blue">{count} 项</Tag> : <Tag>未分配</Tag>;
    }},
    { title: '状态', dataIndex: 'status', render: (v: number) => v === 1 ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag> },
    {
      title: '操作', render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<SettingOutlined />} onClick={() => openPermModal(record)}>分配权限</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => openModal(record)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>角色管理</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="搜索角色名称" value={keyword} onChange={e => setKeyword(e.target.value)} onPressEnter={onSearch} prefix={<SearchOutlined />} style={{ width: 240 }} />
        <Button type="primary" onClick={onSearch}>搜索</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>新增角色</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }} />

      {/* 角色编辑弹窗 */}
      <Modal title={editing ? '编辑角色' : '新增角色'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="角色描述"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限分配弹窗 */}
      <Modal
        title={`分配菜单权限 — ${permRole?.name || ''}`}
        open={permModalOpen}
        onOk={handleSavePerm}
        onCancel={() => setPermModalOpen(false)}
        confirmLoading={permSaving}
        width={480}
      >
        <p style={{ color: '#8C8C8C', marginBottom: 12 }}>勾选该角色可访问的功能菜单</p>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={(keys: any) => setCheckedKeys(keys as string[])}
          treeData={MENU_TREE_DATA}
          style={{ maxHeight: 400, overflowY: 'auto' }}
        />
      </Modal>
    </div>
  );
}
