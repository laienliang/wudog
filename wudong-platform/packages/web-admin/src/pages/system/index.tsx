import React, { useState, useEffect } from 'react';
import {
  Card, Tabs, Form, InputNumber, Input, Button, message, Space, Typography, Spin, Divider, Select,
} from 'antd';
import {
  SettingOutlined, WarningOutlined, FileTextOutlined, SaveOutlined, CarOutlined, WalletOutlined, MessageOutlined,
} from '@ant-design/icons';
import SensitiveWords from './sensitive-words';
import OperationLogs from './operation-logs';
import { adminApi } from '../../services/admin';

const { Text, Title } = Typography;

/* ============================================================
   品牌色系统
   ============================================================ */
const COLORS = {
  primary: '#1F5FA8',
  success: '#6B8E3D',
  warning: '#E8A838',
  danger: '#D94A4A',
  textSecondary: '#8C8C8C',
};

/* ============================================================
   系统配置 - 平台抽成配置
   ============================================================ */
const SystemConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 加载配置
  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getConfig();
        const config = res?.data || res || {};
        form.setFieldsValue({
          commissionClothing: config.commissionClothing ?? 5,
          commissionFood: config.commissionFood ?? 5,
          commissionAccommodation: config.commissionAccommodation ?? 5,
          commissionTravel: config.commissionTravel ?? 5,
        });
      } catch {
        // 使用默认值
        form.setFieldsValue({
          commissionClothing: 5,
          commissionFood: 5,
          commissionAccommodation: 5,
          commissionTravel: 5,
        });
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, [form]);

  // 保存配置
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const tasks = Object.entries(values).map(([key, value]) =>
        adminApi.setConfig(key, String(value))
      );
      await Promise.all(tasks);
      message.success('系统配置已保存');
    } catch {
      message.error('保存配置失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: COLORS.textSecondary }}>加载配置中...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={5} style={{ marginBottom: 8 }}>平台抽成比例设置</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24, fontSize: 13 }}>
        各业务模块交易时平台收取的佣金比例，单位为百分比（%）
      </Text>

      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 480 }}
      >
        <Card
          size="small"
          style={{
            marginBottom: 16,
            borderRadius: 10,
            border: 'none',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <Form.Item
            name="commissionClothing"
            label="民族商品抽成比例"
            tooltip="衣·民族特色商品模块的平台佣金比例"
            rules={[{ required: true, message: '请输入抽成比例' }]}
          >
            <InputNumber
              min={0}
              max={100}
              addonAfter="%"
              style={{ width: '100%' }}
              placeholder="例如: 5"
            />
          </Form.Item>
        </Card>

        <Card
          size="small"
          style={{
            marginBottom: 16,
            borderRadius: 8,
            border: '1px solid #f0f0f0',
          }}
        >
          <Form.Item
            name="commissionFood"
            label="餐饮抽成比例"
            tooltip="食·餐饮美食模块的平台佣金比例"
            rules={[{ required: true, message: '请输入抽成比例' }]}
          >
            <InputNumber
              min={0}
              max={100}
              addonAfter="%"
              style={{ width: '100%' }}
              placeholder="例如: 5"
            />
          </Form.Item>
        </Card>

        <Card
          size="small"
          style={{
            marginBottom: 16,
            borderRadius: 8,
            border: '1px solid #f0f0f0',
          }}
        >
          <Form.Item
            name="commissionAccommodation"
            label="住宿抽成比例"
            tooltip="住·住宿预订模块的平台佣金比例"
            rules={[{ required: true, message: '请输入抽成比例' }]}
          >
            <InputNumber
              min={0}
              max={100}
              addonAfter="%"
              style={{ width: '100%' }}
              placeholder="例如: 5"
            />
          </Form.Item>
        </Card>

        <Card
          size="small"
          style={{
            marginBottom: 24,
            borderRadius: 8,
            border: '1px solid #f0f0f0',
          }}
        >
          <Form.Item
            name="commissionTravel"
            label="线路抽成比例"
            tooltip="行·线路订票模块的平台佣金比例"
            rules={[{ required: true, message: '请输入抽成比例' }]}
          >
            <InputNumber
              min={0}
              max={100}
              addonAfter="%"
              style={{ width: '100%' }}
              placeholder="例如: 5"
            />
          </Form.Item>
        </Card>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={saving}
          style={{ boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}
        >
          保存配置
        </Button>
      </Form>
    </div>
  );
};

/* ============================================================
   运费模板配置
   ============================================================ */
const FreightConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminApi.getConfig();
        const cfg = res?.data || res || {};
        form.setFieldsValue({
          defaultFreight: cfg.defaultFreight ?? 10,
          freeShippingThreshold: cfg.freeShippingThreshold ?? 99,
          extraFreightPerItem: cfg.extraFreightPerItem ?? 5,
        });
      } catch {
        form.setFieldsValue({ defaultFreight: 10, freeShippingThreshold: 99, extraFreightPerItem: 5 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const tasks = Object.entries(values).map(([key, value]) =>
        adminApi.setConfig(key, String(value))
      );
      await Promise.all(tasks);
      message.success('运费配置已保存');
    } catch {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  }

  return (
    <div style={{ maxWidth: 500, padding: '20px 0' }}>
      <Title level={5}>运费模板设置</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        配置默认运费和包邮规则
      </Text>
      <Form form={form} layout="vertical">
        <Form.Item name="defaultFreight" label="默认运费（元）" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} addonAfter="元" />
        </Form.Item>
        <Form.Item name="freeShippingThreshold" label="包邮门槛（元）" tooltip="订单金额达到此值免运费">
          <InputNumber min={0} style={{ width: '100%' }} addonAfter="元" />
        </Form.Item>
        <Form.Item name="extraFreightPerItem" label="每增加一件加收（元）">
          <InputNumber min={0} style={{ width: '100%' }} addonAfter="元" />
        </Form.Item>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
          保存配置
        </Button>
      </Form>
    </div>
  );
};

/* ============================================================
   支付配置
   ============================================================ */
const PaymentConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminApi.getConfig();
        const cfg = res?.data || res || {};
        form.setFieldsValue({
          wechatMchId: cfg.wechatMchId || '',
          wechatApiKey: cfg.wechatApiKey || '',
          wechatAppId: cfg.wechatAppId || '',
          paymentNotifyUrl: cfg.paymentNotifyUrl || '',
        });
      } catch {
        // defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const tasks = Object.entries(values).map(([key, value]) =>
        adminApi.setConfig(key, String(value))
      );
      await Promise.all(tasks);
      message.success('支付配置已保存');
    } catch {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  }

  return (
    <div style={{ maxWidth: 500, padding: '20px 0' }}>
      <Title level={5}>支付配置</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        配置微信支付商户信息
      </Text>
      <Form form={form} layout="vertical">
        <Form.Item name="wechatAppId" label="微信 AppID" rules={[{ required: true }]}>
          <Input placeholder="wxxxxxxxxxxxxx" />
        </Form.Item>
        <Form.Item name="wechatMchId" label="微信商户号" rules={[{ required: true }]}>
          <Input placeholder="16xxxxxxxxx" />
        </Form.Item>
        <Form.Item name="wechatApiKey" label="API 密钥" rules={[{ required: true }]}>
          <Input.Password placeholder="请输入 API 密钥" />
        </Form.Item>
        <Form.Item name="paymentNotifyUrl" label="支付回调地址">
          <Input placeholder="https://api.example.com/api/v1/payment/notify" />
        </Form.Item>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
          保存配置
        </Button>
      </Form>
    </div>
  );
};

/* ============================================================
   短信配置
   ============================================================ */
const SmsConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminApi.getConfig();
        const cfg = res?.data || res || {};
        form.setFieldsValue({
          smsProvider: cfg.smsProvider || 'aliyun',
          smsAccessKey: cfg.smsAccessKey || '',
          smsSecretKey: cfg.smsSecretKey || '',
          smsSignName: cfg.smsSignName || '',
        });
      } catch {
        // defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const tasks = Object.entries(values).map(([key, value]) =>
        adminApi.setConfig(key, String(value))
      );
      await Promise.all(tasks);
      message.success('短信配置已保存');
    } catch {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  }

  return (
    <div style={{ maxWidth: 500, padding: '20px 0' }}>
      <Title level={5}>短信配置</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        配置短信服务商信息
      </Text>
      <Form form={form} layout="vertical">
        <Form.Item name="smsProvider" label="服务商" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="aliyun">阿里云短信</Select.Option>
            <Select.Option value="tencent">腾讯云短信</Select.Option>
            <Select.Option value="qiniu">七牛云短信</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="smsAccessKey" label="AccessKey" rules={[{ required: true }]}>
          <Input placeholder="请输入 AccessKey" />
        </Form.Item>
        <Form.Item name="smsSecretKey" label="SecretKey" rules={[{ required: true }]}>
          <Input.Password placeholder="请输入 SecretKey" />
        </Form.Item>
        <Form.Item name="smsSignName" label="短信签名" rules={[{ required: true }]}>
          <Input placeholder="例如：乌东文旅" />
        </Form.Item>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
          保存配置
        </Button>
      </Form>
    </div>
  );
};

/* ============================================================
   系统设置页面 - Tab 容器
   ============================================================ */
const SystemPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState('config');

  return (
    <div style={{ padding: 0 }}>
      <Card
        style={{
          borderRadius: 10,
          border: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          marginBottom: 16,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          style={{ margin: 0, padding: '0 24px' }}
          items={[
            {
              key: 'config',
              label: <span><SettingOutlined /> 系统配置</span>,
              children: (
                <div style={{ padding: '20px 0' }}>
                  <SystemConfig />
                </div>
              ),
            },
            {
              key: 'sensitive',
              label: <span><WarningOutlined /> 敏感词库</span>,
              children: (
                <div style={{ padding: '16px 0' }}>
                  <SensitiveWords />
                </div>
              ),
            },
            {
              key: 'logs',
              label: <span><FileTextOutlined /> 操作日志</span>,
              children: (
                <div style={{ padding: '16px 0' }}>
                  <OperationLogs />
                </div>
              ),
            },
            {
              key: 'freight',
              label: <span><CarOutlined /> 运费模板</span>,
              children: (
                <div style={{ padding: '0 24px' }}>
                  <FreightConfig />
                </div>
              ),
            },
            {
              key: 'payment',
              label: <span><WalletOutlined /> 支付配置</span>,
              children: (
                <div style={{ padding: '0 24px' }}>
                  <PaymentConfig />
                </div>
              ),
            },
            {
              key: 'sms',
              label: <span><MessageOutlined /> 短信配置</span>,
              children: (
                <div style={{ padding: '0 24px' }}>
                  <SmsConfig />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default SystemPage;
