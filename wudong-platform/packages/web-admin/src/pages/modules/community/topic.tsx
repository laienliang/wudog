import React, { useState, useRef } from 'react';
import { Button, Modal, Form, Input, InputNumber, message, Popconfirm, Tag, Card, Space, Typography, Empty, Tooltip, Avatar, Badge } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { communityApi } from '../../../services/community';

const { Text } = Typography;
const { Search } = Input;
const COLORS = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A' };

const TOPIC_BG = ['#1F5FA8', '#6B8E3D', '#E8A838', '#D94A4A', '#9B59B6', '#1ABC9C', '#E67E22', '#2C3E50'];

const TopicTab: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [searchText, setSearchText] = useState('');

  const columns: ProColumns<any>[] = [
    {
      title: '#', width: 40, align: 'center',
      render: (_: any, _r: any, i: number) => (
        <Tag style={{ borderRadius: 6, minWidth: 18, textAlign: 'center', fontSize: 10 }}>{i + 1}</Tag>
      ),
    },
    {
      title: '话题名称', dataIndex: 'name', width: 260,
      render: (v, r) => {
        const bg = TOPIC_BG[(r.id || 0) % TOPIC_BG.length];
        return (
          <Space>
            {r.icon ? (
              <Avatar src={r.icon} size={36} style={{ borderRadius: 8 }} />
            ) : (
              <Avatar size={36} style={{ backgroundColor: bg, borderRadius: 8, fontSize: 15, fontWeight: 600 }}>
                {(v || '#').charAt(0)}
              </Avatar>
            )}
            <div>
              <Text strong style={{ fontSize: 14, color: '#1A1A1A' }}>{v}</Text>
              <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>ID: {r.id}</Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: '图标', dataIndex: 'icon', width: 100, ellipsis: true,
      render: (v) => v ? <Text code style={{ fontSize: 10 }}>{v}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: '排序', dataIndex: 'sortOrder', width: 80, align: 'center', sorter: true,
      render: (v) => (
        <Tag color="blue" style={{ borderRadius: 4, fontSize: 11, minWidth: 30, textAlign: 'center' }}>
          <ArrowUpOutlined style={{ fontSize: 10 }} /> {v ?? 0} <ArrowDownOutlined style={{ fontSize: 10 }} />
        </Tag>
      ),
    },
    {
      title: '状态', width: 80, align: 'center',
      render: () => (
        <Space size={4}>
          <Badge status="success" />
          <Text style={{ fontSize: 13 }}>启用中</Text>
        </Space>
      ),
    },
    {
      title: '创建时间', dataIndex: 'createdAt', width: 80,
      render: (v) => v ? <Text type="secondary" style={{ fontSize: 12 }}>{String(v).slice(0, 10)}</Text> : '-',
    },
    {
      title: '操作', width: 160, align: 'center',
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="编辑话题">
            <Button type="primary" ghost size="small" icon={<EditOutlined />}
              onClick={() => { setEditing(r); form.setFieldsValue(r); setModalOpen(true); }}
              style={{ borderRadius: 6, fontSize: 12 }}>编辑</Button>
          </Tooltip>
          <Popconfirm title="确定删除此话题？" description="删除后不可恢复"
            onConfirm={async () => { await communityApi.deleteTopic(r.id); message.success('已删除'); actionRef.current?.reload(); }}
            okText="删除" cancelText="取消" okButtonProps={{ danger: true }}>
            <Tooltip title="删除话题">
              <Button type="primary" danger ghost size="small" icon={<DeleteOutlined />} style={{ borderRadius: 6, fontSize: 12 }}>删除</Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        styles={{ body: { padding: '16px 24px' } }}>
        <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
          request={async () => {
            try {
              const res = await communityApi.listTopics();
              let list = res?.data || res || [];
              if (!Array.isArray(list)) list = [];
              if (searchText) list = list.filter((r: any) => (r.name || '').includes(searchText));
              return { data: list, success: true, total: list.length };
            } catch { return { data: [], success: false }; }
          }}
          toolbar={{
            filter: (
              <Search placeholder="搜索话题名称" allowClear style={{ width: 220 }}
                prefix={<SearchOutlined />} value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onSearch={() => actionRef.current?.reload()} />
            ),
          }}
          toolBarRender={() => [
            <Button key="batch" disabled style={{ marginRight: 8 }}>批量排序</Button>,
            <Button key="add" type="primary" icon={<PlusOutlined />}
              onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }}
              style={{ background: COLORS.primary, borderColor: COLORS.primary, boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}>
              新增话题
            </Button>,
          ]}
          pagination={{
            pageSize: 10, showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`,
          }}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无话题" /> }}
        />
      </Card>

      <Modal title={editing ? '编辑话题' : '新增话题'} open={modalOpen}
        onOk={() => form.submit()} onCancel={() => setModalOpen(false)}
        width={520} destroyOnClose okText={editing ? '保存修改' : '创建话题'} cancelText="取消">
        <Form form={form} layout="vertical" onFinish={async (values) => {
          try {
            editing ? await communityApi.updateTopic(editing.id, values) : await communityApi.createTopic(values);
            message.success(editing ? '已更新' : '已创建'); setModalOpen(false); actionRef.current?.reload();
          } catch { message.error('操作失败'); }
        }}>
          <Form.Item name="name" label="话题名称" rules={[{ required: true, message: '请输入话题名称' }]}>
            <Input placeholder="如：苗寨风光、美食探店" maxLength={50} showCount />
          </Form.Item>
          <Form.Item name="icon" label="图标 URL" tooltip="可选，建议上传 100x100 的方形图标">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序权重（数字越小越靠前）" tooltip="排序影响前端话题列表的展示顺序">
            <InputNumber min={0} max={999} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default TopicTab;
