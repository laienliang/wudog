import React, { useRef, useState } from 'react';
import { Button, Modal, Form, Input, Select, message, Tag, Space, Empty, Typography } from 'antd';
import {
  PlusOutlined, ReloadOutlined, FileTextOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import dayjs from 'dayjs';
import { adminApi } from '../../services/admin';

const { Text } = Typography;
const { TextArea } = Input;

/* ============================================================
   品牌色
   ============================================================ */
const COLORS = {
  primary: '#1F5FA8',
  success: '#6B8E3D',
  warning: '#E8A838',
  danger: '#D94A4A',
};

/* ============================================================
   模板类型映射
   ============================================================ */
const TEMPLATE_TYPE_MAP: Record<string, { text: string; color: string }> = {
  order: { text: '订单', color: 'blue' },
  payment: { text: '支付', color: 'green' },
  refund: { text: '退款', color: 'red' },
  notice: { text: '通知', color: 'orange' },
};

/* ============================================================
   消息模板管理页面
   ============================================================ */
const MessageTemplates: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  // 请求数据
  const fetchList = async (params: any) => {
    const { current, pageSize, ...rest } = params;
    try {
      const res = await adminApi.listMessageTemplates({
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

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ status: 1, type: 'notice' });
    setModalOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  // 提交保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await adminApi.updateMessageTemplate(editingRecord.id, values);
        message.success('模板已更新');
      } else {
        await adminApi.createMessageTemplate(values);
        message.success('模板已创建');
      }
      setModalOpen(false);
      actionRef.current?.reload();
    } catch {
      // Form validation error
    }
  };

  // 删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该消息模板吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await adminApi.deleteMessageTemplate(id);
        message.success('已删除');
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<any>[] = [
    {
      title: '模板名称',
      dataIndex: 'name',
      width: 180,
      ellipsis: true,
      render: (_, r) => (
        <Space>
          <FileTextOutlined style={{ color: COLORS.primary }} />
          <Text strong>{r.name}</Text>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      align: 'center',
      render: (v: string) => {
        const info = TEMPLATE_TYPE_MAP[v] || { text: v || '未知', color: 'default' };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 240,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      align: 'center',
      render: (v: number) => v === 1
        ? <Tag color="success">启用</Tag>
        : <Tag color="default">禁用</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 140,
      align: 'center',
      render: (v: any) => v ? (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {dayjs(v).format('YYYY-MM-DD HH:mm')}
        </Text>
      ) : '-',
    },
    {
      title: '操作',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '16px 0' }}>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={fetchList}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`,
        }}
        toolBarRender={() => [
          <Button
            key="refresh"
            icon={<ReloadOutlined />}
            onClick={() => actionRef.current?.reload()}
          >
            刷新
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}
          >
            新增模板
          </Button>,
        ]}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>暂无消息模板<br /><Text type="secondary" style={{ fontSize: 12 }}>点击「新增模板」创建消息通知模板</Text></span>}
            />
          ),
        }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRecord ? '编辑消息模板' : '新增消息模板'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        width={560}
        destroyOnClose
        okText="保存"
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="例如：订单支付成功通知" maxLength={100} />
          </Form.Item>

          <Form.Item
            name="type"
            label="模板类型"
            rules={[{ required: true, message: '请选择模板类型' }]}
          >
            <Select placeholder="请选择类型">
              {Object.entries(TEMPLATE_TYPE_MAP).map(([key, val]) => (
                <Select.Option key={key} value={key}>{val.text}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="消息标题"
            rules={[{ required: true, message: '请输入消息标题' }]}
          >
            <Input placeholder="请输入消息标题" maxLength={200} />
          </Form.Item>

          <Form.Item
            name="content"
            label="消息内容"
            rules={[{ required: true, message: '请输入消息内容' }]}
          >
            <TextArea
              placeholder="请输入消息内容，支持变量如 {username}、{amount}"
              rows={4}
              maxLength={2000}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
          >
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MessageTemplates;
