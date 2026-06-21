/**
 * 敏感词库页面
 * 展示平台敏感词列表，支持搜索、新增、编辑、删除和批量导入操作
 * 敏感词用于内容审核时自动过滤违规内容
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Select, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ImportOutlined } from '@ant-design/icons';
import request from '../../utils/request';

/**
 * 敏感词库管理页面组件
 * 提供敏感词的增删改查和批量导入功能
 */
export default function SensitiveWordListPage() {
  /** 敏感词列表数据 */
  const [data, setData] = useState<any[]>([]);
  /** 数据总条数 */
  const [total, setTotal] = useState(0);
  /** 当前页码 */
  const [page, setPage] = useState(1);
  /** 每页条数 */
  const [pageSize, setPageSize] = useState(20);
  /** 数据加载状态 */
  const [loading, setLoading] = useState(false);
  /** 新增/编辑弹窗显示状态 */
  const [modalOpen, setModalOpen] = useState(false);
  /** 当前编辑的记录，null 表示新增 */
  const [editing, setEditing] = useState<any>(null);
  /** 表单实例 */
  const [form] = Form.useForm();
  /** 批量导入弹窗显示状态 */
  const [importOpen, setImportOpen] = useState(false);
  /** 批量导入表单实例 */
  const [importForm] = Form.useForm();

  /** 加载敏感词列表数据 */
  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/sensitive-words/list', { params: { page, pageSize } });
      if (res.code === 200) { setData(res.data.list); setTotal(res.data.total); }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [page, pageSize]);

  /**
   * 打开新增/编辑弹窗
   * @param record - 编辑时传入已有记录，不传则为新增模式
   */
  const openModal = (record?: any) => {
    setEditing(record || null);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
    setModalOpen(true);
  };

  /** 提交表单，根据 editing 状态决定调用新增或编辑接口 */
  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        const res: any = await request.put(`/sensitive-words/update/${editing.id}`, values);
        if (res.code === 200) { message.success('更新成功'); setModalOpen(false); loadData(); }
        else message.error(res.message);
      } else {
        const res: any = await request.post('/sensitive-words/create', values);
        if (res.code === 200) { message.success('创建成功'); setModalOpen(false); loadData(); }
        else message.error(res.message);
      }
    } catch (err: any) { message.error(err?.response?.data?.message || '操作失败'); }
  };

  /**
   * 删除敏感词
   * @param id - 敏感词 ID
   */
  const handleDelete = async (id: number) => {
    const res: any = await request.delete(`/sensitive-words/delete/${id}`);
    if (res.code === 200) { message.success('删除成功'); loadData(); }
  };

  /** 批量导入敏感词，按行分割文本框内容并提交 */
  const handleImport = async () => {
    const values = await importForm.validateFields();
    const words = values.words.split('\n').map((w: string) => w.trim()).filter(Boolean);
    if (words.length === 0) { message.warning('请输入至少一个敏感词'); return; }
    try {
      const res: any = await request.post('/sensitive-words/batch-import', { words, category: values.category });
      if (res.code === 200) { message.success(`成功导入 ${words.length} 个敏感词`); setImportOpen(false); importForm.resetFields(); loadData(); }
      else message.error(res.message);
    } catch (err: any) { message.error(err?.response?.data?.message || '导入失败'); }
  };

  /** 表格列配置 */
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '敏感词', dataIndex: 'word' },
    { title: '分类', dataIndex: 'category', render: (v: string) => v ? <Tag>{v}</Tag> : '-' },
    { title: '状态', dataIndex: 'status', render: (v: number) => v === 1 ? <Tag color="green">启用</Tag> : <Tag color="default">禁用</Tag> },
    {
      title: '操作', width: 150, fixed: 'right' as const, render: (_: any, record: any) => (
        <Space size="small" wrap>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openModal(record)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>敏感词管理</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>新增敏感词</Button>
        <Button icon={<ImportOutlined />} onClick={() => { importForm.resetFields(); setImportOpen(true); }}>批量导入</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} scroll={{ x: 'max-content' }}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }} />

      {/* 新增/编辑敏感词弹窗 */}
      <Modal title={editing ? '编辑敏感词' : '新增敏感词'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="word" label="敏感词" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="category" label="分类"><Input placeholder="如: 政治, 色情, 广告" /></Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}><Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]} /></Form.Item>
        </Form>
      </Modal>

      {/* 批量导入敏感词弹窗 */}
      <Modal title="批量导入敏感词" open={importOpen} onOk={handleImport} onCancel={() => setImportOpen(false)} destroyOnClose>
        <Form form={importForm} layout="vertical">
          <Form.Item name="words" label="敏感词列表" rules={[{ required: true }]}
            extra="每行一个敏感词">
            <Input.TextArea rows={10} placeholder={"敏感词1\n敏感词2\n敏感词3"} />
          </Form.Item>
          <Form.Item name="category" label="分类"><Input placeholder="如: 政治, 色情, 广告" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
