import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined } from '@ant-design/icons';
import ImageUploader from '../../components/ImageUploader';
import request from '../../utils/request';

const statusMap = { draft: { color: 'default', text: '草稿' }, published: { color: 'success', text: '已发布' }, removed: { color: 'warning', text: '已下架' } };

export default function FarmProductsPage() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const [form] = Form.useForm();
  const [catForm] = Form.useForm();
  const [filterCategoryId, setFilterCategoryId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await request.get('/api/farm-product/category/admin/list');
      setCategories(res.data || []);
    } catch { /* */ }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterCategoryId) params.category_id = filterCategoryId;
      const res = await request.get('/api/farm-product/admin/list', { params });
      setData(res.data?.list || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); fetchData(); }, []);
  useEffect(() => { fetchData(); }, [filterCategoryId]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ stock: 0 });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name, category_id: record.categoryId, price: record.price,
      stock: record.stock, main_image: record.mainImage, detail: record.detail,
      origin: record.origin, shelf_life: record.shelfLife, storage_method: record.storageMethod, spec: record.spec,
      status: record.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await request.put(`/api/farm-product/update/${editing.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/api/farm-product/create', values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData();
    } catch { /* */ }
  };

  const handleDelete = async (id) => {
    try {
      await request.delete(`/api/farm-product/delete/${id}`);
      message.success('删除成功');
      fetchData();
    } catch { /* */ }
  };

  // Category management
  const openCreateCat = () => {
    setEditingCat(null);
    catForm.resetFields();
    catForm.setFieldsValue({ sort_order: 0, status: 1 });
    setCatModalOpen(true);
  };

  const openEditCat = (record) => {
    setEditingCat(record);
    catForm.setFieldsValue({ name: record.name, icon: record.icon, sort_order: record.sortOrder, status: record.status });
    setCatModalOpen(true);
  };

  const handleCatSubmit = async () => {
    try {
      const values = await catForm.validateFields();
      if (editingCat) {
        await request.put(`/api/farm-product/category/update/${editingCat.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/api/farm-product/category/create', values);
        message.success('创建成功');
      }
      setCatModalOpen(false);
      fetchCategories();
    } catch { /* */ }
  };

  const handleCatDelete = async (id) => {
    try {
      await request.delete(`/api/farm-product/category/delete/${id}`);
      message.success('删除成功');
      fetchCategories();
    } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name', ellipsis: true },
    { title: '分类', dataIndex: 'categoryId', width: 80, render: (v) => categories.find(c => c.id === v)?.name || v },
    { title: '价格', dataIndex: 'price', width: 80, render: (v) => `¥${v}` },
    { title: '库存', dataIndex: 'stock', width: 60 },
    { title: '销量', dataIndex: 'sales', width: 60 },
    { title: '产地', dataIndex: 'origin', width: 80, render: (v) => v || '-' },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text || v}</Tag> },
    {
      title: '操作', width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const catColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name' },
    { title: '排序', dataIndex: 'sortOrder', width: 60 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '启用' : '禁用'}</Tag> },
    {
      title: '操作', width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditCat(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleCatDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>农产品管理</h2>
        <Space>
          <Select
            placeholder="筛选分类" allowClear style={{ width: 150 }}
            value={filterCategoryId} onChange={(v) => setFilterCategoryId(v || null)}
            options={categories.map(c => ({ label: c.name, value: c.id }))}
          />
          <Button icon={<AppstoreOutlined />} onClick={openCreateCat}>管理分类</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增农产品</Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />

      <h3 style={{ marginTop: 32, marginBottom: 12 }}>分类管理</h3>
      <Table columns={catColumns} dataSource={categories} rowKey="id" pagination={false} />

      {/* Product Modal */}
      <Modal title={editing ? '编辑农产品' : '新增农产品'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="产品名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="如：雷山银球茶" />
          </Form.Item>
          <Form.Item name="category_id" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
            <Select options={categories.map(c => ({ label: c.name, value: c.id }))} placeholder="选择分类" />
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stock" label="库存">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="main_image" label="主图">
            <ImageUploader placeholder="主图URL 或本地上传" />
          </Form.Item>
          <Form.Item name="origin" label="产地">
            <Input placeholder="如：贵州雷山" />
          </Form.Item>
          <Form.Item name="spec" label="规格">
            <Input placeholder="如：250g/盒" />
          </Form.Item>
          <Form.Item name="shelf_life" label="保质期">
            <Input placeholder="如：18个月" />
          </Form.Item>
          <Form.Item name="storage_method" label="储存方式">
            <Input placeholder="如：阴凉干燥处" />
          </Form.Item>
          <Form.Item name="detail" label="商品详情">
            <Input.TextArea rows={4} placeholder="详情描述" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select options={[
              { label: '草稿', value: 'draft' },
              { label: '已发布', value: 'published' },
              { label: '已下架', value: 'removed' },
            ]} placeholder="选择状态" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Category Modal */}
      <Modal title={editingCat ? '编辑分类' : '新增分类'} open={catModalOpen} onOk={handleCatSubmit} onCancel={() => setCatModalOpen(false)} destroyOnClose>
        <Form form={catForm} layout="vertical">
          <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="如：茶叶" />
          </Form.Item>
          <Form.Item name="icon" label="图标URL">
            <Input placeholder="图标URL" />
          </Form.Item>
          <Form.Item name="sort_order" label="排序">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <InputNumber min={0} max={1} style={{ width: '100%' }} placeholder="1启用 0禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
