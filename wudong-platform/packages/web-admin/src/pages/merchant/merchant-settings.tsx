import React from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Typography,
  Space,
  Divider,
  Descriptions,
} from 'antd';
import {
  ShopOutlined,
  SaveOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;

/* ============================================================
   商家品牌色
   ============================================================ */
const COLORS = {
  primary: '#6B8E3D',
  primaryLight: '#8DB560',
  accent: '#8B6B4A',
};

/* ============================================================
   店铺设置页面
   ============================================================ */
const MerchantSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      // MVP: 模拟保存，后续对接真实 API
      console.log('Save merchant settings:', values);
      // 模拟网络延迟
      await new Promise((resolve) => setTimeout(resolve, 500));
      message.success({
        content: '店铺设置已保存',
        icon: <SaveOutlined style={{ color: COLORS.primary }} />,
      });
    } catch (err: any) {
      if (err.errorFields) {
        // 表单校验未通过，无需额外提示
        return;
      }
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info('已重置为上次保存的值');
  };

  return (
    <div style={{ padding: 0 }}>
      {/* ===== 页面标题 ===== */}
      <Card
        style={{
          borderRadius: 10,
          border: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          marginBottom: 16,
        }}
        styles={{ body: { padding: '16px 24px' } }}
      >
        <Space>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 18,
          }}>
            <ShopOutlined />
          </div>
          <div>
            <Title level={4} style={{ margin: 0, color: '#262626' }}>店铺设置</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              管理你的店铺基本信息，展示给游客查看
            </Text>
          </div>
        </Space>
      </Card>

      <Card
        style={{
          borderRadius: 10,
          border: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
        styles={{ body: { padding: '24px 32px' } }}
      >
        {/* ===== 当前店铺概览 ===== */}
        <Descriptions
          column={3}
          size="small"
          style={{ marginBottom: 24 }}
          colon={false}
        >
          <Descriptions.Item label={<Text type="secondary">店铺状态</Text>}>
            <span style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              background: '#F6FFED',
              color: '#52c41a',
              border: '1px solid #B7EB8F',
            }}>
              正常营业
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={<Text type="secondary">入驻时间</Text>}>
            <Text>2026-03-15</Text>
          </Descriptions.Item>
          <Descriptions.Item label={<Text type="secondary">所属模块</Text>}>
            <span style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              background: '#F0F5FF',
              color: COLORS.primary,
              border: `1px solid ${COLORS.primaryLight}`,
            }}>
              民族服饰
            </span>
          </Descriptions.Item>
        </Descriptions>

        <Divider style={{ margin: '0 0 24px' }} />

        {/* ===== 设置表单 ===== */}
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            shopName: '乌东苗绣工坊',
            contactName: '杨女士',
            contactPhone: '13988886666',
            shopDescription: '乌东苗寨百年传承的手工苗绣工坊，专注苗绣、蜡染、银饰等民族手工艺品的设计与制作。每一件作品都承载着苗族文化的故事与温度。',
            coverImage: 'https://example.com/shop-cover.jpg',
          }}
          style={{ maxWidth: 640 }}
        >
          <Form.Item
            name="shopName"
            label="店铺名称"
            rules={[
              { required: true, message: '请输入店铺名称' },
              { max: 50, message: '店铺名称最多 50 个字符' },
            ]}
            tooltip={{ title: '店铺名称将展示在商品详情和订单中', icon: <InfoCircleOutlined /> }}
          >
            <Input
              placeholder="请输入店铺名称"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Space size={16} style={{ display: 'flex' }} align="start">
            <Form.Item
              name="contactName"
              label="联系人"
              rules={[{ required: true, message: '请输入联系人' }]}
              style={{ flex: 1 }}
            >
              <Input
                placeholder="请输入联系人姓名"
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="contactPhone"
              label="联系电话"
              rules={[
                { required: true, message: '请输入联系电话' },
                { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
              ]}
              style={{ flex: 1 }}
            >
              <Input
                placeholder="请输入手机号"
                size="large"
                style={{ borderRadius: 8 }}
                maxLength={11}
              />
            </Form.Item>
          </Space>

          <Form.Item
            name="shopDescription"
            label="店铺简介"
            rules={[
              { required: true, message: '请输入店铺简介' },
              { max: 500, message: '店铺简介最多 500 个字符' },
            ]}
            tooltip={{ title: '优质的店铺简介能吸引更多游客下单', icon: <InfoCircleOutlined /> }}
          >
            <TextArea
              placeholder="请描述你的店铺特色、主营商品和服务..."
              rows={4}
              maxLength={500}
              showCount
              style={{ borderRadius: 8, resize: 'none' }}
            />
          </Form.Item>

          <Form.Item
            name="coverImage"
            label="封面图 URL"
            rules={[
              { required: true, message: '请输入封面图 URL' },
              { type: 'url', message: '请输入有效的 URL 地址' },
            ]}
            tooltip={{ title: '封面图将展示在店铺首页顶部，建议尺寸 1200x400px', icon: <InfoCircleOutlined /> }}
          >
            <Input
              placeholder="https://example.com/shop-cover.jpg"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Divider style={{ margin: '16px 0 24px' }} />

          {/* ===== 操作按钮 ===== */}
          <Space size={16}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving}
              size="large"
              style={{
                borderRadius: 8,
                background: COLORS.primary,
                borderColor: COLORS.primary,
                boxShadow: '0 2px 6px rgba(107, 142, 61, 0.3)',
                paddingLeft: 24,
                paddingRight: 24,
                height: 44,
              }}
            >
              保存设置
            </Button>
            <Button
              size="large"
              onClick={handleReset}
              style={{ borderRadius: 8, height: 44, paddingLeft: 24, paddingRight: 24 }}
            >
              重置
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default MerchantSettings;
