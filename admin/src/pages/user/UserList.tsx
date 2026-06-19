/**
 * 用户列表页面
 * 展示平台注册用户列表，支持搜索、状态筛选、查看详情、编辑、封禁/解封、删除操作
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Select, message, Popconfirm, Tag, Image } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import { maskPhone } from '../../utils/format';

/**
 * 用户列表页面组件
 * 提供用户的查看、编辑、封禁/解封、删除等功能
 */
export default function UserListPage() {
  /** 用户列表数据 */
  const [data, setData] = useState<any[]>([]);
  /** 数据总条数 */
  const [total, setTotal] = useState(0);
  /** 当前页码 */
  const [page, setPage] = useState(1);
  /** 每页条数 */
  const [pageSize, setPageSize] = useState(20);
  /** 搜索关键词 */
  const [keyword, setKeyword] = useState('');
  /** 状态筛选条件 */
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  /** 数据加载状态 */
  const [loading, setLoading] = useState(false);
  /** 编辑弹窗显示状态 */
  const [modalOpen, setModalOpen] = useState(false);
  /** 详情弹窗显示状态 */
  const [detailOpen, setDetailOpen] = useState(false);
  /** 当前编辑的用户记录 */
  const [editing, setEditing] = useState<any>(null);
  /** 当前查看的用户详情记录 */
  const [detailRecord, setDetailRecord] = useState<any>(null);
  /** 表单实例 */
  const [form] = Form.useForm();

  /** 加载用户列表数据 */
  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/users/list', {
        params: { page, pageSize, keyword, status: statusFilter },
      });
      if (res.code === 200) {
        setData(res.data.list);
        setTotal(res.data.total);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [page, pageSize, statusFilter]);

  /** 搜索操作，重置页码后加载数据 */
  const onSearch = () => { setPage(1); loadData(); };

  /**
   * 打开用户详情弹窗
   * @param record - 用户记录
   */
  const openDetail = (record: any) => {
    setDetailRecord(record);
    setDetailOpen(true);
  };

  /**
   * 打开编辑弹窗
   * @param record - 要编辑的用户记录
   */
  const openModal = (record: any) => {
    setEditing(record);
    form.setFieldsValue({
      nickname: record.nickname,
      phone: record.phone,
      gender: record.gender,
      region: record.region,
      bio: record.bio,
    });
    setModalOpen(true);
  };

  /** 提交编辑表单，更新用户信息 */
  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      const res: any = await request.put(`/users/update/${editing.id}`, values);
      if (res.code === 200) {
        message.success('更新成功');
        setModalOpen(false);
        loadData();
      } else {
        message.error(res.message);
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || '操作失败');
    }
  };

  /**
   * 封禁/解封用户
   * @param record - 用户记录，根据当前状态切换
   */
  const handleBan = async (record: any) => {
    const url = record.status === 1 ? `/users/ban/${record.id}` : `/users/unban/${record.id}`;
    const res: any = await request.post(url);
    if (res.code === 200) {
      message.success(record.status === 1 ? '已封禁' : '已解封');
      loadData();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 删除用户
   * @param id - 用户 ID
   */
  const handleDelete = async (id: number) => {
    const res: any = await request.delete(`/users/delete/${id}`);
    if (res.code === 200) {
      message.success('删除成功');
      loadData();
    }
  };

  /** 性别标签映射 */
  const genderLabel: Record<number, { text: string; color: string }> = {
    0: { text: '未知', color: 'default' },
    1: { text: '男', color: 'blue' },
    2: { text: '女', color: 'magenta' },
  };

  /** 表格列配置 */
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username' },
    { title: '昵称', dataIndex: 'nickname' },
    { title: '手机号', dataIndex: 'phone', render: (v: string) => maskPhone(v) },
    {
      title: '头像', dataIndex: 'avatar', width: 80,
      render: (v: string) => v ? <Image src={v} width={40} height={40} style={{ borderRadius: '50%' }} /> : '-',
    },
    {
      title: '性别', dataIndex: 'gender',
      render: (v: number) => {
        const g = genderLabel[v] || genderLabel[0];
        return <Tag color={g.color}>{g.text}</Tag>;
      },
    },
    { title: '地区', dataIndex: 'region' },
    {
      title: '状态', dataIndex: 'status',
      render: (v: number) => v === 1
        ? <Tag color="green">正常</Tag>
        : <Tag color="red">封禁</Tag>,
    },
    { title: '最后登录', dataIndex: 'last_login_at' },
    {
      title: '操作', width: 280, render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => openDetail(record)}>查看</Button>
          <Button
            type="link"
            icon={record.status === 1 ? <StopOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleBan(record)}
          >
            {record.status === 1 ? '封禁' : '解封'}
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => openModal(record)}>编辑</Button>
          <Popconfirm title="确认删除该用户？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>用户管理</h2>
      {/* 搜索和筛选区域 */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索用户名/昵称/手机号"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onPressEnter={onSearch}
          prefix={<SearchOutlined />}
          style={{ width: 260 }}
        />
        <Select
          placeholder="状态筛选"
          allowClear
          value={statusFilter}
          onChange={v => { setStatusFilter(v); setPage(1); }}
          style={{ width: 120 }}
          options={[
            { label: '正常', value: 1 },
            { label: '封禁', value: 0 },
          ]}
        />
        <Button type="primary" onClick={onSearch}>搜索</Button>
      </Space>
      {/* 用户列表表格 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: page, pageSize, total, showSizeChanger: true,
          showTotal: t => `共 ${t} 条`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); },
        }}
      />
      {/* 编辑用户弹窗 */}
      <Modal title="编辑用户信息" open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="nickname" label="昵称"><Input /></Form.Item>
          <Form.Item name="phone" label="手机号"><Input /></Form.Item>
          <Form.Item name="gender" label="性别">
            <Select options={[
              { label: '未知', value: 0 },
              { label: '男', value: 1 },
              { label: '女', value: 2 },
            ]} />
          </Form.Item>
          <Form.Item name="region" label="地区"><Input /></Form.Item>
          <Form.Item name="bio" label="简介"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
      {/* 用户详情弹窗 */}
      <Modal title="用户详情" open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} destroyOnClose>
        {detailRecord && (
          <div style={{ lineHeight: 2.2 }}>
            <p><strong>ID：</strong>{detailRecord.id}</p>
            <p><strong>用户名：</strong>{detailRecord.username}</p>
            <p><strong>昵称：</strong>{detailRecord.nickname || '-'}</p>
            <p><strong>手机号：</strong>{detailRecord.phone || '-'}</p>
            <p><strong>头像：</strong>{detailRecord.avatar ? <Image src={detailRecord.avatar} width={80} /> : '-'}</p>
            <p><strong>性别：</strong>{(genderLabel[detailRecord.gender] || genderLabel[0]).text}</p>
            <p><strong>地区：</strong>{detailRecord.region || '-'}</p>
            <p><strong>简介：</strong>{detailRecord.bio || '-'}</p>
            <p><strong>状态：</strong>{detailRecord.status === 1 ? <Tag color="green">正常</Tag> : <Tag color="red">封禁</Tag>}</p>
            <p><strong>最后登录：</strong>{detailRecord.last_login_at || '-'}</p>
            <p><strong>注册时间：</strong>{detailRecord.created_at || '-'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
