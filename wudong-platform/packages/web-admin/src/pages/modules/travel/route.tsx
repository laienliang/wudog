import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button, Modal, Form, Input, InputNumber, message, Popconfirm, Tag, Card, Row, Col, Statistic, Space, Typography, Divider, Tooltip, Empty, Image, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CompassOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { travelApi } from '../../../services/travel';

const { Text } = Typography;
const COLORS = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A', price: '#E85D2F' };

const RouteTab: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [stats, setStats] = useState({ total: 0, online: 0 });

  const loadStats = useCallback(async () => {
    try { const res = await travelApi.listRoutes({ page: 1, pageSize: 100 }); const list = res?.data?.list || []; setStats({ total: list.length, online: list.filter((r: any) => r.status === 1).length }); } catch {}
  }, []);
  useEffect(() => { loadStats(); }, [loadStats]);

  const columns: ProColumns<any>[] = [
    { title: '#', width: 45, align: 'center', render: (_: any, _r: any, i: number) => <Tag style={{ borderRadius: 8, minWidth: 20, textAlign: 'center', fontSize: 11 }}>{i + 1}</Tag> },
    { title: '路线', dataIndex: 'name', width: 200, render: (_, r) => (<Space><Image src={r.coverImage} width={40} height={40} style={{ borderRadius: 6, objectFit: 'cover' }} fallback="" /><Text strong>{r.name}</Text></Space>) },
    { title: '天数', dataIndex: 'duration', width: 70, align: 'center', render: (v) => <Tag style={{ borderRadius: 4 }}>{v || '-'}</Tag> },
    { title: '价格', dataIndex: 'price', width: 80, align: 'right', render: (v) => <Text style={{ color: COLORS.price, fontWeight: 600 }}>¥{Number(v).toFixed(2)}</Text> },
    { title: '成团人数', dataIndex: 'maxPeople', width: 70, align: 'center', render: (v) => v ? `${v}人` : '-' },
    { title: '状态', dataIndex: 'status', width: 70, align: 'center', render: (v, r) => <Switch checked={v === 1} size="small" checkedChildren="上架" unCheckedChildren="下架" onChange={async (c) => { await travelApi.updateRoute(r.id, { status: c ? 1 : 0 }); message.success(c ? '已上架' : '已下架'); actionRef.current?.reload(); loadStats(); }} style={{ backgroundColor: v === 1 ? COLORS.success : undefined }} /> },
    { title: '操作', width: 100, align: 'center', render: (_, r) => (
      <Space size={0}>
        <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={() => { setEditing(r); form.setFieldsValue(r); setModalOpen(true); }} style={{ color: COLORS.warning }} /></Tooltip>
        <Divider type="vertical" />
        <Popconfirm title="确定删除？" onConfirm={async () => { await travelApi.deleteRoute(r.id); message.success('已删除'); actionRef.current?.reload(); loadStats(); }}><Tooltip title="删除"><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Tooltip></Popconfirm>
      </Space>
    )},
  ];

  return (<>
    <Row gutter={16} style={{ marginBottom: 16 }}>
      {[{ title: '路线总数', value: stats.total, icon: <CompassOutlined />, color: COLORS.primary, bg: '#E8F4FD' },
        { title: '上架中', value: stats.online, icon: <CheckCircleOutlined />, color: COLORS.success, bg: '#EDF7ED' },
      ].map(item => (
        <Col xs={12} key={item.title}>
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
        request={async () => { try { const res = await travelApi.listRoutes({ page: 1, pageSize: 100 }); return { data: res?.data?.list || [], success: true }; } catch { return { data: [], success: false }; } }}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }}>新增路线</Button>]}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无路线数据" /> }}
      />
    </Card>
    <Modal title={editing ? '编辑路线' : '新增路线'} open={modalOpen} onOk={() => form.submit()} onCancel={() => setModalOpen(false)} width={640} destroyOnClose okText={editing ? '保存' : '创建'}>
      <Form form={form} layout="vertical" onFinish={async (values) => {
        try { const p = { ...values, price: Number(values.price), maxPeople: Number(values.maxPeople || 0) }; editing ? await travelApi.updateRoute(editing.id, p) : await travelApi.createRoute(p); message.success(editing ? '已更新' : '已创建'); setModalOpen(false); actionRef.current?.reload(); loadStats(); } catch { message.error('操作失败'); }
      }}>
        <Form.Item name="name" label="路线名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="duration" label="行程天数"><Input placeholder="如：2天1晚" /></Form.Item></Col>
          <Col span={8}><Form.Item name="price" label="套餐价" rules={[{ required: true }]}><InputNumber min={0} precision={2} prefix="¥" style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={8}><Form.Item name="maxPeople" label="成团上限"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
        </Row>
        <Form.Item name="coverImage" label="封面图 URL"><Input /></Form.Item>
        <Form.Item name="itinerary" label="行程安排（JSON）" tooltip='[{"day":1,"title":"标题","spots":["景点"],"meal":"","description":""}]'>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="description" label="路线详情"><Input.TextArea rows={3} /></Form.Item>
      </Form>
    </Modal>
  </>);
};
export default RouteTab;
