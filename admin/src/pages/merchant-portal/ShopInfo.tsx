/**
 * 店铺信息管理
 * 商家可维护自己店铺的基础信息：店铺名称、Logo、简介、地址、联系方式
 */
import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Upload } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import ImageUpload from '../../components/ImageUpload';

export default function ShopInfo() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState('');
  const merchantStr = localStorage.getItem('merchant');
  const merchant = merchantStr ? JSON.parse(merchantStr) : {};

  useEffect(() => {
    loadShopInfo();
  }, []);

  const loadShopInfo = async () => {
    try {
      const res: any = await request.get(`/merchants/detail/${merchant.id}`);
      if (res.code === 200) {
        form.setFieldsValue(res.data);
        setLogo(res.data.logo || '');
      }
    } catch (err) {
      // ignore
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    values.logo = logo;
    setLoading(true);
    try {
      const res: any = await request.put(`/merchants/update/${merchant.id}`, values);
      if (res.code === 200) {
        message.success('保存成功');
        localStorage.setItem('merchant', JSON.stringify({ ...merchant, ...values }));
      } else {
        message.error(res.message);
      }
    } catch (err: any) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>店铺信息管理</h2>
      <Card>
        <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label="店铺Logo">
            <ImageUpload value={logo} onChange={setLogo} />
          </Form.Item>
          <Form.Item name="shop_name" label="店铺名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contact_name" label="联系人">
            <Input />
          </Form.Item>
          <Form.Item name="contact_phone" label="联系电话">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="店铺地址">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="店铺简介">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit} loading={loading}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
