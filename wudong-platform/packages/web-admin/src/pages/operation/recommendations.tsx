import React, { useState, useRef } from 'react';
import {
  Button, Modal, Form, Input, InputNumber, message, Popconfirm, Tag,
  Card, Space, Typography, Tooltip, Empty, Select, Switch,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, StarOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { adminApi } from '../../services/admin';

const { Text } = Typography;
const COLORS = {
  primary: '#1F5FA8',
  success: '#6B8E3D',
  warning: '#E8A838',
  danger: '#D94A4A',
  textSecondary: '#8C8C8C',
};

/* ============================================================
   推荐内容类型映射
   ============================================================ */
const CONTENT_TYPES: Record<string, { label: string; color: string }> = {
  product: { label: '商品', color: 'blue' },
  restaurant: { label: '餐厅', color: 'orange' },
  homestay: { label: '民宿', color: 'purple' },
  route: { label: '路线', color: 'cyan' },
  travelogue: { label: '游记', color: 'green' },
};

const CONTENT_TYPE_OPTIONS = Object.entries(CONTENT_TYPES).map(([value, { label }]) => ({
  label,
  value,
}));

/* ============================================================
   推荐位管理
   ============================================================ */
const RecommendationList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = [
    {
      title: '排序',
      dataIndex: 'sortOrder',
      width: 80,
      align: 'center',
      render: (v) => <Tag style={{ borderRadius: 10, minWidth: 28, textAlign: 'center' }}>{v ?? '-'}</Tag>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 220,
      render: (v) => <Text strong style={{ fontSize: 14 }}>{v || '未命名'}</Text>,
    },
    {
      title: '关联类型',
      dataIndex: 'contentType',
      width: 120,
      align: 'center',
      render: (v) => {
        const type = CONTENT_TYPES[v] || { label: v || '未知', color: 'default' };
        return <Tag color={type.color} style={{ borderRadius: 4 }}>{type.label}</Tag>;
      },
    },
    {
      title: '关联 ID',
      dataIndex: 'contentId',
      width: 100,
      align: 'center',
      render: (v) => v ? <Text code style={{ fontSize: 12 }}>{v}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (v, r) => (
        <Switch
          checked={v === 1}
          size="small"
          checkedChildren="显示"
          unCheckedChildren="隐藏"
          onChange={async (checked) => {
            try {
              await adminApi.updateRecommendation(r.id, { status: checked ? 1 : 0 });
              message.success(checked ? '已显示' : '已隐藏');
              actionRef.current?.reload();
            } catch {
              message.error('操作失败');
            }
          }}
          style={{ backgroundColor: v === 1 ? COLORS.success : undefined }}
        />
      ),
    },
    {
      title: '操作',
      width: 160,
      align: 'center',
      render: (_, r) => (
        <Space size={0}>
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditing(r);
                form.setFieldsValue(r);
                setModalOpen(true);
              }}
              style={{ color: COLORS.warning }}
            />
          </Tooltip>
          <Popconfirm
            title="确定删除该推荐位？"
            onConfirm={async () => {
              try {
                await adminApi.deleteRecommendation(r.id);
                message.success('已删除');
                actionRef.current?.reload();
              } catch {
                message.error('删除失败');
              }
            }}
          >
            <Tooltip title="删除">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
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
        search={false}
        request={async () => {
          try {
            const res = await adminApi.listRecommendations();
            const list = res?.data?.list || res?.data || res || [];
            return { data: Array.isArray(list) ? list : [], success: true };
          } catch {
            return { data: [], success: false };
          }
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(null);
              form.resetFields();
              form.setFieldsValue({ status: 1, sortOrder: 0 });
              setModalOpen(true);
            }}
            style={{ boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}
          >
            新增推荐
          </Button>,
        ]}
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>暂无推荐位数据<br /><Text type="secondary" style={{ fontSize: 12 }}>点击「新增推荐」设置首页推荐内容</Text></span>}
            />
          ),
        }}
        options={{
          density: true,
          reload: true,
          setting: true,
        }}
      />

      <Modal
        title={
          <Space>
            <StarOutlined style={{ color: COLORS.primary }} />
            <span>{editing ? '编辑推荐位' : '新增推荐位'}</span>
          </Space>
        }
        open={modalOpen}
        onOk={() => form.submit()}
        onCancel={() => setModalOpen(false)}
        width={560}
        destroyOnClose
        okText={editing ? '保存' : '创建'}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            try {
              const payload = {
                ...values,
                sortOrder: Number(values.sortOrder),
                contentId: Number(values.contentId),
              };
              if (editing) {
                await adminApi.updateRecommendation(editing.id, payload);
                message.success('已更新');
              } else {
                await adminApi.createRecommendation(payload);
                message.success('已创建');
              }
              setModalOpen(false);
              actionRef.current?.reload();
            } catch {
              message.error('操作失败');
            }
          }}
        >
          <Form.Item
            name="name"
            label="推荐名称"
            rules={[{ required: true, message: '请输入推荐名称' }]}
          >
            <Input placeholder="请输入推荐名称" />
          </Form.Item>
          <Form.Item
            name="contentType"
            label="关联类型"
            rules={[{ required: true, message: '请选择关联类型' }]}
          >
            <Select
              placeholder="请选择关联类型"
              options={CONTENT_TYPE_OPTIONS}
            />
          </Form.Item>
          <Form.Item
            name="contentId"
            label="关联 ID"
            rules={[{ required: true, message: '请输入关联内容 ID' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入关联内容 ID" />
          </Form.Item>
          <Form.Item
            name="sortOrder"
            label="排序权重"
            tooltip="数字越小越靠前"
          >
            <InputNumber min={0} max={999} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            getValueFromEvent={(checked: boolean) => checked ? 1 : 0}
            getValueProps={(v: number) => ({ checked: v === 1 })}
          >
            <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default RecommendationList;
