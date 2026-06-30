import React, { useState } from 'react';
import { Form, Input, Select, Button, message, Card, Typography, Steps, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ShopOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const api = axios.create({ baseURL: '/api/v1' });

const MODULES = [
  { value: 'clothing', label: '🧣 民族服饰 - 苗绣/蜡染/银饰' },
  { value: 'food', label: '🍜 餐饮美食 - 餐厅/农产品' },
  { value: 'accommodation', label: '🏡 民宿住宿 - 客栈/民宿' },
  { value: 'travel', label: '🗺️ 旅游线路 - 景区/路线' },
];

const MerchantRegister: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (values: any) => {
    const token = localStorage.getItem('token');
    if (!token) { message.warning('请先登录'); return; }
    setSubmitting(true);
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      await api.post('/admin/merchant-applications', {
        userId: decoded.userId || 1,
        shopName: values.shopName,
        module: values.module,
        contactPerson: values.contactPerson,
        contactPhone: values.contactPhone,
      }, { headers: { Authorization: 'Bearer ' + token } });
      setDone(true);
    } catch (err: any) {
      message.error(err?.response?.data?.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px' }}>
        <Result
          status="success"
          title="申请已提交！"
          subTitle="我们将在 1-3 个工作日内审核你的入驻申请，请耐心等待。"
          extra={[
            <Button key="back" onClick={() => navigate('/')}>返回首页</Button>,
            <Button key="apply" type="primary" onClick={() => { setDone(false); form.resetFields(); }} style={{ background: '#1F5FA8' }}>继续申请</Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px' }}>
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}
        style={{ marginBottom: 16, fontSize: 15, color: '#1F5FA8' }}>返回</Button>

      <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏪</div>
          <Title level={4} style={{ margin: 0 }}>商家入驻申请</Title>
          <Text type="secondary">加入乌东文旅平台，开启线上经营</Text>
        </div>

        <Steps
          current={0}
          style={{ marginBottom: 32 }}
          items={[
            { title: '填写信息' },
            { title: '提交审核' },
            { title: '审核通过' },
            { title: '开始经营' },
          ]}
        />

        <Form form={form} layout="vertical" onFinish={handleSubmit}
          initialValues={{ contactPerson: '', contactPhone: '' }}>
          <Form.Item name="shopName" label="店铺名称" rules={[{ required: true, message: '请输入店铺名称' }]}>
            <Input placeholder="输入你的店铺名称" maxLength={50} showCount />
          </Form.Item>

          <Form.Item name="module" label="经营类目" rules={[{ required: true, message: '请选择经营类目' }]}>
            <Select placeholder="请选择经营类目" options={MODULES} />
          </Form.Item>

          <Form.Item name="contactPerson" label="联系人">
            <Input placeholder="联系人姓名" />
          </Form.Item>

          <Form.Item name="contactPhone" label="联系电话">
            <Input placeholder="手机号码" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" loading={submitting} size="large" block
              icon={<ShopOutlined />}
              style={{ height: 48, borderRadius: 8, fontWeight: 600, fontSize: 16, background: '#1F5FA8' }}>
              提交入驻申请
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 24, padding: 16, background: '#F7F8FA', borderRadius: 8 }}>
          <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>📋 入驻须知</Text>
          <Text type="secondary" style={{ fontSize: 12, lineHeight: 2, display: 'block' }}>
            1. 提交申请后请耐心等待平台审核（1-3个工作日）<br />
            2. 审核通过后你将可以在对应模块发布商品/服务<br />
            3. 如有问题请联系平台客服
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default MerchantRegister;
