import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Modal, Form, Input, InputNumber, message, Popconfirm, Tag, Card,
  Row, Col, Statistic, Space, Typography, Divider, Tooltip, Empty, Image, Select,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined, WarningOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { accommodationApi } from '../../../services/accommodation';

const { Text } = Typography;
const COLORS = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A', price: '#E85D2F' };

const RoomTypeTab: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [homestays, setHomestays] = useState<any[]>([]);
  const [filterHomestayId, setFilterHomestayId] = useState<number | undefined>(undefined);
  const [stats, setStats] = useState({ total: 0, lowStock: 0 });

  useEffect(() => {
    accommodationApi.allHomestays().then((res: any) => {
      const list = res?.data || res || [];
      setHomestays(list);
    }).catch(() => {});
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await accommodationApi.listRoomTypes();
      const list = res?.data || res || [];
      if (!Array.isArray(list)) return;
      setStats({ total: list.length, lowStock: list.filter((r: any) => r.quantity < 10).length });
    } catch {}
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await accommodationApi.listRoomTypes();
      let list = res?.data || res || [];
      if (!Array.isArray(list)) list = [];
      if (filterHomestayId) list = list.filter((r: any) => r.homestayId === filterHomestayId);
      const enriched = list.map((r: any) => ({
        ...r,
        homestayName: homestays.find((h: any) => String(h.id) === String(r.homestayId))?.name || '未知民宿',
      }));
      return { data: enriched, success: true, total: enriched.length };
    } catch { return { data: [], success: false }; }
  };

  const columns: ProColumns<any>[] = [
    { title: '#', width: 50, align: 'center', render: (_: any, _r: any, i: number) => <Tag style={{ borderRadius: 10 }}>{i + 1}</Tag> },
    {
      title: '房型名', dataIndex: 'name', width: 180,
      render: (_, r) => (
        <Space>
          <Image src={r.images?.[0]} width={36} height={36} style={{ borderRadius: 6, objectFit: 'cover', border: '1px solid #f0f0f0' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" />
          <Text strong>{r.name}</Text>
        </Space>
      ),
    },
    { title: '所属民宿', dataIndex: 'homestayName', width: 130, render: (v) => <Tag color="blue" style={{ borderRadius: 4 }}>{v}</Tag> },
    { title: '床型', dataIndex: 'bedType', width: 100, render: (v) => v || '-' },
    { title: '面积', dataIndex: 'area', width: 60, align: 'center' },
    { title: '人数', dataIndex: 'maxGuests', width: 60, align: 'center', render: (v) => v ? `${v}人` : '-' },
    { title: '平日价', dataIndex: 'price', width: 80, align: 'right', render: (v) => <Text style={{ color: COLORS.price, fontWeight: 600 }}>¥{Number(v).toFixed(2)}</Text> },
    { title: '周末价', dataIndex: 'weekendPrice', width: 80, align: 'right', render: (v) => v ? <Text style={{ color: COLORS.price }}>¥{Number(v).toFixed(2)}</Text> : '-' },
    {
      title: '库存', dataIndex: 'quantity', width: 80, align: 'center',
      render: (v) => {
        if (v === 0) return <Tag color="error">售罄</Tag>;
        if (v < 10) return <Text style={{ color: COLORS.danger, fontWeight: 700 }}>{v}</Text>;
        return <Text>{v}</Text>;
      },
    },
    {
      title: '操作', width: 120, align: 'center',
      render: (_, r) => (
        <Space size={0}>
          <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={() => { setEditing(r); form.setFieldsValue(r); setModalOpen(true); }} style={{ color: COLORS.warning }} /></Tooltip>
          <Divider type="vertical" />
          <Popconfirm title="确定删除？" onConfirm={async () => { await accommodationApi.deleteRoomType(r.id); message.success('已删除'); actionRef.current?.reload(); loadStats(); }}>
            <Tooltip title="删除"><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (<>
    <Row gutter={16} style={{ marginBottom: 16 }}>
      {[
        { title: '房型总数', value: stats.total, icon: <HomeOutlined />, color: COLORS.primary, bg: '#E8F4FD' },
        { title: '低库存预警', value: stats.lowStock, icon: <WarningOutlined />, color: COLORS.danger, bg: '#FFF1F0' },
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
        request={fetchRoomTypes}
        toolbar={{
          filter: (
            <Space>
              <span style={{ fontSize: 13, color: '#666' }}>所属民宿：</span>
              <Select placeholder="全部民宿" allowClear style={{ width: 200 }}
                value={filterHomestayId} onChange={(v) => { setFilterHomestayId(v); actionRef.current?.reload(); }}
                options={(homestays || []).map((h: any) => ({ label: h.name, value: h.id }))} />
            </Space>
          ),
        }}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />}
          onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }}
          style={{ boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}>新增房型</Button>]}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无房型数据" /> }}
      />
    </Card>
    <Modal title={editing ? '编辑房型' : '新增房型'} open={modalOpen} onOk={() => form.submit()} onCancel={() => setModalOpen(false)} width={640} destroyOnClose okText={editing ? '保存' : '创建'}>
      <Form form={form} layout="vertical" onFinish={async (values) => {
        try {
          const payload = { ...values, price: Number(values.price), weekendPrice: Number(values.weekendPrice || 0), quantity: Number(values.quantity || 0), maxGuests: Number(values.maxGuests || 1), homestayId: Number(values.homestayId) };
          editing ? await accommodationApi.updateRoomType(editing.id, payload) : await accommodationApi.createRoomType(payload);
          message.success(editing ? '已更新' : '已创建'); setModalOpen(false); actionRef.current?.reload(); loadStats();
        } catch { message.error('操作失败'); }
      }}>
        <Form.Item name="homestayId" label="所属民宿" rules={[{ required: true, message: '请选择民宿' }]}>
          <Select placeholder="请选择民宿" showSearch optionFilterProp="label"
            options={(homestays || []).map((h: any) => ({ label: h.name, value: h.id }))} />
        </Form.Item>
        <Form.Item name="name" label="房型名称" rules={[{ required: true }]}><Input placeholder="如：苗族木屋大床房" /></Form.Item>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="bedType" label="床型"><Input placeholder="如：1.8m大床" /></Form.Item></Col>
          <Col span={8}><Form.Item name="area" label="面积"><Input placeholder="如：30㎡" /></Form.Item></Col>
          <Col span={8}><Form.Item name="maxGuests" label="可住人数"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="price" label="平日价(¥)" rules={[{ required: true }]}><InputNumber min={0} precision={2} prefix="¥" style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={8}><Form.Item name="weekendPrice" label="周末价(¥)"><InputNumber min={0} precision={2} prefix="¥" style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={8}><Form.Item name="quantity" label="房间数量"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  </>);
};

export default RoomTypeTab;
