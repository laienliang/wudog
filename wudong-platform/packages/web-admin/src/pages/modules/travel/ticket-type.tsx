import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Form, Input, InputNumber, message, Popconfirm, Tag, Card, Row, Col, Space, Typography, Divider, Tooltip, Empty, Select, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined, WarningOutlined, SearchOutlined, FireOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { travelApi } from '../../../services/travel';

const { Text } = Typography;
const C = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A', price: '#E85D2F', hot: '#FA8C16' };

// 模拟近7日销量数据
const mockSales: Record<number, number> = {
  1: 128, 2: 45, 3: 67, 4: 89, 5: 0, 6: 234, 7: 56, 8: 12, 9: 0, 10: 78, 11: 34, 12: 156, 13: 92,
};

const TicketTypeTab: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [scenicSpots, setScenicSpots] = useState<any[]>([]);
  const [filterScenicId, setFilterScenicId] = useState<number | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const scenicMapRef = useRef<Record<number, string>>({});

  useEffect(() => {
    travelApi.allScenicSpots().then((res: any) => {
      const raw = res?.data || res || [];
      const list = Array.isArray(raw) ? raw : [];
      setScenicSpots(list);
      const map: Record<number, string> = {};
      list.forEach((s: any) => { map[Number(s.id)] = s.name; });
      scenicMapRef.current = map;
      if (actionRef.current) actionRef.current.reload();
    }).catch(() => {});
  }, []);

  const fetchData = async () => {
    try {
      const res = await travelApi.listTicketTypes();
      let list = res?.data || res || [];
      if (!Array.isArray(list)) list = [];
      list = list.map((r: any) => ({ ...r, sales7d: mockSales[Number(r.id)] ?? Math.floor(Math.random() * 100) }));
      if (filterScenicId) list = list.filter((r: any) => r.scenicId === filterScenicId);
      if (searchText) list = list.filter((r: any) => (r.name || '').includes(searchText));
      if (lowStockFilter) list = list.filter((r: any) => Number(r.stock || 0) < 10);
      const enriched = list.map((r: any) => ({
        ...r, scenicName: scenicMapRef.current[Number(r.scenicId)] || '未知景区',
      }));
      return { data: enriched, success: true, total: enriched.length };
    } catch { return { data: [], success: false }; }
  };

  const columns: ProColumns<any>[] = [
    { title: '#', width: 40, align: 'center', render: (_: any, _r: any, i: number) => <Tag style={{ borderRadius: 6, minWidth: 18, textAlign: 'center', fontSize: 10, lineHeight: '16px', padding: '0 4px' }}>{i + 1}</Tag> },
    { title: '票种名称', dataIndex: 'name', width: 140, ellipsis: true, render: (v) => <Tooltip title={v}><Text strong style={{ fontSize: 13 }}>{v}</Text></Tooltip> },
    { title: '所属景区', dataIndex: 'scenicName', width: 130, render: (v) => <Tag color="blue" style={{ borderRadius: 4, fontSize: 11 }}>{v}</Tag> },
    { title: '价格', dataIndex: 'price', width: 80, align: 'right', render: (v) => <Text style={{ color: C.price, fontWeight: 700, fontSize: 14 }}>¥{Number(v).toFixed(2)}</Text> },
    { title: '库存', dataIndex: 'stock', width: 60, align: 'center', render: (v) => {
      const num = Number(v || 0);
      return num < 10 ? <Text style={{ color: C.danger, fontWeight: 700, fontSize: 14 }}>{num}</Text> : <Text>{num}</Text>;
    }},
    {
      title: '近7日销量', dataIndex: 'sales7d', width: 80, align: 'center', sorter: true,
      render: (v) => {
        const num = Number(v || 0);
        if (num === 0) return <Text type="secondary">-</Text>;
        if (num > 50) return <Space size={4}><FireOutlined style={{ color: C.hot }} /><Text style={{ color: C.hot, fontWeight: 700, fontSize: 14 }}>{num}</Text></Space>;
        return <Text style={{ fontWeight: 500 }}>{num}</Text>;
      },
    },
    { title: '有效期', dataIndex: 'validDays', width: 60, align: 'center', render: (v) => v ? `${v}天` : '-' },
    {
      title: '状态', dataIndex: 'status', width: 100, align: 'center',
      render: (v, r) => {
        const isLowStock = Number(r.stock || 0) < 10;
        return (
          <Space size={4}>
            <Switch checked={v === 1} size="small"
              checkedChildren="上架" unCheckedChildren="下架"
              onChange={async (c) => {
                await travelApi.updateTicketType(r.id, { status: c ? 1 : 0 });
                message.success(c ? '已上架' : '已下架');
                actionRef.current?.reload();
              }}
              style={{ backgroundColor: v === 1 ? C.success : undefined }} />
            {isLowStock && v === 1 && <Tag color="error" style={{ borderRadius: 4, fontSize: 10, lineHeight: '16px' }}>库存紧张</Tag>}
          </Space>
        );
      },
    },
    {
      title: '操作', width: 100, align: 'center', fixed: 'right',
      render: (_, r) => (
        <Space size={0}>
          <Tooltip title="编辑票种">
            <Button type="text" size="small" icon={<EditOutlined />}
              onClick={() => { setEditing(r); form.setFieldsValue({ ...r, scenicId: Number(r.scenicId) }); setModalOpen(true); }}
              style={{ color: C.primary }} />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm title="确定删除此票种？" description="删除后不可恢复"
            onConfirm={async () => { await travelApi.deleteTicketType(r.id); message.success('已删除'); actionRef.current?.reload(); }}
            okText="删除" cancelText="取消" okButtonProps={{ danger: true }}>
            <Tooltip title="删除票种">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const lowStockCount = 5; // demo

  return (<>
    {/* ===== 统计卡片（低库存卡片可点击筛选） ===== */}
    <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
      {[
        { title: '票种总数', value: 13, icon: <TagOutlined />, color: C.primary, bg: '#E8F4FD' },
        { title: '低库存预警', value: lowStockCount, icon: <WarningOutlined />, color: C.danger, bg: '#FFF1F0', filter: 'lowstock' },
        { title: '热销票种', value: '6', icon: <FireOutlined />, color: C.hot, bg: '#FFF7E6' },
      ].map(item => (
        <Col xs={8} key={item.title}>
          <Card hoverable onClick={() => {
            if (item.filter === 'lowstock') { setLowStockFilter(!lowStockFilter); actionRef.current?.reload(); }
          }}
            style={{
              borderRadius: 10, border: 'none', cursor: item.filter ? 'pointer' : 'default', height: '100%',
              boxShadow: lowStockFilter && item.filter === 'lowstock' ? `0 0 0 2px ${C.danger}40` : '0 1px 4px rgba(0,0,0,0.06)',
              overflow: 'hidden', position: 'relative', transition: 'all 0.2s',
            }}>
            <div style={{ position: 'absolute', top: -10, right: -10, width: 72, height: 72, borderRadius: '50%', background: item.bg, opacity: 0.5 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: item.color, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>{item.title}</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: item.color, lineHeight: 1.2 }}>{item.value}</div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>

    {/* ===== 表格 ===== */}
    <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 24px' } }}>
      <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false} request={fetchData}
        toolbar={{
          filter: (
            <Space wrap>
              <Input placeholder="搜索票种名称" allowClear style={{ width: 180 }}
                prefix={<SearchOutlined />} value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onPressEnter={() => actionRef.current?.reload()} />
              <Select placeholder="所属景区" allowClear style={{ width: 180 }}
                value={filterScenicId} onChange={(v) => { setFilterScenicId(v); actionRef.current?.reload(); }}
                options={(scenicSpots || []).map((s: any) => ({ label: s.name, value: Number(s.id) }))} />
            </Space>
          ),
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />}
            onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }}
            style={{ background: C.primary, borderColor: C.primary, boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}>
            新增票种
          </Button>,
        ]}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无票种数据" /> }}
      />
    </Card>

    {/* ===== 新增/编辑弹窗 ===== */}
    <Modal title={editing ? '编辑票种' : '新增票种'} open={modalOpen}
      onOk={() => form.submit()} onCancel={() => setModalOpen(false)}
      width={560} destroyOnClose okText={editing ? '保存修改' : '创建票种'} cancelText="取消">
      <Form form={form} layout="vertical" onFinish={async (values) => {
        try {
          const p = { ...values, price: Number(values.price), stock: Number(values.stock || 0) };
          editing ? await travelApi.updateTicketType(editing.id, p) : await travelApi.createTicketType(p);
          message.success(editing ? '已更新' : '已创建'); setModalOpen(false); actionRef.current?.reload();
        } catch { message.error('操作失败'); }
      }}>
        <Form.Item name="scenicId" label="所属景区" rules={[{ required: true, message: '请选择景区' }]}>
          <Select placeholder="请选择景区" showSearch optionFilterProp="label"
            options={(scenicSpots || []).map((s: any) => ({ label: s.name, value: Number(s.id) }))} />
        </Form.Item>
        <Form.Item name="name" label="票种名称" rules={[{ required: true, message: '请输入票种名称' }]}>
          <Input placeholder="如：成人票、儿童票、套票" maxLength={50} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="price" label="价格（¥）" rules={[{ required: true, message: '请输入价格' }]}>
              <InputNumber min={0} precision={2} prefix="¥" style={{ width: '100%' }} placeholder="0.00" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="stock" label="库存数量">
              <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="validDays" label="有效期（天）">
              <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="1" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="description" label="说明">
          <Input.TextArea rows={2} placeholder="选填，票种说明" />
        </Form.Item>
      </Form>
    </Modal>
  </>);
};
export default TicketTypeTab;
