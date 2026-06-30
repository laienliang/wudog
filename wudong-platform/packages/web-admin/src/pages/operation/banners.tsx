import React, { useState, useRef } from 'react';
import {
  Button, Modal, Form, Input, InputNumber, message, Popconfirm, Tag,
  Card, Space, Typography, Tooltip, Empty, Image, Switch,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined,
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
   轮播图管理
   ============================================================ */
const BannerList: React.FC = () => {
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
      title: '标题',
      dataIndex: 'title',
      width: 200,
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image
            src={r.imageUrl}
            width={56}
            height={40}
            style={{ borderRadius: 6, objectFit: 'cover', border: '1px solid #f0f0f0' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
          <Text strong style={{ fontSize: 14 }}>{r.title || '未命名'}</Text>
        </div>
      ),
    },
    {
      title: '链接地址',
      dataIndex: 'linkUrl',
      width: 260,
      ellipsis: true,
      render: (v) => v ? (
        <Text copyable style={{ fontSize: 12 }}>{v}</Text>
      ) : <Text type="secondary">-</Text>,
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
          checkedChildren="上架"
          unCheckedChildren="下架"
          onChange={async (checked) => {
            try {
              await adminApi.updateBanner(r.id, { status: checked ? 1 : 0 });
              message.success(checked ? '已上架' : '已下架');
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
            title="确定删除该轮播图？"
            onConfirm={async () => {
              try {
                await adminApi.deleteBanner(r.id);
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
            const res = await adminApi.listBanners();
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
            新增轮播图
          </Button>,
        ]}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>暂无轮播图数据<br /><Text type="secondary" style={{ fontSize: 12 }}>点击「新增轮播图」添加首页轮播</Text></span>}
            />
          ),
        }}
        pagination={false}
        options={{
          density: true,
          reload: true,
          setting: true,
        }}
      />

      <Modal
        title={
          <Space>
            <PictureOutlined style={{ color: COLORS.primary }} />
            <span>{editing ? '编辑轮播图' : '新增轮播图'}</span>
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
              const payload = { ...values, sortOrder: Number(values.sortOrder) };
              if (editing) {
                await adminApi.updateBanner(editing.id, payload);
                message.success('已更新');
              } else {
                await adminApi.createBanner(payload);
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
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入轮播图标题' }]}
          >
            <Input placeholder="请输入轮播图标题" />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label="图片 URL"
            rules={[{ required: true, message: '请上传轮播图' }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item
            name="linkUrl"
            label="跳转链接"
          >
            <Input placeholder="https://...（可选）" />
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
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BannerList;
