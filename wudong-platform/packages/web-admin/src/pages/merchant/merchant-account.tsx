import React, { useState } from 'react';
import {
  Card, Form, Input, Button, message, Typography, Space, Divider,
} from 'antd';
import {
  LockOutlined, PhoneOutlined, SaveOutlined, UserOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

/* ============================================================
   商家品牌色
   ============================================================ */
const COLORS = {
  primary: '#6B8E3D',
  primaryLight: '#8DB560',
};

/* ============================================================
   账户安全设置页面
   ============================================================ */
const MerchantAccount: React.FC = () => {
  const [pwdForm] = Form.useForm();
  const [phoneForm] = Form.useForm();
  const [pwdSaving, setPwdSaving] = useState(false);
  const [phoneSaving, setPhoneSaving] = useState(false);

  // 修改密码
  const handleChangePassword = async () => {
    try {
      const values = await pwdForm.validateFields();
      setPwdSaving(true);
      // MVP: mock save
      await new Promise((resolve) => setTimeout(resolve, 500));
      message.success('密码修改成功');
      pwdForm.resetFields();
    } catch {
      // validation error
    } finally {
      setPwdSaving(false);
    }
  };

  // 绑定手机号
  const handleBindPhone = async () => {
    try {
      const values = await phoneForm.validateFields();
      setPhoneSaving(true);
      // MVP: mock save
      await new Promise((resolve) => setTimeout(resolve, 500));
      message.success('手机号绑定成功');
    } catch {
      // validation error
    } finally {
      setPhoneSaving(false);
    }
  };

  return (
    <div style={{ padding: 0 }}>
      {/* ===== 修改密码 ===== */}
      <Card
        title={
          <Space>
            <LockOutlined style={{ color: COLORS.primary }} />
            <span style={{ fontSize: 15, fontWeight: 500 }}>修改密码</span>
          </Space>
        }
        style={{
          borderRadius: 10,
          border: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          marginBottom: 16,
        }}
        styles={{ body: { padding: '24px 32px' } }}
      >
        <Form
          form={pwdForm}
          layout="vertical"
          style={{ maxWidth: 480 }}
        >
          <Form.Item
            name="currentPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="请输入当前密码"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少 6 位' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="请输入新密码"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请再次输入新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="请再次输入新密码"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleChangePassword}
              loading={pwdSaving}
              size="large"
              style={{
                borderRadius: 8,
                background: COLORS.primary,
                borderColor: COLORS.primary,
                boxShadow: '0 2px 6px rgba(107, 142, 61, 0.3)',
                paddingLeft: 24,
                paddingRight: 24,
              }}
            >
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* ===== 绑定手机号 ===== */}
      <Card
        title={
          <Space>
            <PhoneOutlined style={{ color: COLORS.primary }} />
            <span style={{ fontSize: 15, fontWeight: 500 }}>绑定手机号</span>
          </Space>
        }
        style={{
          borderRadius: 10,
          border: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
        styles={{ body: { padding: '24px 32px' } }}
      >
        <Form
          form={phoneForm}
          layout="vertical"
          style={{ maxWidth: 480 }}
          initialValues={{ phone: '13988886666' }}
        >
          <Form.Item
            name="phone"
            label="手机号码"
            rules={[
              { required: true, message: '请输入手机号码' },
              { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="请输入手机号码"
              size="large"
              maxLength={11}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="smsCode"
            label="短信验证码"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <Space>
              <Input
                placeholder="请输入验证码"
                size="large"
                maxLength={6}
                style={{ borderRadius: 8, width: 180 }}
              />
              <Button
                size="large"
                style={{ borderRadius: 8 }}
              >
                获取验证码
              </Button>
            </Space>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleBindPhone}
              loading={phoneSaving}
              size="large"
              style={{
                borderRadius: 8,
                background: COLORS.primary,
                borderColor: COLORS.primary,
                boxShadow: '0 2px 6px rgba(107, 142, 61, 0.3)',
                paddingLeft: 24,
                paddingRight: 24,
              }}
            >
              绑定手机
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MerchantAccount;
