import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button, Modal, Form, Input, InputNumber, message, Popconfirm, Tag, Card, Row, Col, Statistic, Space, Typography, Divider, Tooltip, Empty, Image, Select, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined, CheckCircleOutlined, CloseCircleOutlined, TagOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { travelApi } from '../../../services/travel';

const { Text } = Typography;
const COLORS = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A' };

const ScenicSpotTab: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [stats, setStats] = useState({ total: 0, open: 0, closed: 0 });

  const loadStats = useCallback(async () => {
    try { const res = await travelApi.listScenicSpots({ page: 1, pageSize: 100 }); const list = res?.data?.list || []; setStats({ total: list.length, open: list.filter((r: any) => r.status === 1).length, closed: list.filter((r: any) => r.status === 0).length }); } catch {}
  }, []);
  useEffect(() => { loadStats(); }, [loadStats]);

  const columns: ProColumns<any>[] = [
    { title: '#', width: 45, align: 'center', render: (_: any, _r: any, i: number) => <Tag style={{ borderRadius: 8, minWidth: 20, textAlign: 'center', fontSize: 11 }}>{i + 1}</Tag> },
    { title: '景区', dataIndex: 'name', width: 200, render: (_, r) => (
      <Space><Image src={r.coverImage} width={40} height={40} style={{ borderRadius: 6, objectFit: 'cover' }} fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" /><Text strong>{r.name}</Text></Space>
    )},
    { title: '评分', dataIndex: 'rating', width: 70, align: 'center', render: (v) => <Tag color="#FAAD14" style={{ borderRadius: 4 }}>{v}★</Tag> },
    { title: '地址', dataIndex: 'address', width: 160, ellipsis: true },
    { title: '营业时间', dataIndex: 'openingHours', width: 100 },
    { title: '状态', dataIndex: 'status', width: 70, align: 'center', render: (v, r) => <Switch checked={v === 1} size="small" checkedChildren="开放" unCheckedChildren="关闭" onChange={async (c) => { await travelApi.updateScenicSpot(r.id, { status: c ? 1 : 0 }); message.success(c ? '已开放' : '已关闭'); actionRef.current?.reload(); loadStats(); }} style={{ backgroundColor: v === 1 ? COLORS.success : undefined }} /> },
    { title: '操作', width: 120, align: 'center', render: (_, r) => (
      <Space size={0}>
        <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={() => { setEditing(r); form.setFieldsValue(r); setModalOpen(true); }} style={{ color: COLORS.warning }} /></Tooltip>
        <Divider type="vertical" />
        <Popconfirm title="确定删除？" onConfirm={async () => { await travelApi.deleteScenicSpot(r.id); message.success('已删除'); actionRef.current?.reload(); loadStats(); }}><Tooltip title="删除"><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Tooltip></Popconfirm>
      </Space>
    )},
  ];

  return (<>
    <Row gutter={16} style={{ marginBottom: 16 }}>
      {[
        { title: '景区总数', value: stats.total, icon: <ShopOutlined />, color: COLORS.primary, bg: '#E8F4FD' },
        { title: '开放中', value: stats.open, icon: <CheckCircleOutlined />, color: COLORS.success, bg: '#EDF7ED' },
        { title: '已关闭', value: stats.closed, icon: <CloseCircleOutlined />, color: COLORS.danger, bg: '#FFF1F0' },
      ].map(item => (
        <Col xs={8} key={item.title}>
          <Card hoverable style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -10, right: -10, width: 72, height: 72, borderRadius: '50%', background: item.bg, opacity: 0.5 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: item.color }}>{item.icon}</div>
              <div><Text type="secondary" style={{ fontSize: 13 }}>{item.title}</Text><div style={{ fontSize: 26, fontWeight: 700, color: item.color, lineHeight: 1.3 }}>{item.value}</div></div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
    <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 24px' } }}>
      <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
        request={async () => { try { const res = await travelApi.listScenicSpots({ page: 1, pageSize: 100 }); return { data: res?.data?.list || [], success: true }; } catch { return { data: [], success: false }; } }}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }} style={{ boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}>新增景区</Button>]}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无景区数据" /> }}
      />
    </Card>
    <Modal title={editing ? '编辑景区' : '新增景区'} open={modalOpen} onOk={() => form.submit()} onCancel={() => setModalOpen(false)} width={560} destroyOnClose okText={editing ? '保存' : '创建'}>
      <Form form={form} layout="vertical" onFinish={async (values) => {
        try { editing ? await travelApi.updateScenicSpot(editing.id, values) : await travelApi.createScenicSpot(values); message.success(editing ? '已更新' : '已创建'); setModalOpen(false); actionRef.current?.reload(); loadStats(); } catch { message.error('操作失败'); }
      }}>
        <Form.Item name="name" label="景区名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Row gutter={16}><Col span={12}><Form.Item name="rating" label="评分"><InputNumber min={0} max={5} step={0.1} precision={1} style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={12}><Form.Item name="openingHours" label="营业时间"><Input placeholder="如：08:00-18:00" /></Form.Item></Col></Row>
        <Form.Item name="address" label="地址"><Input /></Form.Item>
        <Form.Item name="coverImage" label="封面图 URL"><Input placeholder="https://..." /></Form.Item>
        <Form.Item name="description" label="景区介绍"><Input.TextArea rows={3} /></Form.Item>
      </Form>
    </Modal>
  </>);
};
export default ScenicSpotTab;
