/**
 * 系统配置页面
 * 展示系统配置项列表，支持编辑配置值
 * 配置项包含键名、值、类型和描述信息
 * 顶部增加抽佣比例、运费模板、支付配置、短信配置的分组表单
 */
import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, message, Tag, Card, Row, Col, InputNumber, Select, Divider } from 'antd';
import { EditOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import request from '../../utils/request';

/**
 * 系统配置页面组件
 * 提供系统配置项的查看和编辑功能
 */
export default function SystemConfigPage() {
  /** 配置项列表数据 */
  const [data, setData] = useState<any[]>([]);
  /** 数据总条数 */
  const [total, setTotal] = useState(0);
  /** 当前页码 */
  const [page, setPage] = useState(1);
  /** 每页条数 */
  const [pageSize, setPageSize] = useState(20);
  /** 数据加载状态 */
  const [loading, setLoading] = useState(false);
  /** 编辑弹窗显示状态 */
  const [modalOpen, setModalOpen] = useState(false);
  /** 当前编辑的配置项记录 */
  const [editing, setEditing] = useState<any>(null);
  /** 表单实例 */
  const [form] = Form.useForm();

  /** 抽佣比例表单 */
  const [commissionForm] = Form.useForm();
  /** 运费模板表单 */
  const [shippingForm] = Form.useForm();
  /** 支付配置表单 */
  const [paymentForm] = Form.useForm();
  /** 短信配置表单 */
  const [smsForm] = Form.useForm();
  /** 保存状态 */
  const [savingCommission, setSavingCommission] = useState(false);
  const [savingShipping, setSavingShipping] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingSms, setSavingSms] = useState(false);

  /** 加载系统配置列表数据 */
  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/system-configs/list');
      if (res.code === 200) {
        const list = Array.isArray(res.data) ? res.data : (res.data.list || []);
        setData(list);
        setTotal(Array.isArray(res.data) ? res.data.length : (res.data.total || 0));
        // 解析分组配置填充表单
        fillGroupForms(list);
      }
    } finally { setLoading(false); }
  };

  /** 将配置列表中的值填充到分组表单 */
  const fillGroupForms = (list: any[]) => {
    const map: Record<string, string> = {};
    list.forEach(item => { map[item.config_key] = item.config_value; });
    // 抽佣比例（存储为小数，展示为百分比）
    commissionForm.setFieldsValue({
      clothing: Number(map['commission_rate_clothing'] || 0) * 100,
      food: Number(map['commission_rate_food'] || 0) * 100,
      stay: Number(map['commission_rate_stay'] || 0) * 100,
      travel: Number(map['commission_rate_travel'] || 0) * 100,
    });
    // 运费模板
    try {
      const tpl = JSON.parse(map['shipping_template'] || '{}');
      shippingForm.setFieldsValue({
        free_shipping_amount: tpl.free_shipping_amount ?? 99,
        default_fee: tpl.default_fee ?? 10,
      });
    } catch { /* ignore */ }
    // 支付配置
    paymentForm.setFieldsValue({ payment_mch_id: map['payment_mch_id'] || '' });
    // 短信配置
    smsForm.setFieldsValue({
      sms_provider: map['sms_provider'] || 'aliyun',
      sms_access_key: map['sms_access_key'] || '',
    });
  };

  useEffect(() => { loadData(); }, [page, pageSize]);

  /** 更新单个配置项 */
  const updateConfig = async (key: string, value: string) => {
    const res: any = await request.put(`/system-configs/update/${key}`, { value });
    return res.code === 200;
  };

  /** 保存抽佣比例 */
  const saveCommission = async () => {
    const values = await commissionForm.validateFields();
    setSavingCommission(true);
    try {
      const updates = [
        updateConfig('commission_rate_clothing', (values.clothing / 100).toFixed(4)),
        updateConfig('commission_rate_food', (values.food / 100).toFixed(4)),
        updateConfig('commission_rate_stay', (values.stay / 100).toFixed(4)),
        updateConfig('commission_rate_travel', (values.travel / 100).toFixed(4)),
      ];
      const results = await Promise.all(updates);
      if (results.every(Boolean)) { message.success('抽佣比例保存成功（新订单生效）'); loadData(); }
      else message.error('保存失败');
    } finally { setSavingCommission(false); }
  };

  /** 保存运费模板 */
  const saveShipping = async () => {
    const values = await shippingForm.validateFields();
    setSavingShipping(true);
    try {
      const jsonValue = JSON.stringify({
        free_shipping_amount: values.free_shipping_amount,
        default_fee: values.default_fee,
      });
      if (await updateConfig('shipping_template', jsonValue)) {
        message.success('运费模板保存成功');
        loadData();
      } else message.error('保存失败');
    } finally { setSavingShipping(false); }
  };

  /** 保存支付配置 */
  const savePayment = async () => {
    const values = await paymentForm.validateFields();
    setSavingPayment(true);
    try {
      if (await updateConfig('payment_mch_id', values.payment_mch_id || '')) {
        message.success('支付配置保存成功');
        loadData();
      } else message.error('保存失败');
    } finally { setSavingPayment(false); }
  };

  /** 保存短信配置 */
  const saveSms = async () => {
    const values = await smsForm.validateFields();
    setSavingSms(true);
    try {
      const ok1 = await updateConfig('sms_provider', values.sms_provider);
      const ok2 = await updateConfig('sms_access_key', values.sms_access_key || '');
      if (ok1 && ok2) { message.success('短信配置保存成功'); loadData(); }
      else message.error('保存失败');
    } finally { setSavingSms(false); }
  };

  /**
   * 打开编辑弹窗
   * @param record - 要编辑的配置项记录
   */
  const openEditModal = (record: any) => {
    setEditing(record);
    form.setFieldsValue({ config_value: record.config_value });
    setModalOpen(true);
  };

  /** 提交编辑表单，更新配置值 */
  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      const res: any = await request.put(`/system-configs/update/${editing.config_key}`, { value: values.config_value });
      if (res.code === 200) { message.success('更新成功'); setModalOpen(false); loadData(); }
      else message.error(res.message);
    } catch (err: any) { message.error(err?.response?.data?.message || '操作失败'); }
  };

  /** 表格列配置 */
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '配置键', dataIndex: 'config_key', width: 240 },
    { title: '配置值', dataIndex: 'config_value', ellipsis: true },
    { title: '配置类型', dataIndex: 'config_type', width: 120, render: (v: string) => <Tag>{v}</Tag> },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '操作', width: 100, render: (_: any, record: any) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)}>编辑</Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>系统配置</h2>

      {/* 抽佣比例卡片（R11-04） */}
      <Card title="平台抽佣比例" size="small" style={{ marginBottom: 16 }} extra={<span style={{ color: '#8C8C8C', fontSize: 12 }}>修改后对新订单生效，已结算不受影响</span>}>
        <Form form={commissionForm} layout="inline">
          <Form.Item name="clothing" label="衣（非遗商品）" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} step={0.5} addonAfter="%" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="food" label="食（餐饮美食）" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} step={0.5} addonAfter="%" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="stay" label="住（住宿预订）" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} step={0.5} addonAfter="%" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="travel" label="行（线路订票）" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} step={0.5} addonAfter="%" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} loading={savingCommission} onClick={saveCommission}>保存</Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 运费模板卡片 */}
      <Card title="运费模板" size="small" style={{ marginBottom: 16 }}>
        <Form form={shippingForm} layout="inline">
          <Form.Item name="free_shipping_amount" label="免运费金额（元）" rules={[{ required: true }]}>
            <InputNumber min={0} step={1} style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="default_fee" label="默认运费（元）" rules={[{ required: true }]}>
            <InputNumber min={0} step={1} style={{ width: 140 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} loading={savingShipping} onClick={saveShipping}>保存</Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 支付配置 + 短信配置 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Card title="支付配置" size="small">
            <Form form={paymentForm} layout="vertical">
              <Form.Item name="payment_mch_id" label="微信支付商户号" rules={[{ required: false }]}>
                <Input placeholder="请输入商户号" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon={<SaveOutlined />} loading={savingPayment} onClick={savePayment}>保存</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="短信配置" size="small">
            <Form form={smsForm} layout="vertical">
              <Form.Item name="sms_provider" label="短信服务商">
                <Select options={[
                  { value: 'aliyun', label: '阿里云' },
                  { value: 'tencent', label: '腾讯云' },
                ]} />
              </Form.Item>
              <Form.Item name="sms_access_key" label="AccessKey">
                <Input placeholder="请输入 AccessKey" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon={<SaveOutlined />} loading={savingSms} onClick={saveSms}>保存</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ReloadOutlined />} onClick={loadData}>刷新</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }} />
      <Modal title={`编辑配置 - ${editing?.config_key || ''}`} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="config_value" label="配置值" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
