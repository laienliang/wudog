import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Switch, Space, Modal, Form, InputNumber, message, Popconfirm, Tag, Upload } from 'antd';
import { PlusOutlined, SearchOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import {
  getProductList, createProduct, updateProduct, deleteProduct, toggleProductStatus, getCategoryList,
  getImageList, createImage, deleteImage, uploadImage,
} from '../utils/api';

const { TextArea } = Input;

export default function ProductManage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  // 图片管理
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageProductId, setImageProductId] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, statusFilter]);

  const loadCategories = async () => {
    try {
      const res = await getCategoryList();
      setCategories(res.data || []);
    } catch {}
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = { page, pageSize };
      if (keyword) params.keyword = keyword;
      const res = await getProductList(params);
      let list = res.data?.list || [];
      if (statusFilter !== undefined) {
        list = list.filter(p => p.status === statusFilter);
      }
      setProducts(list);
      setTotal(res.data?.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadProducts();
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      name: record.name,
      category_id: record.category_id,
      price: record.price,
      stock: record.stock,
      description: record.description,
      craft_intro: record.craft_intro,
      artisan_info: record.artisan_info,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      message.success('删除成功');
      loadProducts();
    } catch {
      message.error('删除失败');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleProductStatus(id);
      message.success('状态切换成功');
      loadProducts();
    } catch {
      message.error('操作失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let savedId = editingId;
      if (editingId) {
        await updateProduct(editingId, values);
        message.success('更新成功');
      } else {
        const res = await createProduct(values);
        savedId = res.data?.id;
        message.success('创建成功');
      }
      setModalOpen(false);
      loadProducts();
    } catch {
      message.error('操作失败');
    }
  };

  // ========== 图片管理 ==========
  const openImageModal = async (productId) => {
    setImageProductId(productId);
    setImageModalOpen(true);
    loadImageList(productId);
  };

  const loadImageList = async (productId) => {
    try {
      const res = await getImageList(productId);
      setImageList(res.data || []);
    } catch {
      setImageList([]);
    }
  };

  const handleUploadImage = async (file) => {
    setUploading(true);
    try {
      const res = await uploadImage(file);
      const url = res.data?.url;
      if (!url) throw new Error('上传失败');
      await createImage({ product_id: imageProductId, image_url: url });
      message.success('上传成功');
      loadImageList(imageProductId);
    } catch {
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleDeleteImage = async (id) => {
    try {
      await deleteImage(id);
      message.success('删除成功');
      loadImageList(imageProductId);
    } catch {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '商品名称', dataIndex: 'name', ellipsis: true },
    {
      title: '分类',
      dataIndex: ['category', 'name'],
      render: (text) => text || '-',
      width: 100,
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: (price) => price != null ? `¥${price}` : '-',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status, record) => (
        <Switch
          checked={status === 1}
          checkedChildren="在售"
          unCheckedChildren="下架"
          onChange={() => handleToggleStatus(record.id)}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 180,
      render: (text) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '操作',
      width: 280,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" onClick={() => openImageModal(record.id)}>图片</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索商品名称"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
          />
          <Select
            placeholder="状态筛选"
            value={statusFilter}
            onChange={v => { setStatusFilter(v); setPage(1); }}
            allowClear
            style={{ width: 120 }}
            options={[
              { label: '在售', value: 1 },
              { label: '下架', value: 0 },
            ]}
          />
          <Button onClick={handleSearch}>搜索</Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增商品</Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: setPage,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {/* 商品编辑弹窗 */}
      <Modal
        title={editingId ? '编辑商品' : '新增商品'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="商品名称" rules={[{ required: true, message: '请输入商品名称' }]}>
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item name="category_id" label="商品分类" rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder="请选择分类" options={categories.map(c => ({ label: c.name, value: c.id }))} />
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
            <InputNumber min={0} precision={2} placeholder="0.00" style={{ width: '100%' }} prefix="¥" />
          </Form.Item>
          <Form.Item name="stock" label="库存" rules={[{ required: true, message: '请输入库存' }]} initialValue={0}>
            <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="商品描述">
            <TextArea rows={3} placeholder="请输入商品描述" />
          </Form.Item>
          <Form.Item name="craft_intro" label="工艺介绍">
            <TextArea rows={3} placeholder="请输入工艺介绍" />
          </Form.Item>
          <Form.Item name="artisan_info" label="传承人信息">
            <TextArea rows={3} placeholder="请输入传承人信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 图片管理弹窗 */}
      <Modal
        title="图片管理"
        open={imageModalOpen}
        onCancel={() => setImageModalOpen(false)}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              handleUploadImage(file);
              return false;
            }}
          >
            <Button type="primary" icon={<UploadOutlined />} loading={uploading}>上传图片</Button>
          </Upload>
        </div>
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {imageList.map(img => (
            <div key={img.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
              <img src={img.image_url} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
              <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: '#666' }}>
                {img.image_url}
              </div>
              <Popconfirm title="确认删除?" onConfirm={() => handleDeleteImage(img.id)}>
                <Button type="link" size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </div>
          ))}
          {imageList.length === 0 && <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>暂无图片</div>}
        </div>
      </Modal>
    </div>
  );
}
