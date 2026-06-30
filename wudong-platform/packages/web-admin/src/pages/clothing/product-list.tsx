import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Button, Modal, Form, Input, InputNumber, Select, message,
  Popconfirm, Tag, Image, Space, Switch, Card, Row, Col, Statistic,
  Tooltip, Badge, Typography, Divider, Empty,
} from 'antd';
import {
  PlusOutlined, ClearOutlined,
  EditOutlined, DeleteOutlined, ShopOutlined, EyeOutlined,
  ArrowUpOutlined, ArrowDownOutlined,
  InboxOutlined, TagOutlined, UploadOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import dayjs from 'dayjs';
import { productApi } from '../../services/api';

const { Text } = Typography;

/* ============================================================
   品牌色系统
   ============================================================ */
const COLORS = {
  primary: '#1F5FA8',
  success: '#6B8E3D',
  warning: '#E8A838',
  danger: '#D94A4A',
  price: '#E85D2F',
  star: '#FAAD14',
  textSecondary: '#8C8C8C',
  border: '#E8E8E8',
  bgLight: '#F7F9FC',
  white: '#FFFFFF',
};

/* ============================================================
   辅助组件：商品信息展示
   ============================================================ */
const ProductInfo: React.FC<{ record: any }> = ({ record }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Badge count={record.status === 1 ? null : 0} offset={[-4, 4]} size="small">
      <Image
        src={record.mainImage}
        width={48}
        height={48}
        style={{
          borderRadius: 8,
          objectFit: 'cover',
          border: `1px solid ${COLORS.border}`,
          flexShrink: 0,
        }}
        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        preview={{ mask: <EyeOutlined style={{ fontSize: 16 }} /> }}
      />
    </Badge>
    <div style={{ minWidth: 0 }}>
      <Text
        ellipsis={{ tooltip: record.name }}
        style={{ fontSize: 14, fontWeight: 500, display: 'block', maxWidth: 200 }}
      >
        {record.name}
      </Text>
      <Text type="secondary" style={{ fontSize: 12 }}>
        ID: {record.id}
        {record.productCode && <span> · {record.productCode}</span>}
      </Text>
    </div>
  </div>
);

/* ============================================================
   辅助组件：在線状态切换
   ============================================================ */
const StatusSwitch: React.FC<{
  checked: boolean;
  record: any;
  onToggle: (record: any) => void;
}> = ({ checked, record, onToggle }) => (
  <Tooltip title={checked ? '点击下架' : '点击上架'}>
    <Switch
      checked={checked}
      size="small"
      checkedChildren="上架"
      unCheckedChildren="下架"
      style={{
        backgroundColor: checked ? COLORS.success : undefined,
      }}
      onChange={() => onToggle(record)}
    />
  </Tooltip>
);

/* ============================================================
   辅助组件：星级评分
   ============================================================ */
const RatingStars: React.FC<{ value: number }> = ({ value }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push('★');
    else if (i === full && half) stars.push('★');
    else stars.push('☆');
  }
  return (
    <Tooltip title={`${value} 分`}>
      <Space size={2} wrap={false}>
        <span style={{ color: COLORS.star, fontSize: 13, letterSpacing: 1 }}>
          {stars.join('')}
        </span>
        <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>
          {value}
        </Text>
      </Space>
    </Tooltip>
  );
};

/* ============================================================
   辅助组件：分类标签
   ============================================================ */
const CategoryTag: React.FC<{
  categoryId: number;
  categories: any[];
}> = ({ categoryId, categories }) => {
  const cat = categories.find(c => String(c.id) === String(categoryId));
  if (!cat) return <Tag style={{ borderRadius: 4 }}>-</Tag>;

  // 给分类分配不同颜色
  const colorList = ['#1F5FA8', '#6B8E3D', '#E8A838', '#D94A4A', '#9B59B6', '#1ABC9C', '#E67E22', '#2C3E50'];
  const idx = (cat.id || 0) % colorList.length;

  return (
    <Tag
      style={{
        borderRadius: 4,
        color: colorList[idx],
        background: `${colorList[idx]}14`,
        border: `1px solid ${colorList[idx]}30`,
        fontWeight: 500,
      }}
    >
      {cat.name}
    </Tag>
  );
};

/* ============================================================
   主组件
   ============================================================ */
const ProductList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0, lowStock: 0 });
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  // 加载分类
  useEffect(() => {
    productApi.categories().then((res: any) => {
      const data = res.data?.data || res.data || [];
      setCategories(data);
    }).catch(() => {});
  }, []);

  // 加载统计（单独请求全部数据确保准确）
  const loadStats = useCallback(async () => {
    try {
      const res = await productApi.list({ page: 1, pageSize: 100 });
      const data = res.data?.data || res.data;
      const all = data.list || [];
      setStats({
        total: data.pagination?.total || all.length,
        online: all.filter((p: any) => p.status === 1).length,
        offline: all.filter((p: any) => p.status === 0).length,
        lowStock: all.filter((p: any) => p.stock !== undefined && p.stock < 10).length,
      });
    } catch {}
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  // 自定义请求
  const fetchProducts = async (params: any) => {
    const { current, pageSize, ...rest } = params;
    try {
      const res = await productApi.list({
        page: current,
        pageSize,
        ...rest,
      });
      const data = res.data?.data || res.data;
      const list = data.list || [];
      const pagination = data.pagination || { total: 0 };

      return { data: list, success: true, total: pagination.total || 0 };
    } catch {
      return { data: [], success: false, total: 0 };
    }
  };

  // 表格列配置
  const columns: ProColumns<any>[] = [
    // ---------- 商品（主图+名称） ----------
    {
      title: '#', width: 45, align: 'center', fixed: 'left',
      render: (_: any, _r: any, i: number) => <Tag style={{ borderRadius: 8, minWidth: 20, textAlign: 'center', fontSize: 11, lineHeight: '18px', padding: '0 4px' }}>{i + 1}</Tag>,
    },
    {
      title: '商品',
      dataIndex: 'name',
      width: 180,
      ellipsis: false,
      render: (_, r) => <ProductInfo record={r} />,
    },
    // ---------- 分类 ----------
    {
      title: '分类',
      dataIndex: 'categoryId',
      width: 120,
      valueType: 'select',
      valueEnum: Object.fromEntries(
        categories.map((c: any) => [c.id, { text: c.name }])
      ),
      render: (_, r) => <CategoryTag categoryId={r.categoryId} categories={categories} />,
    },
    // ---------- 价格 ----------
    {
      title: '价格',
      dataIndex: 'price',
      width: 100,
      align: 'right',
      sorter: true,
      render: (v) => (
        <Text style={{ color: COLORS.price, fontWeight: 700, fontSize: 15 }}>
          ¥{Number(v).toFixed(2)}
        </Text>
      ),
    },
    // ---------- 市场价 ----------
    {
      title: '市场价',
      dataIndex: 'marketPrice',
      width: 120,
      align: 'right',
      render: (v) => v && Number(v) > 0 ? (
        <Text style={{ fontSize: 13 }}>
          ¥{Number(v).toFixed(2)}
        </Text>
      ) : <Text type="secondary">-</Text>,
    },
    // ---------- 库存 ----------
    {
      title: '库存',
      dataIndex: 'stock',
      width: 60,
      align: 'center',
      sorter: true,
      render: (v) => v !== undefined ? (
        <Text style={{ color: v < 10 ? COLORS.danger : undefined, fontWeight: v < 10 ? 600 : 400 }}>
          {v}
        </Text>
      ) : <Text type="secondary">-</Text>,
    },
    // ---------- 销量 ----------
    {
      title: '销量',
      dataIndex: 'sales',
      width: 70,
      align: 'center',
      sorter: true,
      render: (v) => (
        <Text style={{ fontWeight: 500 }}>
          {v ?? 0}
        </Text>
      ),
    },
    // ---------- 评分 ----------
    {
      title: '评分',
      dataIndex: 'rating',
      width: 120,
      align: 'center',
      sorter: true,
      render: (v) => v ? <span style={{ whiteSpace: 'nowrap' }}><span style={{ whiteSpace: "nowrap" }}><RatingStars value={Number(v)} /></span></span> : <Text type="secondary">-</Text>,
    },
    // ---------- 状态 ----------
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        1: { text: '上架中', status: 'Success' },
        0: { text: '已下架', status: 'Default' },
      },
      render: (_, r) => <StatusSwitch checked={r.status === 1} record={r} onToggle={handleToggle} />,
    },
    // ---------- 创建时间 ----------
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 120,
      align: 'center',
      sorter: true,
      render: (v) => v ? (
        <Tooltip title={dayjs(v).format('YYYY-MM-DD HH:mm:ss')}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(v).format('MM-DD HH:mm')}
          </Text>
        </Tooltip>
      ) : '-',
    },
    // ---------- 操作 ----------
    {
      title: '操作',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="编辑商品">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: COLORS.primary }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title={record.status === 1 ? '下架商品' : '上架商品'}>
            <Button
              type="text"
              size="small"
              icon={record.status === 1 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
              onClick={() => handleToggle(record)}
              style={{ color: record.status === 1 ? COLORS.warning : COLORS.success }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除该商品吗？"
            description="删除后数据不可恢复"
            onConfirm={() => handleDelete(record.id)}
            okText="确定删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="删除商品">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ======= 事件处理 =======

  const handleEdit = (record?: any) => {
    setEditingProduct(record || null);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({ status: 1 });
    }
    setModalOpen(true);
  };

  const handleToggle = async (record: any) => {
    const newStatus = record.status === 1 ? 0 : 1;
    try {
      const res = await productApi.update(record.id, { status: newStatus });
      message.success(newStatus === 1 ? '已上架' : '已下架');
      actionRef.current?.reload();
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productApi.delete(id);
      message.success('已删除');
      setSelectedRowKeys(prev => prev.filter(k => k !== id));
      actionRef.current?.reload();
    } catch {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        price: Number(values.price),
        marketPrice: values.marketPrice ? Number(values.marketPrice) : undefined,
        stock: values.stock !== undefined ? Number(values.stock) : undefined,
        sales: values.sales !== undefined ? Number(values.sales) : undefined,
      };

      if (editingProduct) {
        await productApi.update(editingProduct.id, payload);
        message.success('商品更新成功');
      } else {
        await productApi.create(payload);
        message.success('商品创建成功');
      }
      setModalOpen(false);
      actionRef.current?.reload();
    } catch (err: any) {
      if (err.errorFields) return; // form validation error
      message.error('操作失败');
    }
  };

  // ======= 批量操作 =======

  const handleBatchStatus = async (status: number) => {
    if (!selectedRowKeys.length) {
      message.warning('请先选择商品');
      return;
    }
    try {
      const text = status === 1 ? '上架' : '下架';
      await Promise.all(selectedRowKeys.map(id => productApi.update(Number(id), { status })));
      message.success(`已${text} ${selectedRowKeys.length} 个商品`);
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    } catch {
      message.error('批量操作失败');
    }
  };

  const handleBatchDelete = async () => {
    if (!selectedRowKeys.length) {
      message.warning('请先选择商品');
      return;
    }
    try {
      await Promise.all(selectedRowKeys.map(id => productApi.delete(Number(id))));
      message.success(`已删除 ${selectedRowKeys.length} 个商品`);
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    } catch {
      message.error('批量删除失败');
    }
  };

  // ======= 批量导入处理 =======
  const handleBatchImport = async () => {
    try {
      const products = JSON.parse(importData);
      if (!Array.isArray(products) || products.length === 0) {
        message.error('请输入有效的 JSON 数组');
        return;
      }
      let success = 0;
      const errors: string[] = [];
      for (let i = 0; i < products.length; i++) {
        try {
          await productApi.create(products[i]);
          success++;
        } catch {
          errors.push(`第 ${i + 1} 项导入失败`);
        }
      }
      if (errors.length > 0) {
        message.warning(`导入完成：成功 ${success}/${products.length}\n${errors.slice(0, 3).join('、')}`);
      } else {
        message.success(`成功导入 ${success} 个商品`);
      }
      setImportOpen(false);
      setImportData('');
      actionRef.current?.reload();
    } catch {
      message.error('JSON 格式错误，请检查后重试');
    }
  };

  // ======= 渲染 =======
  return (
    <div style={{ padding: 0 }}>
      {/* ===== 顶部统计卡片 ===== */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={12} md={6}>
          <Card
            hoverable
            style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <Statistic
              title={<Text type="secondary">全部商品</Text>}
              value={stats.total}
              prefix={<ShopOutlined style={{ color: COLORS.primary }} />}
              valueStyle={{ color: COLORS.primary, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card
            hoverable
            style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <Statistic
              title={<Text type="secondary">上架中</Text>}
              value={stats.online}
              prefix={<ArrowUpOutlined style={{ color: COLORS.success }} />}
              valueStyle={{ color: COLORS.success, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card
            hoverable
            style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <Statistic
              title={<Text type="secondary">已下架</Text>}
              value={stats.offline}
              prefix={<ArrowDownOutlined style={{ color: COLORS.textSecondary }} />}
              valueStyle={{ fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card
            hoverable
            style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <Statistic
              title={<Text type="secondary">低库存预警</Text>}
              value={stats.lowStock}
              prefix={<InboxOutlined style={{ color: COLORS.danger }} />}
              valueStyle={{ color: stats.lowStock > 0 ? COLORS.danger : COLORS.textSecondary, fontWeight: 700 }}
              suffix={stats.lowStock > 0 ? <Text style={{ color: COLORS.danger, fontSize: 12 }}>需补货</Text> : null}
            />
          </Card>
        </Col>
      </Row>

      {/* ===== 主表格 ===== */}
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
          request={fetchProducts}
          // ---- 勾选 ----
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
            selections: [
              { key: 'all', text: '全选当前页', onSelect: (keys) => setSelectedRowKeys(keys) },
              { key: 'none', text: '取消选择', onSelect: () => setSelectedRowKeys([]) },
            ],
          }}
          // ---- 搜索栏 ----
          search={{
            labelWidth: 'auto',
            defaultCollapsed: true,
            collapseRender: (collapsed) => collapsed ? '展开筛选' : '收起筛选',
            optionRender: (searchConfig, formProps, dom) => [
              ...dom,
              <Button
                key="clear"
                icon={<ClearOutlined />}
                onClick={() => {
                  formProps.form?.resetFields();
                  actionRef.current?.reload();
                }}
              >
                重置
              </Button>,
            ],
          }}
          // ---- 表单筛选项 ----
          form={{
            ignoreRules: false,
          }}
          columnsState={{
            persistenceKey: 'wudong-product-list',
            persistenceType: 'localStorage',
          }}
          // ---- 工具栏 ----
          toolBarRender={() => [
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleEdit()}
              style={{
                background: COLORS.primary,
                borderColor: COLORS.primary,
                boxShadow: '0 2px 6px rgba(31,95,168,0.25)',
              }}
            >
              新增商品
            </Button>,
            <Button
              key="import"
              icon={<UploadOutlined />}
              onClick={() => setImportOpen(true)}
            >
              批量导入
            </Button>,
          ]}
          // ---- 分页 ----
          pagination={{
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50', '100'],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 件`,
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
                description={<span>暂无商品数据<br /><Text type="secondary" style={{ fontSize: 12 }}>点击「新增商品」开始添加</Text></span>}
              />
            ),
          }}
          sticky={{ offsetHeader: 0 }}
        />

        {/* ===== 批量操作栏 ===== */}
        {selectedRowKeys.length > 0 && (
          <div
            style={{
              marginTop: 12,
              padding: '10px 16px',
              background: `${COLORS.primary}08`,
              border: `1px solid ${COLORS.primary}20`,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <Space>
              <Badge
                count={selectedRowKeys.length}
                style={{ backgroundColor: COLORS.primary }}
                overflowCount={999}
              />
              <Text type="secondary">已选择</Text>
            </Space>
            <Space>
              <Button size="small" icon={<ArrowUpOutlined />} onClick={() => handleBatchStatus(1)}>
                批量上架
              </Button>
              <Button size="small" icon={<ArrowDownOutlined />} onClick={() => handleBatchStatus(0)}>
                批量下架
              </Button>
              <Popconfirm
                title={`确定删除选中的 ${selectedRowKeys.length} 个商品？`}
                onConfirm={handleBatchDelete}
                okButtonProps={{ danger: true }}
              >
                <Button size="small" danger icon={<DeleteOutlined />}>
                  批量删除
                </Button>
              </Popconfirm>
            </Space>
          </div>
        )}
      </Card>

      {/* ===== 新增/编辑弹窗 ===== */}
      <Modal
        title={
          <Space>
            {editingProduct ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingProduct ? '编辑商品' : '新增商品'}</span>
          </Space>
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={720}
        okText={editingProduct ? '保存修改' : '创建商品'}
        cancelText="取消"
        destroyOnClose
        style={{ top: 40 }}
        styles={{ body: { maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' } }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 8 }}
          initialValues={{ status: 1, stock: 0 }}
        >
          {/* -- 基本信息 -- */}
          <div style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 14, color: COLORS.primary }}>
              <TagOutlined style={{ marginRight: 6 }} />
              基本信息
            </Text>
            <Divider style={{ margin: '8px 0 16px' }} />
          </div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="商品名称"
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input placeholder="请输入商品名称" maxLength={100} showCount />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="categoryId" label="所属分类" rules={[{ required: true, message: '请选择分类' }]}>
                <Select
                  placeholder="请选择分类"
                  options={categories.map((c: any) => ({ label: c.name, value: c.id }))}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="productCode" label="商品编码">
                <Input placeholder="可选，如 WD-CL-001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="上架状态">
                <Select
                  options={[
                    { label: '上架', value: 1 },
                    { label: '下架', value: 0 },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* -- 价格库存 -- */}
          <div style={{ marginBottom: 8, marginTop: 16 }}>
            <Text strong style={{ fontSize: 14, color: COLORS.primary }}>
              <InboxOutlined style={{ marginRight: 6 }} />
              价格与库存
            </Text>
            <Divider style={{ margin: '8px 0 16px' }} />
          </div>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="销售价（¥）"
                rules={[
                  { required: true, message: '请输入价格' },
                  { type: 'number', min: 0, message: '价格不能为负' },
                ]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  prefix="¥"
                  placeholder="0.00"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="marketPrice" label="市场价（¥）">
                <InputNumber
                  min={0}
                  precision={2}
                  prefix="¥"
                  placeholder="0.00"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="stock"
                label="库存数量"
                rules={[{ type: 'number', min: 0, message: '库存不能为负' }]}
              >
                <InputNumber min={0} precision={0} placeholder="0" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="sales" label="初始销量">
                <InputNumber min={0} precision={0} placeholder="0" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="rating" label="初始评分">
                <InputNumber min={0} max={5} step={0.1} precision={1} placeholder="0.0" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          {/* -- 图片与描述 -- */}
          <div style={{ marginBottom: 8, marginTop: 16 }}>
            <Text strong style={{ fontSize: 14, color: COLORS.primary }}>
              <EyeOutlined style={{ marginRight: 6 }} />
              图片与描述
            </Text>
            <Divider style={{ margin: '8px 0 16px' }} />
          </div>
          <Form.Item name="mainImage" label="主图 URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item
            name="description"
            label="商品描述"
            tooltip="支持富文本 HTML 描述"
          >
            <Input.TextArea rows={4} placeholder="请输入商品描述（支持 HTML）" maxLength={2000} showCount />
          </Form.Item>
        </Form>
      </Modal>

      {/* ===== 批量导入弹窗 ===== */}
      <Modal
        title={
          <Space>
            <UploadOutlined />
            <span>批量导入商品</span>
          </Space>
        }
        open={importOpen}
        onOk={handleBatchImport}
        onCancel={() => { setImportOpen(false); setImportData(''); }}
        okText="导入"
        cancelText="取消"
        width={640}
      >
        <div style={{ background: COLORS.bgLight, padding: 12, borderRadius: 8, marginBottom: 12 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            粘贴 JSON 数组，每项包含商品信息。可批量创建多个商品。
          </Text>
        </div>
        <Input.TextArea
          rows={10}
          placeholder={JSON.stringify([
            { name: '示例商品', categoryId: 1, price: 99.00, stock: 100, mainImage: 'https://...' },
          ], null, 2)}
          value={importData}
          onChange={e => setImportData(e.target.value)}
          style={{ fontFamily: 'monospace', fontSize: 13 }}
        />
      </Modal>
    </div>
  );
};

export default ProductList;
