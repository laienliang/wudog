/**
 * 账号设置
 * 商家修改密码、查看账号信息
 */
import { useState } from 'react';
import { Card, Form, Input, Button, message, Descriptions } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import request from '../../utils/request';

export default function AccountSettings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const merchantStr = localStorage.getItem('merchant');
  const merchant = merchantStr ? JSON.parse(merchantStr) : {};

  const handleChangePassword = async () => {
    const values = await form.validateFields();
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次密码不一致');
      return;
    }
    setLoading(true);
    try {
      const res: any = await request.put(`/merchants/update/${merchant.id}`, {
        password: values.newPassword,
      });
      if (res.code === 200) {
        message.success('密码修改成功');
        form.resetFields();
      } else {
        message.error(res.message);
      }
    } catch (err: any) {
      message.error('修改失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--text-h2)', fontFamily: 'var(--font-family-heading)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>账号设置</h2>
      <Card title="账号信息" style={{ marginBottom: 24 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="用户名">{merchant.username}</Descriptions.Item>
          <Descriptions.Item label="店铺名称">{merchant.shop_name}</Descriptions.Item>
          <Descriptions.Item label="所属模块">{merchant.module_type}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="修改密码">
        <Form form={form} layout="vertical" style={{ maxWidth: 400 }}>
          <Form.Item name="newPassword" label="新密码" rules={[{ required: true, min: 6 }]}>
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item name="confirmPassword" label="确认密码" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleChangePassword} loading={loading}>
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
