import { useState, useEffect } from 'react';
import { Table, Tag, Button, Select, Space, Modal, Form, Input, InputNumber, message, Popconfirm, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import request from '../../utils/request';

const statusMap = {
  draft: { color: 'default', text: '草稿' },
  reviewing: { color: 'processing', text: '待审核' },
  published: { color: 'success', text: '已发布' },
  rejected: { color: 'error', text: '已驳回' },
  removed: { color: 'warning', text: '已下架' },
};

export default function ProductsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [status, setStatus] = useState('');
  const [categories, setCategories] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [skus, setSkus] = useState([]);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await request.get('/api/product-category/admin/list');
      setCategories(res.data || []);
    } catch { /* */ }
  };

  const fetchData = async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const params = { page, pageSize };
      if (status) params.status = status;
      const res = await request.get('/api/product/list', { params });
      setData(res.data.list || []);
      setPagination({ current: page, pageSize, total: res.data.total || 0 });
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); fetchData(); }, [status]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ stock: 0 });
    setSkus([]);
    setImages([]);
    setModalOpen(true);
  };

  const openEdit = async (record) => {
    setEditing(record);
    setLoading(true);
    try {
      const res = await request.get(`/api/product/detail/${record.id}`);
      const p = res.data;
      form.setFieldsValue({
        title: p.title, subtitle: p.subtitle, category_id: p.categoryId,
        main_image: p.mainImage, price: p.price, market_price: p.marketPrice,
        stock: p.stock, detail: p.detail, craft_intro: p.craftIntro, inheritor_name: p.inheritorName,
      });
      setSkus((p.skus || []).map(s => ({ spec_name: s.specName, price: s.price, stock: s.stock, image: s.image })));
      setImages((p.images || []).map(i => ({ url: i.url, sort_order: i.sortOrder })));
      setModalOpen(true);
    } catch { /* */ } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const body = {
        ...values,
        market_price: values.market_price || undefined,
        skus: skus.filter(s => s.spec_name),
        images: images.filter(i => i.url),
      };
      if (editing) {
        await request.put(`/api/product/update/${editing.id}`, body);
        message.success('更新成功（已回到草稿状态）');
      } else {
        await request.post('/api/product/create', body);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData(pagination.current, pagination.pageSize);
    } catch { /* */ } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await request.delete(`/api/product/delete/${id}`);
      message.success('删除成功');
      fetchData(pagination.current, pagination.pageSize);
    } catch { /* */ }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'submit-review') await request.post(`/api/product/submit-review/${id}`);
      else if (action === 'remove') await request.put(`/api/product/remove/${id}`);
      else if (action === 'approve') await request.put(`/api/product/review/${id}`, { action: 'approve' });
      else if (action === 'reject') {
        Modal.confirm({
          title: '驳回原因',
          content: <Input.TextArea id="reject-reason" rows={3} placeholder="请填写驳回原因" />,
          onOk: async () => {
            const reason = document.getElementById('reject-reason')?.value || '';
            await request.put(`/api/product/review/${id}`, { action: 'reject', reject_reason: reason });
            message.success('已驳回');
            fetchData(pagination.current, pagination.pageSize);
          },
        });
        return;
      }
      message.success('操作成功');
      fetchData(pagination.current, pagination.pageSize);
    } catch (e) {
      message.error(e.response?.data?.message || '操作失败');
    }
  };

  const addSku = () => setSkus([...skus, { spec_name: '', price: null, stock: 0, image: '' }]);
  const removeSku = (i) => setSkus(skus.filter((_, idx) => idx !== i));
  const updateSku = (i, field, value) => {
    const updated = [...skus];
    updated[i] = { ...updated[i], [field]: value };
    setSkus(updated);
  };

  const addImage = () => setImages([...images, { url: '', sort_order: images.length }]);
  const removeImage = (i) => setImages(images.filter((_, idx) => idx !== i));
  const updateImage = (i, field, value) => {
    const updated = [...images];
    updated[i] = { ...updated[i], [field]: value };
    setImages(updated);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', ellipsis: true, width: 150 },
    { title: '主图', dataIndex: 'mainImage', width: 70, render: (v) => v ? <img src={v} alt="" style={{ width: 48, height: 48, objectFit: 'cover' }} /> : '-' },
    { title: '分类ID', dataIndex: 'categoryId', width: 70 },
    { title: '价格', dataIndex: 'price', width: 80, render: (v) => `¥${Number(v).toFixed(2)}` },
    { title: '库存', dataIndex: 'stock', width: 60 },
    { title: '销量', dataIndex: 'sales', width: 60 },
    {
      title: '状态', dataIndex: 'status', width: 90,
      render: (v) => { const s = statusMap[v] || { color: 'default', text: v }; return <Tag color={s.color}>{s.text}</Tag>; },
    },
    { title: '评分', dataIndex: 'avgRating', width: 60, render: (v) => v ?? '-' },
    {
      title: '操作', width: 280,
      render: (_, record) => (
        <Space wrap>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          {['draft', 'rejected'].includes(record.status) && (
            <Button type="link" size="small" onClick={() => handleAction(record.id, 'submit-review')}>提交审核</Button>
          )}
          {record.status === 'reviewing' && (
            <>
              <Button type="link" size="small" style={{ color: 'green' }} onClick={() => handleAction(record.id, 'approve')}>通过</Button>
              <Button type="link" size="small" danger onClick={() => handleAction(record.id, 'reject')}>驳回</Button>
            </>
          )}
          <Button type="link" size="small" danger onClick={() => handleAction(record.id, 'remove')}>下架</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>商品管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增商品</Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Select placeholder="商品状态" allowClear style={{ width: 160 }} value={status || undefined} onChange={(v) => { setStatus(v || ''); setPagination({ ...pagination, current: 1 }); }}>
          {Object.entries(statusMap).map(([k, v]) => (
            <Select.Option key={k} value={k}>{v.text}</Select.Option>
          ))}
        </Select>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ ...pagination, onChange: (p, ps) => fetchData(p, ps) }} scroll={{ x: 1200 }} />

      <Modal title={editing ? '编辑商品' : '新增商品'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={800} confirmLoading={submitting} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="商品标题" />
          </Form.Item>
          <Form.Item name="subtitle" label="副标题">
            <Input placeholder="副标题" />
          </Form.Item>
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item name="category_id" label="分类" rules={[{ required: true }]} style={{ width: 200 }}>
              <Select placeholder="选择分类">
                {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="price" label="售价" rules={[{ required: true }]} style={{ width: 150 }}>
              <InputNumber min={0} step={0.01} style={{ width: '100%' }} placeholder="0.00" />
            </Form.Item>
            <Form.Item name="market_price" label="市场价" style={{ width: 150 }}>
              <InputNumber min={0} step={0.01} style={{ width: '100%' }} placeholder="0.00" />
            </Form.Item>
            <Form.Item name="stock" label="库存" style={{ width: 100 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Form.Item name="main_image" label="主图URL">
            <Input placeholder="商品主图URL" />
          </Form.Item>
          <Form.Item name="craft_intro" label="工艺介绍">
            <Input.TextArea rows={2} placeholder="非遗工艺介绍" />
          </Form.Item>
          <Form.Item name="inheritor_name" label="传承人">
            <Input placeholder="传承人姓名" />
          </Form.Item>
          <Form.Item name="detail" label="商品详情(HTML)">
            <Input.TextArea rows={6} placeholder="商品详情，支持HTML" />
          </Form.Item>

          {/* SKU Management */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong>SKU 规格管理</strong>
              <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addSku}>添加SKU</Button>
            </div>
            {skus.map((sku, i) => (
              <Space key={i} style={{ display: 'flex', marginBottom: 8 }} align="start">
                <Input placeholder="规格名" value={sku.spec_name} onChange={e => updateSku(i, 'spec_name', e.target.value)} style={{ width: 150 }} />
                <InputNumber placeholder="价格" value={sku.price} onChange={v => updateSku(i, 'price', v)} style={{ width: 100 }} min={0} step={0.01} />
                <InputNumber placeholder="库存" value={sku.stock} onChange={v => updateSku(i, 'stock', v)} style={{ width: 80 }} min={0} />
                <Input placeholder="图片URL" value={sku.image} onChange={e => updateSku(i, 'image', e.target.value)} style={{ width: 200 }} />
                <Button icon={<DeleteOutlined />} onClick={() => removeSku(i)} danger size="small" />
              </Space>
            ))}
          </div>

          {/* Image Gallery */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong>商品图片管理</strong>
              <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addImage}>添加图片</Button>
            </div>
            {images.map((img, i) => (
              <Space key={i} style={{ display: 'flex', marginBottom: 8 }} align="start">
                <Input placeholder="图片URL" value={img.url} onChange={e => updateImage(i, 'url', e.target.value)} style={{ width: 400 }} />
                <InputNumber placeholder="排序" value={img.sort_order} onChange={v => updateImage(i, 'sort_order', v)} style={{ width: 80 }} min={0} />
                <Button icon={<DeleteOutlined />} onClick={() => removeImage(i)} danger size="small" />
                {img.url && <img src={img.url} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} />}
              </Space>
            ))}
          </div>
        </Form>
      </Modal>
    </div>
  );
}
