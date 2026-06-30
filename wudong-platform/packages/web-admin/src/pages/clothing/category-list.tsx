import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Modal, Form, Input, InputNumber, message, Popconfirm,
  Tag, Card, Row, Col, Statistic, Space, Typography, Divider,
  Tooltip, Empty,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined,
  ScissorOutlined, BgColorsOutlined, GoldOutlined, SkinOutlined,
  ToolOutlined, TagOutlined, EyeOutlined, FieldTimeOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { categoryApi, productApi } from '../../services/api';

const { Text } = Typography;

/* ============================================================
   品牌色
   ============================================================ */
const COLORS = {
  primary: '#1F5FA8',
  success: '#6B8E3D',
  warning: '#E8A838',
  danger: '#D94A4A',
  textSecondary: '#8C8C8C',
  border: '#E8E8E8',
};

/* ============================================================
   分类背景色（8 种循环）
   ============================================================ */
const CATEGORY_BG = [
  '#1F5FA8', '#6B8E3D', '#E8A838', '#D94A4A',
  '#9B59B6', '#1ABC9C', '#E67E22', '#2C3E50',
];

/* ============================================================
   分类名 → Ant Design 图标 映射表
   ============================================================ */
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  '苗绣': <ScissorOutlined />,
  '蜡染': <BgColorsOutlined />,
  '银饰': <GoldOutlined />,
  '民族服饰': <SkinOutlined />,
  '手工艺': <ToolOutlined />,
  '手工艺品': <ToolOutlined />,
};

const DEFAULT_ICON = <TagOutlined />;

/** 根据分类名匹配图标 */
function matchIcon(name: string): React.ReactNode {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (name.includes(key)) return icon;
  }
  return DEFAULT_ICON;
}

/* ============================================================
   统计卡片背景色块
   ============================================================ */
const CARD_META = [
  { icon: <TagsOutlined />, bg: '#E8F4FD', iconColor: COLORS.primary, label: '分类总数' },
  { icon: <CheckCircleOutlined />, bg: '#EDF7ED', iconColor: COLORS.success, label: '启用分类' },
  { icon: <FieldTimeOutlined />, bg: '#FFF7E6', iconColor: COLORS.warning, label: '最近更新' },
];

/* ============================================================
   主组件
   ============================================================ */
const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [productCountMap, setProductCountMap] = useState<Record<number, number>>({});
  const [latestUpdate, setLatestUpdate] = useState<string>('-');
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  // ===== 加载分类 + 商品统计 =====
  const loadData = useCallback(async () => {
    try {
      // 1) 获取分类列表
      const catRes = await categoryApi.list();
      const cats = catRes.data?.data || catRes.data || [];
      setCategories(cats);

      // 2) 获取商品列表，按 categoryId 统计数量
      const prodRes = await productApi.list({ page: 1, pageSize: 100 });
      const prodData = prodRes.data?.data || prodRes.data;
      const products = prodData?.list || [];
      const countMap: Record<number, number> = {};
      for (const p of products) {
        const cid = Number(p.categoryId);
        countMap[cid] = (countMap[cid] || 0) + 1;
      }
      setProductCountMap(countMap);

      // 3) 最近更新时间
      if (cats.length > 0) {
        const times = cats
          .map((c: any) => c.updatedAt || c.createdAt)
          .filter(Boolean)
          .sort()
          .reverse();
        if (times.length) {
          setLatestUpdate(times[0].slice(0, 10));
        }
      }
    } catch {}
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ===== 表格列 =====
  const columns: ProColumns<any>[] = [
    // ---- 排序 ----
    {
      title: '排序',
      dataIndex: 'sortOrder',
      width: 60,
      align: 'center',
      render: (v) => (
        <Tag style={{ borderRadius: 10, minWidth: 24, textAlign: 'center' }}>
          {v ?? '-'}
        </Tag>
      ),
    },
    // ---- 分类名称（图标 + 名称） ----
    {
      title: '分类名称',
      dataIndex: 'name',
      width: 200,
      render: (_, r) => {
        const bg = CATEGORY_BG[(r.id || 0) % CATEGORY_BG.length];
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 16, flexShrink: 0,
            }}>
              {matchIcon(r.name)}
            </div>
            <div>
              <Text strong style={{ fontSize: 14 }}>{r.name}</Text>
              {r.parentId && Number(r.parentId) > 0 && (
                <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                  子分类 · 父级ID: {r.parentId}
                </Text>
              )}
            </div>
          </div>
        );
      },
    },
    // ---- 商品数 ----
    {
      title: '商品数',
      width: 80,
      align: 'center',
      sorter: (a: any, b: any) => (productCountMap[a.id] || 0) - (productCountMap[b.id] || 0),
      render: (_, r) => {
        const count = productCountMap[r.id];
        if (count === undefined) return <Text type="secondary">-</Text>;
        return (
          <Tag color={count > 0 ? 'blue' : 'default'} style={{ borderRadius: 10, minWidth: 30, textAlign: 'center' }}>
            {count}
          </Tag>
        );
      },
    },
    // ---- 创建时间 ----
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 90,
      align: 'center',
      render: (v) => v ? (
        <Text type="secondary" style={{ fontSize: 12 }}>{v.slice(0, 10)}</Text>
      ) : '-',
    },
    // ---- 操作 ----
    {
      title: '操作',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="查看该分类下的商品">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate('/modules/clothing', { state: { categoryId: record.id, categoryName: record.name } })}
              style={{ color: COLORS.primary }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="编辑分类">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => { setEditing(record); form.setFieldsValue(record); setModalOpen(true); }}
              style={{ color: COLORS.warning }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除此分类？"
            description="如果分类下有商品则无法删除"
            onConfirm={async () => {
              try {
                await categoryApi.delete(record.id);
                message.success('已删除');
                loadData();
              } catch {
                message.error('该分类下有商品，无法删除');
              }
            }}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="删除分类">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ===== 提交表单 =====
  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await categoryApi.update(editing.id, values);
        message.success('分类已更新');
      } else {
        await categoryApi.create(values);
        message.success('分类已创建');
      }
      setModalOpen(false);
      loadData();
    } catch {
      message.error('操作失败');
    }
  };

  // ===== 渲染 =====
  return (
    <div style={{ padding: 0 }}>
      {/* ===== 顶部统计卡片（Ant Design Pro 风格） ===== */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {[
          { title: '分类总数', value: categories.length, icon: CARD_META[0] },
          { title: '启用分类', value: categories.length, icon: CARD_META[1] },
          { title: '最近更新', value: latestUpdate, icon: CARD_META[2] },
        ].map((item) => (
          <Col xs={12} sm={12} md={8} key={item.title}>
            <Card
              hoverable
              style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', position: 'relative' }}
            >
              <div style={{
                position: 'absolute', top: -10, right: -10,
                width: 72, height: 72, borderRadius: '50%',
                background: item.icon.bg, opacity: 0.5,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: item.icon.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, color: item.icon.iconColor, flexShrink: 0,
                }}>
                  {item.icon.icon}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.title}</Text>
                  <div style={{ fontSize: 26, fontWeight: 700, color: item.title === '最近更新' ? COLORS.warning : item.icon.iconColor, lineHeight: 1.3 }}>
                    {item.value}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ===== 分类表格 ===== */}
      <Card
        style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        styles={{ body: { padding: '16px 24px' } }}
      >
        <ProTable
          actionRef={actionRef}
          columns={columns}
          dataSource={categories}
          rowKey="id"
          search={false}
          pagination={false}
          toolBarRender={() => [
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditing(null);
                form.resetFields();
                form.setFieldsValue({ sortOrder: (categories.length || 0) + 1 });
                setModalOpen(true);
              }}
              style={{
                background: COLORS.primary,
                borderColor: COLORS.primary,
                boxShadow: '0 2px 6px rgba(31,95,168,0.25)',
              }}
            >
              新增分类
            </Button>,
          ]}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    暂无分类数据
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>点击「新增分类」开始添加</Text>
                  </span>
                }
              />
            ),
          }}
        />
      </Card>

      {/* ===== 新增/编辑弹窗 ===== */}
      <Modal
        title={
          <Space>
            {editing ? <EditOutlined /> : <PlusOutlined />}
            <span>{editing ? '编辑分类' : '新增分类'}</span>
          </Space>
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={480}
        okText={editing ? '保存修改' : '创建分类'}
        cancelText="取消"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 8 }}
          initialValues={{ sortOrder: 1 }}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[
              { required: true, message: '请输入分类名称' },
              { max: 50, message: '名称不超过50字' },
            ]}
          >
            <Input placeholder="如：苗绣、蜡染、银饰" maxLength={50} showCount />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sortOrder" label="排序序号（越小越靠前）">
                <InputNumber min={0} max={999} precision={0} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="parentId" label="父级分类 ID" tooltip="0=顶级分类">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="0（顶级）" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="icon" label="图标 URL" tooltip="可选，上传分类图标图片的地址">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
