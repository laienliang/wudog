import React, { useState, useRef } from 'react';
import {
  Button, Modal, Form, Input, message, Popconfirm, Tag,
  Card, Space, Typography, Tooltip, Empty, Select,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, BellOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import dayjs from 'dayjs';
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
   公告管理
   ============================================================ */
const AnnouncementList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  const fetchAnnouncements = async (params: any) => {
    const { current, pageSize, ...rest } = params;
    try {
      const res = await adminApi.listAnnouncements({
        page: current,
        pageSize,
        ...rest,
      });
      const data = res.data || res;
      const list = data.list || [];
      const pagination = data.pagination || { total: 0 };
      return { data: list, success: true, total: pagination.total || 0 };
    } catch {
      return { data: [], success: false, total: 0 };
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 70,
      align: 'center',
      render: (v) => <Text code style={{ fontSize: 12 }}>{v}</Text>,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 300,
      ellipsis: true,
      render: (v) => <Text strong>{v || '未命名公告'}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        1: { text: '已发布', status: 'Success' },
        0: { text: '草稿', status: 'Default' },
      },
      render: (v) => v === 1
        ? <Tag color="success" style={{ borderRadius: 4 }}>已发布</Tag>
        : <Tag style={{ borderRadius: 4 }}>草稿</Tag>,
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      width: 150,
      align: 'center',
      render: (v) => v
        ? <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(v).format('YYYY-MM-DD HH:mm')}</Text>
        : <Text type="secondary">-</Text>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 150,
      align: 'center',
      sorter: true,
      render: (v) => v
        ? <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(v).format('YYYY-MM-DD HH:mm')}</Text>
        : '-',
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
            title="确定删除该公告？"
            onConfirm={async () => {
              try {
                await adminApi.deleteAnnouncement(r.id);
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
        request={fetchAnnouncements}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: true,
          collapseRender: (collapsed) => collapsed ? '展开筛选' : '收起筛选',
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(null);
              form.resetFields();
              form.setFieldsValue({ status: 0 });
              setModalOpen(true);
            }}
            style={{ boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}
          >
            新增公告
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`,
        }}
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
              description={<span>暂无公告数据<br /><Text type="secondary" style={{ fontSize: 12 }}>点击「新增公告」发布平台公告</Text></span>}
            />
          ),
        }}
        sticky={{ offsetHeader: 0 }}
      />

      <Modal
        title={
          <Space>
            <BellOutlined style={{ color: COLORS.primary }} />
            <span>{editing ? '编辑公告' : '新增公告'}</span>
          </Space>
        }
        open={modalOpen}
        onOk={() => form.submit()}
        onCancel={() => setModalOpen(false)}
        width={640}
        destroyOnClose
        okText={editing ? '保存' : '创建'}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            try {
              if (editing) {
                await adminApi.updateAnnouncement(editing.id, values);
                message.success('已更新');
              } else {
                await adminApi.createAnnouncement(values);
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
            label="公告标题"
            rules={[{ required: true, message: '请输入公告标题' }]}
          >
            <Input placeholder="请输入公告标题" />
          </Form.Item>
          <Form.Item
            name="content"
            label="公告内容"
            rules={[{ required: true, message: '请输入公告内容' }]}
          >
            <Input.TextArea rows={6} placeholder="请输入公告内容" />
          </Form.Item>
          <Form.Item
            name="status"
            label="发布状态"
            rules={[{ required: true, message: '请选择发布状态' }]}
          >
            <Select
              placeholder="请选择状态"
              options={[
                { label: '草稿', value: 0 },
                { label: '已发布', value: 1 },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AnnouncementList;
