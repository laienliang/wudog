import React, { useState, useRef } from 'react';
import {
  Button, Modal, Form, Input, message, Popconfirm, Tag, Space, Typography, Tooltip, Empty,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, WarningOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import dayjs from 'dayjs';
import { adminApi } from '../../services/admin';

const { Text } = Typography;

/* ============================================================
   品牌色系统
   ============================================================ */
const COLORS = {
  primary: '#1F5FA8',
  success: '#6B8E3D',
  warning: '#E8A838',
  danger: '#D94A4A',
  textSecondary: '#8C8C8C',
};

/* ============================================================
   敏感词管理
   ============================================================ */
const SensitiveWords: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  // 自定义请求
  const fetchWords = async () => {
    try {
      const res = await adminApi.listSensitiveWords();
      const list = Array.isArray(res) ? res : (res?.data?.list || res?.data || []);
      return { data: Array.isArray(list) ? list : [], success: true };
    } catch {
      return { data: [], success: false };
    }
  };

  // 表格列配置
  const columns: ProColumns<any>[] = [
    {
      title: '敏感词',
      dataIndex: 'word',
      width: 280,
      render: (v) => (
        <Space>
          <WarningOutlined style={{ color: COLORS.danger, fontSize: 16 }} />
          <Text strong code style={{ fontSize: 14 }}>{v || '-'}</Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      align: 'center',
      render: (v) => v !== 0 ? (
        <Tag color="success" style={{ borderRadius: 4 }}>启用</Tag>
      ) : (
        <Tag color="default" style={{ borderRadius: 4 }}>禁用</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 140,
      align: 'center',
      render: (v) => v ? (
        <Tooltip title={dayjs(v).format('YYYY-MM-DD HH:mm:ss')}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(v).format('YYYY-MM-DD HH:mm')}
          </Text>
        </Tooltip>
      ) : '-',
    },
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: (_, r) => (
        <Popconfirm
          title="确定删除该敏感词？"
          description="删除后系统将不再屏蔽该词"
          onConfirm={async () => {
            try {
              await adminApi.deleteSensitiveWord(r.id);
              message.success('已删除');
              actionRef.current?.reload();
            } catch {
              message.error('删除失败');
            }
          }}
        >
          <Tooltip title="删除">
            <Button type="text" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Tooltip>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        request={fetchWords}
        search={false}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setModalOpen(true);
            }}
            style={{ boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}
          >
            新增敏感词
          </Button>,
        ]}
        pagination={false}
        options={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>暂无敏感词<br /><Text type="secondary" style={{ fontSize: 12 }}>点击「新增敏感词」添加需要屏蔽的词汇</Text></span>}
            />
          ),
        }}
      />

      {/* ===== 新增敏感词弹窗 ===== */}
      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: COLORS.warning }} />
            <span>新增敏感词</span>
          </Space>
        }
        open={modalOpen}
        onOk={() => form.submit()}
        onCancel={() => setModalOpen(false)}
        width={420}
        destroyOnClose
        okText="添加"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            try {
              const res = await adminApi.createSensitiveWord(values);
              if (res.data?.success === false) {
                message.error(res.data.message || '添加失败');
                return;
              }
              message.success('敏感词已添加');
              setModalOpen(false);
              actionRef.current?.reload();
            } catch {
              message.error('添加失败');
            }
          }}
        >
          <Form.Item
            name="word"
            label="敏感词"
            rules={[
              { required: true, message: '请输入敏感词' },
              { min: 1, max: 50, message: '敏感词长度在 1-50 个字符之间' },
            ]}
          >
            <Input placeholder="请输入需要屏蔽的敏感词" maxLength={50} />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            initialValue={1}
            hidden
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SensitiveWords;
