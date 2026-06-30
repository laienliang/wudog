import React, { useState, useRef } from 'react';
import {
  Button, Modal, Form, Input, Select, message, Tag, Space, Card, Typography, Tooltip, Empty, Tabs,
} from 'antd';
import {
  PlusOutlined, ReloadOutlined, SendOutlined, MessageOutlined, FileTextOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import dayjs from 'dayjs';
import { adminApi } from '../../services/admin';
import MessageTemplates from './templates';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

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
   消息类型映射
   ============================================================ */
const MESSAGE_TYPE_MAP: Record<string, { text: string; color: string }> = {
  notice: { text: '公告通知', color: 'blue' },
  promotion: { text: '营销推广', color: 'orange' },
  system: { text: '系统消息', color: 'cyan' },
  warning: { text: '预警提醒', color: 'red' },
};

/* ============================================================
   消息发送页面（原内容）
   ============================================================ */
const MessageSendPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  // 自定义请求
  const fetchMessages = async (params: any) => {
    const { current, pageSize, ...rest } = params;
    try {
      const res = await adminApi.listMessages({
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

  // 表格列配置
  const columns: ProColumns<any>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 240,
      ellipsis: true,
      render: (_, r) => (
        <Space>
          <MessageOutlined style={{ color: COLORS.primary, fontSize: 16 }} />
          <Text strong>{r.title || '无标题'}</Text>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      align: 'center',
      render: (v) => {
        const typeInfo = MESSAGE_TYPE_MAP[v] || { text: v || '未知', color: 'default' };
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      },
    },
    {
      title: '发送对象',
      dataIndex: 'recipient',
      width: 160,
      ellipsis: true,
      render: (v) => {
        if (v === 'all' || v === '*') {
          return <Tag color="geekblue">全体用户</Tag>;
        }
        return <Text copyable>{v ? `用户ID: ${v}` : '-'}</Text>;
      },
    },
    {
      title: '已读/未读',
      dataIndex: 'readCount',
      width: 110,
      align: 'center',
      render: (v, r) => {
        const sent = r.totalCount || r.recipientCount || 0;
        const read = v || 0;
        const unread = Math.max(0, sent - read);
        return (
          <Space size={4}>
            <Tag color="success" style={{ borderRadius: 4 }}>{read} 已读</Tag>
            {unread > 0 && <Tag color="default" style={{ borderRadius: 4 }}>{unread} 未读</Tag>}
          </Space>
        );
      },
    },
    {
      title: '发送时间',
      dataIndex: 'createdAt',
      width: 140,
      align: 'center',
      sorter: true,
      render: (v) => v ? (
        <Tooltip title={dayjs(v).format('YYYY-MM-DD HH:mm:ss')}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(v).format('YYYY-MM-DD HH:mm')}
          </Text>
        </Tooltip>
      ) : '-',
    },
  ];

  return (
    <div style={{ padding: 0 }}>
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
          request={fetchMessages}
          search={false}
          toolBarRender={() => [
            <Button
              key="refresh"
              icon={<ReloadOutlined />}
              onClick={() => actionRef.current?.reload()}
            >
              刷新
            </Button>,
            <Button
              key="send"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                setModalOpen(true);
              }}
              style={{ boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}
            >
              发送新消息
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
                description={<span>暂无消息数据<br /><Text type="secondary" style={{ fontSize: 12 }}>点击「发送新消息」给用户发送通知</Text></span>}
              />
            ),
          }}
          sticky={{ offsetHeader: 0 }}
        />
      </Card>

      {/* ===== 发送消息弹窗 ===== */}
      <Modal
        title={
          <Space>
            <SendOutlined style={{ color: COLORS.primary }} />
            <span>发送新消息</span>
          </Space>
        }
        open={modalOpen}
        onOk={() => form.submit()}
        onCancel={() => setModalOpen(false)}
        width={560}
        destroyOnClose
        okText="发送"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            try {
              await adminApi.sendMessage(values);
              message.success('消息发送成功');
              setModalOpen(false);
              actionRef.current?.reload();
            } catch {
              message.error('发送失败');
            }
          }}
        >
          <Form.Item
            name="recipient"
            label="发送对象"
            rules={[{ required: true, message: '请选择发送对象' }]}
          >
            <Select placeholder="请选择发送对象">
              <Select.Option value="all">全体用户</Select.Option>
              <Select.Option value="user">指定用户</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.recipient !== curr.recipient}
          >
            {({ getFieldValue }) =>
              getFieldValue('recipient') === 'user' ? (
                <Form.Item
                  name="userId"
                  label="用户 ID"
                  rules={[{ required: true, message: '请输入用户ID' }]}
                >
                  <Input placeholder="请输入用户 ID" type="number" />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            name="type"
            label="消息类型"
            rules={[{ required: true, message: '请选择消息类型' }]}
            initialValue="notice"
          >
            <Select placeholder="请选择消息类型">
              {Object.entries(MESSAGE_TYPE_MAP).map(([key, val]) => (
                <Select.Option key={key} value={key}>{val.text}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入消息标题' }]}
          >
            <Input placeholder="请输入消息标题" maxLength={100} />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入消息内容' }]}
          >
            <TextArea
              placeholder="请输入消息内容"
              rows={4}
              maxLength={2000}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

/* ============================================================
   消息中心页面 - Tab 容器
   ============================================================ */
const MessagePage: React.FC = () => {
  const [activeKey, setActiveKey] = useState('send');

  return (
    <div style={{ padding: 0 }}>
      <Card
        style={{
          borderRadius: 10,
          border: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          marginBottom: 16,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          style={{ margin: 0, padding: '0 24px' }}
          items={[
            {
              key: 'send',
              label: <span><SendOutlined /> 消息发送</span>,
              children: <MessageSendPage />,
            },
            {
              key: 'templates',
              label: <span><FileTextOutlined /> 消息模板</span>,
              children: <MessageTemplates />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default MessagePage;
