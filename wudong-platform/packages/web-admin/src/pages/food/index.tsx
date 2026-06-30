import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Modal, Form, Input, InputNumber, message, Popconfirm, Tag,
  Card, Row, Col, Statistic, Space, Typography, Divider, Tooltip, Empty,
  Image, Select, Switch, Tabs, Rate,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  ShopOutlined, CoffeeOutlined, MenuOutlined, StarFilled,
  CheckCircleOutlined, CloseCircleOutlined, WarningOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { foodApi } from '../../services/api';

const { Text } = Typography;
const COLORS = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A' };

/* ============================================================
   餐厅管理 Tab
   ============================================================ */
const RestaurantTab: React.FC<{ onJumpToDish: (id: number) => void }> = ({ onJumpToDish }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [stats, setStats] = useState({ total: 0, open: 0, closed: 0 });

  const loadStats = useCallback(async () => {
    try {
      const res = await foodApi.listRestaurants({ page: 1, pageSize: 100 });
      const list = res?.data?.list || [];
      setStats({ total: list.length, open: list.filter((r: any) => r.status === 1).length, closed: list.filter((r: any) => r.status === 0).length });
    } catch {}
  }, []);
  useEffect(() => { loadStats(); }, [loadStats]);

  const columns: ProColumns<any>[] = [
    { title: '排序', width: 60, align: 'center', render: (_: any, _r: any, index: number) => <Tag style={{ borderRadius: 10 }}>{index + 1}</Tag> },
    { title: '餐厅名称', dataIndex: 'name', width: 220,
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {r.coverImage ? (
            <Image src={r.coverImage} width={44} height={44} style={{ borderRadius: 8, objectFit: 'cover', border: '1px solid #f0f0f0' }}
              fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' fill='%23f5f5f5'%3E%3Ctext x='8' y='30' font-size='24'%3E🏪%3C/text%3E%3C/svg%3E" />
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏪</div>
          )}
          <div><Text strong style={{ fontSize: 14 }}>{r.name}</Text><Text type="secondary" style={{ fontSize: 11, display: 'block' }}>ID: {r.id}</Text></div>
        </div>
      ),
    },
    { title: '评分', dataIndex: 'rating', width: 90, align: 'center', render: (v) => <Rate disabled value={Number(v)} style={{ fontSize: 13 }} /> },
    { title: '特色标签', dataIndex: 'cuisineTags', width: 200, render: (v) => {
      let tags: string[] = [];
      if (Array.isArray(v)) tags = v;
      else if (typeof v === 'string') try { tags = JSON.parse(v); } catch { tags = []; }
      return tags.length ? (
        <Space size={4}>{tags.map((t: string) => <Tag key={t} color="blue" style={{ borderRadius: 4 }}>{t}</Tag>)}</Space>
      ) : <Text type="secondary">-</Text>;
    } },
    { title: '营业时间', dataIndex: 'openingHours', width: 100, render: (v) => <Text style={{ fontSize: 12 }}>{v || '-'}</Text> },
    { title: '状态', dataIndex: 'status', width: 70, align: 'center', render: (v) => v === 1 ? <Tag color="success" icon={<CheckCircleOutlined />}>营业</Tag> : <Tag icon={<CloseCircleOutlined />}>关闭</Tag> },
    { title: '操作', width: 200, align: 'center', render: (_, r) => (
      <Space size={0}>
        <Tooltip title="管理菜品"><Button type="text" size="small" icon={<MenuOutlined />} onClick={() => onJumpToDish(r.id)} style={{ color: COLORS.primary }} /></Tooltip>
        <Divider type="vertical" />
        <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={() => { setEditing(r); form.setFieldsValue(r); setModalOpen(true); }} style={{ color: COLORS.warning }} /></Tooltip>
        <Divider type="vertical" />
        <Popconfirm title="确定删除？" onConfirm={async () => { await foodApi.deleteRestaurant(r.id); message.success('已删除'); actionRef.current?.reload(); loadStats(); }}>
          <Tooltip title="删除"><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Tooltip>
        </Popconfirm>
      </Space>
    )},
  ];

  return (<>
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      {[
        { title: '餐厅总数', value: stats.total, icon: <ShopOutlined />, color: COLORS.primary, bg: '#E8F4FD' },
        { title: '营业中', value: stats.open, icon: <CheckCircleOutlined />, color: COLORS.success, bg: '#EDF7ED' },
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
        request={async () => { try { const res = await foodApi.listRestaurants({ page: 1, pageSize: 100 }); return { data: res?.data?.list || [], success: true }; } catch { return { data: [], success: false }; } }}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }} style={{ boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}>新增餐厅</Button>]}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无餐厅数据" /> }}
      />
    </Card>
    <Modal title={editing ? '编辑餐厅' : '新增餐厅'} open={modalOpen} onOk={() => form.submit()} onCancel={() => setModalOpen(false)} width={560} destroyOnClose okText={editing ? '保存' : '创建'}>
      <Form form={form} layout="vertical" onFinish={async (values) => {
        try {
          const payload = {
            name: values.name,
            phone: values.phone || '',
            openingHours: values.openingHours || '',
            address: values.address || '',
            coverImage: values.coverImage || '',
            description: values.description || '',
            status: 1,
          };
          editing ? await foodApi.updateRestaurant(editing.id, payload) : await foodApi.createRestaurant(payload);
          message.success(editing ? '已更新' : '已创建'); setModalOpen(false); actionRef.current?.reload(); loadStats();
        } catch { message.error('操作失败'); }
      }}>
        <Form.Item name="name" label="餐厅名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Row gutter={16}><Col span={12}><Form.Item name="phone" label="联系电话"><Input /></Form.Item></Col>
        <Col span={12}><Form.Item name="openingHours" label="营业时间"><Input placeholder="如：11:00-21:00" /></Form.Item></Col></Row>
        <Form.Item name="address" label="地址"><Input /></Form.Item>
        <Form.Item name="coverImage" label="封面图 URL"><Input placeholder="https://..." /></Form.Item>
        <Form.Item name="description" label="介绍"><Input.TextArea rows={3} /></Form.Item>
      </Form>
    </Modal>
  </>);
};

/* ============================================================
   农产品管理 Tab
   ============================================================ */
const ProductTab: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [stats, setStats] = useState({ total: 0, online: 0, lowStock: 0 });

  const loadStats = useCallback(async () => {
    try {
      const res = await foodApi.listProducts({ page: 1, pageSize: 100 });
      const list = res?.data?.list || [];
      setStats({ total: list.length, online: list.filter((p: any) => p.status === 1).length, lowStock: list.filter((p: any) => p.stock < 20).length });
    } catch {}
  }, []);
  useEffect(() => { loadStats(); }, [loadStats]);

  const columns: ProColumns<any>[] = [
    { title: '排序', width: 60, align: 'center', render: (_: any, _r: any, index: number) => <Tag style={{ borderRadius: 10 }}>{index + 1}</Tag> },
    { title: '商品', dataIndex: 'name', width: 200,
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {r.mainImage ? (
            <Image src={r.mainImage} width={40} height={40} style={{ borderRadius: 6, objectFit: 'cover', border: '1px solid #f0f0f0' }}
              fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='%23f5f5f5'%3E%3Ctext x='6' y='27' font-size='20'%3E🛒%3C/text%3E%3C/svg%3E" />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: 6, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛒</div>
          )}
          <Text strong style={{ fontSize: 14 }}>{r.name}</Text>
        </div>
      ),
    },
    { title: '价格', dataIndex: 'price', width: 90, align: 'right', render: (v) => <Text style={{ color: COLORS.danger, fontWeight: 600 }}>¥{Number(v).toFixed(2)}</Text> },
    { title: '库存', dataIndex: 'stock', width: 100, align: 'center', sorter: true,
      render: (v) => {
        if (v === 0) return <Tag color="error">缺货</Tag>;
        if (v < 20) return <Space><Text style={{ color: COLORS.danger, fontWeight: 600 }}>{v}</Text><Tag color="warning" style={{ borderRadius: 4 }}>库存紧张</Tag></Space>;
        return <Text>{v}</Text>;
      },
    },
    { title: '单位', dataIndex: 'unit', width: 80, render: (v) => <Text code style={{ fontSize: 11 }}>{v || '-'}</Text> },
    { title: '状态', dataIndex: 'status', width: 70, align: 'center',
      render: (v, r) => {
        if (r.stock === 0) return <Tag color="error">缺货</Tag>;
        return v === 1 ? <Tag color="success" icon={<CheckCircleOutlined />}>上架</Tag> : <Tag icon={<CloseCircleOutlined />}>下架</Tag>;
      },
    },
    { title: '操作', width: 140, align: 'center', render: (_, r) => (
      <Space size={0}>
        <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={() => { setEditing(r); form.setFieldsValue(r); setModalOpen(true); }} style={{ color: COLORS.warning }} /></Tooltip>
        <Divider type="vertical" />
        <Popconfirm title="确定删除？" onConfirm={async () => { await foodApi.deleteProduct(r.id); message.success('已删除'); actionRef.current?.reload(); loadStats(); }}>
          <Tooltip title="删除"><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Tooltip>
        </Popconfirm>
      </Space>
    )},
  ];

  return (<>
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      {[
        { title: '商品总数', value: stats.total, icon: <CoffeeOutlined />, color: COLORS.primary, bg: '#E8F4FD' },
        { title: '上架中', value: stats.online, icon: <CheckCircleOutlined />, color: COLORS.success, bg: '#EDF7ED' },
        { title: '库存紧张', value: stats.lowStock, icon: <WarningOutlined />, color: COLORS.danger, bg: '#FFF1F0' },
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
        request={async () => { try { const res = await foodApi.listProducts({ page: 1, pageSize: 100 }); return { data: res?.data?.list || [], success: true }; } catch { return { data: [], success: false }; } }}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }}>新增农产品</Button>]}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无农产品数据" /> }}
      />
    </Card>
    <Modal title={editing ? '编辑农产品' : '新增农产品'} open={modalOpen} onOk={() => form.submit()} onCancel={() => setModalOpen(false)} width={560} destroyOnClose okText={editing ? '保存' : '创建'}>
      <Form form={form} layout="vertical" onFinish={async (values) => {
        try { editing ? await foodApi.updateProduct(editing.id, { ...values, price: Number(values.price), stock: Number(values.stock) }) : await foodApi.createProduct({ ...values, price: Number(values.price), stock: Number(values.stock) }); message.success(editing ? '已更新' : '已创建'); setModalOpen(false); actionRef.current?.reload(); loadStats(); } catch { message.error('操作失败'); }
      }}>
        <Form.Item name="name" label="商品名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="price" label="价格" rules={[{ required: true }]}><InputNumber min={0} precision={2} prefix="¥" style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={8}><Form.Item name="stock" label="库存"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={8}><Form.Item name="unit" label="单位"><Input placeholder="如：500g/袋" /></Form.Item></Col>
        </Row>
        <Form.Item name="mainImage" label="商品图 URL"><Input placeholder="https://..." /></Form.Item>
        <Form.Item name="description" label="描述"><Input.TextArea rows={3} /></Form.Item>
      </Form>
    </Modal>
  </>);
};

/* ============================================================
   菜品管理 Tab
   ============================================================ */
const DishTab: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [filterRestaurantId, setFilterRestaurantId] = useState<number | undefined>(undefined);

  useEffect(() => {
    foodApi.allRestaurants().then((res: any) => setRestaurants(res?.data || res || [])).catch(() => {});
  }, []);

  const columns: ProColumns<any>[] = [
    { title: '排序', width: 60, align: 'center', render: (_: any, _r: any, index: number) => <Tag style={{ borderRadius: 10 }}>{index + 1}</Tag> },
    { title: '菜品名', width: 220,
      render: (_, r) => {
        const imgSrc = r.main_image || r.mainImage || '';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {imgSrc ? (
              <Image src={imgSrc} width={44} height={44} style={{ borderRadius: 6, objectFit: 'cover', border: '1px solid #f0f0f0' }}
                fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' fill='%23f5f5f5'%3E%3Ctext x='10' y='28' font-size='20'%3E🍽%3C/text%3E%3C/svg%3E" />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: 6, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🍽</div>
            )}
            <Space direction="vertical" size={0}>
              <Space>
                {r.is_signature ? <StarFilled style={{ color: '#FAAD14' }} /> : null}
                <Text strong style={{ fontSize: 14 }}>{r.name}</Text>
              </Space>
              <Text type="secondary" style={{ fontSize: 11 }}>{r.restaurant_name || '未关联餐厅'}</Text>
            </Space>
          </div>
        );
      },
    },
    { title: '所属餐厅', dataIndex: 'restaurant_name', width: 120, render: (v) => v ? <Tag color="blue" style={{ borderRadius: 4 }}>{v}</Tag> : <Text type="secondary">-</Text> },
    { title: '价格', dataIndex: 'price', width: 80, align: 'right', render: (v) => <Text style={{ color: COLORS.danger, fontWeight: 600 }}>¥{Number(v).toFixed(2)}</Text> },
    { title: '招牌', width: 60, align: 'center', render: (_, r) => r.is_signature ? <StarFilled style={{ color: '#FAAD14', fontSize: 18 }} /> : '-' },
    { title: '状态', dataIndex: 'status', width: 80, align: 'center',
      render: (v, r) => (
        <Switch checked={v === 1} size="small" checkedChildren="在售" unCheckedChildren="估清"
          onChange={async (checked) => { try { await foodApi.updateDish(r.id, { status: checked ? 1 : 0 }); message.success(checked ? '已上架' : '已估清'); actionRef.current?.reload(); } catch { message.error('操作失败'); } }}
          style={{ backgroundColor: v === 1 ? COLORS.success : undefined }}
        />
      ),
    },
    { title: '操作', width: 140, align: 'center', render: (_, r) => (
      <Space size={0}>
        <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={() => {
          setEditing(r);
          form.setFieldsValue({
            name: r.name,
            price: r.price,
            restaurantId: r.restaurant_id,
            mainImage: r.main_image || r.mainImage || '',
            isSignature: !!r.is_signature,
            status: r.status,
            description: r.description,
          });
          setModalOpen(true);
        }} style={{ color: COLORS.warning }} /></Tooltip>
        <Divider type="vertical" />
        <Popconfirm title="确定删除？" onConfirm={async () => { await foodApi.deleteDish(r.id); message.success('已删除'); actionRef.current?.reload(); }}>
          <Tooltip title="删除"><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Tooltip>
        </Popconfirm>
      </Space>
    )},
  ];

  return (<>
    <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 24px' } }}>
      <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
        request={async () => {
          try { const res = await foodApi.listDishes({ page: 1, pageSize: 100, restaurantId: filterRestaurantId || undefined }); return { data: res?.data?.list || [], success: true }; }
          catch { return { data: [], success: false }; }
        }}
        toolbar={{
          filter: (
            <Space>
              <span style={{ fontSize: 13, color: '#666' }}>所属餐厅：</span>
              <Select placeholder="全部餐厅" allowClear style={{ width: 200 }}
                value={filterRestaurantId} onChange={(v) => { setFilterRestaurantId(v); actionRef.current?.reload(); }}
                options={[{ label: '全部餐厅', value: undefined } as any].concat(restaurants.map((r: any) => ({ label: r.name, value: r.id })))}
              />
            </Space>
          ),
        }}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />}
          onClick={() => { setEditing(null); form.resetFields(); form.setFieldsValue({ status: 1 }); setModalOpen(true); }}
          style={{ boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}>新增菜品</Button>]}
        locale={{
          emptyText: restaurants.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>暂无菜品数据<br /><Text type="secondary" style={{ fontSize: 12 }}>请先前往「餐厅管理」添加餐厅</Text></span>} />
          ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无菜品数据" />
        }}
      />
    </Card>
    <Modal title={editing ? '编辑菜品' : '新增菜品'} open={modalOpen} onOk={() => form.submit()} onCancel={() => setModalOpen(false)} width={560} destroyOnClose okText={editing ? '保存' : '创建'}>
      <Form form={form} layout="vertical" onFinish={async (values) => {
        try {
          const payload = {
            name: values.name,
            price: Number(values.price),
            restaurantId: Number(values.restaurantId),
            mainImage: values.mainImage || '',
            isSignature: values.isSignature ? 1 : 0,
            status: 1,
            description: values.description || '',
          };
          editing ? await foodApi.updateDish(editing.id, payload) : await foodApi.createDish(payload);
          message.success(editing ? '已更新' : '已创建'); setModalOpen(false); actionRef.current?.reload();
        } catch { message.error('操作失败'); }
      }}>
        <Form.Item name="restaurantId" label="所属餐厅" rules={[{ required: true, message: '请选择餐厅' }]}>
          <Select placeholder="请选择餐厅" options={restaurants.map((r: any) => ({ label: r.name, value: r.id }))} showSearch optionFilterProp="label" />
        </Form.Item>
        <Form.Item name="name" label="菜品名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="price" label="价格" rules={[{ required: true }]}><InputNumber min={0} precision={2} prefix="¥" style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={8}><Form.Item name="isSignature" label="招牌菜" valuePropName="checked"><Switch checkedChildren="⭐" unCheckedChildren="普通" /></Form.Item></Col>
        </Row>
        <Form.Item name="mainImage" label="菜品图 URL"><Input placeholder="https://..." /></Form.Item>
        <Form.Item name="description" label="描述"><Input.TextArea rows={3} /></Form.Item>
      </Form>
    </Modal>
  </>);
};

/* ============================================================
   主组件 - Tab 切换
   ============================================================ */
const FoodAdmin: React.FC = () => {
  const [activeKey, setActiveKey] = useState('restaurants');

  const handleJumpToDish = (restaurantId: number) => {
    // 切换到菜品 Tab，并通过 ref 传入筛选
    setActiveKey('dishes');
    // 我们可以通过 setTimeout 来让 DishTab 重新挂载时获取筛选值
    // 但由于组件独立，更简单的方式：切换到菜品选项卡后通过路由或全局状态
    // 这里用简单的方式：刷新页面后在 DishTab 的 Select 中手动选择
    message.info(`已切换到菜品管理，请选择餐厅ID: ${restaurantId}`);
  };

  return (
    <div style={{ padding: 0 }}>
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }} styles={{ body: { padding: '0' } }}>
        <Tabs activeKey={activeKey} onChange={setActiveKey} style={{ margin: 0, padding: '0 24px' }}
          items={[
            { key: 'restaurants', label: <span><ShopOutlined /> 餐厅管理</span>, children: <RestaurantTab onJumpToDish={handleJumpToDish} /> },
            { key: 'products', label: <span><CoffeeOutlined /> 农产品管理</span>, children: <ProductTab /> },
            { key: 'dishes', label: <span><MenuOutlined /> 菜品管理</span>, children: <DishTab key={activeKey === 'dishes' ? 'dishes' : 'dishes-reset'} /> },
          ]}
        />
      </Card>
    </div>
  );
};

export default FoodAdmin;
