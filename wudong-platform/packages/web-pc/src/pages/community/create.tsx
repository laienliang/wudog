import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography, Select, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const { TextArea } = Input;
const api = axios.create({ baseURL: '/api/v1' });

const CreateTravelogue: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.warning('请先登录');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: values.title,
        content: values.content,
        coverImage: values.coverImage || '',
        location: values.location || '',
        topicId: values.topicId || undefined,
        status: 0, // 待审核
      };
      await api.post('/travelogues', payload, {
        headers: { Authorization: 'Bearer ' + token },
      });
      message.success('游记发布成功！等待审核');
      navigate('/community');
    } catch (err: any) {
      message.error(err?.response?.data?.message || '发布失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}
        style={{ marginBottom: 16, fontSize: 15, color: '#1F5FA8' }}>返回</Button>

      <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Title level={4} style={{ marginBottom: 24 }}>✏️ 发表游记</Title>

        <Form form={form} layout="vertical" onFinish={handleSubmit}
          initialValues={{ status: 0 }}>
          <Form.Item name="title" label="游记标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="输入游记标题" maxLength={100} showCount />
          </Form.Item>

          <Form.Item name="content" label="游记内容" rules={[{ required: true, message: '请输入内容' }]}>
            <TextArea rows={8} placeholder="分享你在苗寨的旅行见闻..." maxLength={5000} showCount />
          </Form.Item>

          <Form.Item name="coverImage" label="封面图 URL">
            <Input placeholder="https://...（选填）" />
          </Form.Item>

          <Form.Item name="location" label="地点">
            <Input placeholder="如：苗寨观景台、梯田景区（选填）" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={submitting}
              style={{ height: 44, borderRadius: 8, fontWeight: 600, fontSize: 15, background: '#1F5FA8', paddingInline: 40 }}>
              发布游记
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTravelogue;
