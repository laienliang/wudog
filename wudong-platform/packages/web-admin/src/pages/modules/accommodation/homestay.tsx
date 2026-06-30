import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Button, Modal, Form, Input, InputNumber, message, Popconfirm, Tag, Card,
  Row, Col, Statistic, Space, Typography, Divider, Tooltip, Empty, Image, Select, Switch, Rate,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined,
  CheckCircleOutlined, CloseCircleOutlined, HomeOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { accommodationApi } from '../../../services/accommodation';

const { Text } = Typography;
const COLORS = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A' };
const FACILITY_OPTIONS = ['WiFi', '空调', '独立卫浴', '苗族特色', '观景台', '含早餐', '庭院', '停车场', '火塘', '烧烤区', '苗绣体验'];

const HomestayTab: React.FC<{ onJumpToRoom?: (id: number) => void }> = ({ onJumpToRoom }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [stats, setStats] = useState({ total: 0, open: 0, closed: 0 });

  const loadStats = useCallback(async () => {
    try {
      const res = await accommodationApi.listHomestays({ page: 1, pageSize: 100 });
      const list = res?.data?.list || [];
      setStats({ total: list.length, open: list.filter((r: any) => r.status === 1).length, closed: list.filter((r: any) => r.status === 0).length });
    } catch {}
  }, []);
  useEffect(() => { loadStats(); }, [loadStats]);

  const columns: ProColumns<any>[] = [
    { title: '#', width: 50, align: 'center', render: (_: any, _r: any, i: number) => <Tag style={{ borderRadius: 10 }}>{i + 1}</Tag> },
    {
      title: '民宿', dataIndex: 'name', width: 220,
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src={r.coverImage} width={44} height={44} style={{ borderRadius: 8, objectFit: 'cover', border: '1px solid #f0f0f0' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" />
          <div><Text strong style={{ fontSize: 14 }}>{r.name}</Text><Text type="secondary" style={{ fontSize: 11, display: 'block' }}>ID: {r.id}</Text></div>
        </div>
      ),
    },
    { title: '评分', dataIndex: 'rating', width: 100, align: 'center', render: (v) => <Rate disabled value={Number(v)} style={{ fontSize: 13 }} /> },
    {
      title: '设施', dataIndex: 'facilities', width: 240,
      render: (v) => {
        let facilities: string[] = [];
        if (Array.isArray(v)) facilities = v;
        else if (typeof v === 'string') try { facilities = JSON.parse(v); } catch { facilities = []; }
        return facilities.length ? <Space size={4}>{facilities.map((t: string) => <Tag key={t} style={{ borderRadius: 4 }}>{t}</Tag>)}</Space> : '-';
      },
    },
    { title: '电话', dataIndex: 'phone', width: 110 },
    {
      title: '状态', dataIndex: 'status', width: 80, align: 'center',
      render: (v, r) => (
        <Switch checked={v === 1} size="small" checkedChildren="营业" unCheckedChildren="关闭"
          onChange={async (c) => { await accommodationApi.updateHomestay(r.id, { status: c ? 1 : 0 }); message.success(c ? '已营业' : '已关闭'); actionRef.current?.reload(); loadStats(); }}
          style={{ backgroundColor: v === 1 ? COLORS.success : undefined }} />
      ),
    },
    {
      title: '操作', width: 180, align: 'center',
      render: (_, r) => (
        <Space size={0}>
          <Tooltip title="管理房型"><Button type="text" size="small" icon={<HomeOutlined />} onClick={() => onJumpToRoom?.(r.id)} style={{ color: COLORS.primary }} /></Tooltip>
          <Divider type="vertical" />
          <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={() => { setEditing(r); form.setFieldsValue({ ...r, facilities: r.facilities || [] }); setModalOpen(true); }} style={{ color: COLORS.warning }} /></Tooltip>
          <Divider type="vertical" />
          <Popconfirm title="确定删除？" onConfirm={async () => { await accommodationApi.deleteHomestay(r.id); message.success('已删除'); actionRef.current?.reload(); loadStats(); }}>
            <Tooltip title="删除"><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (<>
    <Row gutter={16} style={{ marginBottom: 16 }}>
      {[
        { title: '民宿总数', value: stats.total, icon: <ShopOutlined />, color: COLORS.primary, bg: '#E8F4FD' },
        { title: '营业中', value: stats.open, icon: <CheckCircleOutlined />, color: COLORS.success, bg: '#EDF7ED' },
        { title: '已关闭', value: stats.closed, icon: <CloseCircleOutlined />, color: COLORS.danger, bg: '#FFF1F0' },
      ].map(item => (
        <Col xs={8} key={item.title}>
          <Card hoverable style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -10, right: -10, width: 72, height: 72, borderRadius: '50%', background: item.bg, opacity: 0.5 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: item.color }}>{item.icon}</div>
              <div><Text type="secondary" style={{ fontSize: 13 }}>{item.title}</Text><div style={{ fontSize: 26, fontWeight: 700, color: item.color }}>{item.value}</div></div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
    <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 24px' } }}>
      <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
        request={async () => { try { const res = await accommodationApi.listHomestays({ page: 1, pageSize: 100 }); return { data: res?.data?.list || [], success: true }; } catch { return { data: [], success: false }; } }}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }} style={{ boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}>新增民宿</Button>]}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无民宿数据" /> }}
      />
    </Card>
    <Modal title={editing ? '编辑民宿' : '新增民宿'} open={modalOpen} onOk={() => form.submit()} onCancel={() => setModalOpen(false)} width={640} destroyOnClose okText={editing ? '保存' : '创建'}>
      <Form form={form} layout="vertical" onFinish={async (values) => {
        try { editing ? await accommodationApi.updateHomestay(editing.id, values) : await accommodationApi.createHomestay(values); message.success(editing ? '已更新' : '已创建'); setModalOpen(false); actionRef.current?.reload(); loadStats(); } catch { message.error('操作失败'); }
      }}>
        <Form.Item name="name" label="民宿名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Row gutter={16}><Col span={12}><Form.Item name="phone" label="联系电话"><Input /></Form.Item></Col>
        <Col span={12}><Form.Item name="rating" label="评分"><InputNumber min={0} max={5} step={0.1} precision={1} style={{ width: '100%' }} /></Form.Item></Col></Row>
        <Form.Item name="address" label="地址"><Input /></Form.Item>
        <Form.Item name="coverImage" label="封面图 URL"><Input placeholder="https://..." /></Form.Item>
        <Form.Item name="facilities" label="设施标签"><Select mode="multiple" placeholder="选择设施" options={FACILITY_OPTIONS.map(f => ({ label: f, value: f }))} /></Form.Item>
        <Form.Item name="description" label="民宿介绍"><Input.TextArea rows={3} /></Form.Item>
      </Form>
    </Modal>
  </>);
};

export default HomestayTab;
