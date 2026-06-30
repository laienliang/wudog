import React, { useRef, useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, Select, DatePicker, message, Tag, Space, Empty, Typography, Switch } from 'antd';
import {
  PlusOutlined, ReloadOutlined, PictureOutlined, LinkOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import dayjs from 'dayjs';
import { adminApi } from '../../services/admin';

const { Text } = Typography;

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
   活动横幅管理组件
   ============================================================ */
const ActivityBannerList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  // 请求数据
  const fetchList = async () => {
    try {
      const res = await adminApi.listActivityBanners();
      const list = Array.isArray(res) ? res : (res.data || res.list || []);
      return { data: list, success: true, total: list.length };
    } catch {
      return { data: [], success: false, total: 0 };
    }
  };

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ status: 1, sortOrder: 0 });
    setModalOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : undefined,
      endDate: record.endDate ? dayjs(record.endDate) : undefined,
    });
    setModalOpen(true);
  };

  // 提交保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : undefined,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : undefined,
      };
      if (editingRecord) {
        await adminApi.updateActivityBanner(editingRecord.id, data);
        message.success('活动横幅已更新');
      } else {
        await adminApi.createActivityBanner(data);
        message.success('活动横幅已创建');
      }
      setModalOpen(false);
      actionRef.current?.reload();
    } catch {
      // Form validation error, no need to show message
    }
  };

  // 删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该活动横幅吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await adminApi.deleteActivityBanner(id);
        message.success('已删除');
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<any>[] = [
    {
      title: '排序',
      dataIndex: 'sortOrder',
      width: 60,
      align: 'center',
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 200,
      ellipsis: true,
      render: (_, r) => (
        <Space>
          <PictureOutlined style={{ color: COLORS.primary }} />
          <Text strong>{r.title || '-'}</Text>
        </Space>
      ),
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      width: 120,
      align: 'center',
      render: (v: string) => v ? (
        <img
          src={v}
          alt="banner"
          style={{ width: 80, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }}
        />
      ) : <Text type="secondary">无</Text>,
    },
    {
      title: '链接',
      dataIndex: 'linkUrl',
      width: 180,
      ellipsis: true,
      render: (v: string) => v ? (
        <Space>
          <LinkOutlined style={{ color: COLORS.primary }} />
          <Text copyable style={{ fontSize: 12 }}>{v}</Text>
        </Space>
      ) : '-',
    },
    {
      title: '有效期',
      dataIndex: 'startDate',
      width: 200,
      render: (_, r) => {
        const start = r.startDate ? dayjs(r.startDate).format('YYYY-MM-DD') : '-';
        const end = r.endDate ? dayjs(r.endDate).format('YYYY-MM-DD') : '-';
        return <Text type="secondary">{start} ~ {end}</Text>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      align: 'center',
      render: (v: number) => v === 1
        ? <Tag color="success">上架</Tag>
        : <Tag color="default">下架</Tag>,
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
        pagination={false}
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
            新增横幅
          </Button>,
        ]}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>暂无活动横幅<br /><Text type="secondary" style={{ fontSize: 12 }}>点击「新增横幅」添加首页活动推广</Text></span>}
            />
          ),
        }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRecord ? '编辑活动横幅' : '新增活动横幅'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        width={600}
        destroyOnClose
        okText="保存"
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入活动标题" maxLength={100} />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="图片 URL"
            rules={[{ required: true, message: '请输入图片 URL' }]}
          >
            <Input placeholder="https://example.com/banner.jpg" />
          </Form.Item>

          <Form.Item
            name="linkUrl"
            label="链接 URL"
          >
            <Input placeholder="点击跳转链接（可选）" />
          </Form.Item>

          <Space size={16} style={{ display: 'flex' }} align="start">
            <Form.Item
              name="startDate"
              label="开始日期"
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} placeholder="选择开始日期" />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="结束日期"
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} placeholder="选择结束日期" />
            </Form.Item>
          </Space>

          <Space size={16} style={{ display: 'flex' }} align="start">
            <Form.Item
              name="sortOrder"
              label="排序权重"
              tooltip="数字越小越靠前"
              style={{ flex: 1 }}
            >
              <InputNumber min={0} max={999} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              style={{ flex: 1 }}
            >
              <Select>
                <Select.Option value={1}>上架</Select.Option>
                <Select.Option value={0}>下架</Select.Option>
              </Select>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default ActivityBannerList;
