import { useState, useRef } from 'react';
import { Input, Button, Space, message } from 'antd';
import { UploadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '../utils/request';

export default function ImageUploader({ value, onChange, placeholder = '图片URL' }) {
  const [urlText, setUrlText] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await request.post('/public/upload', formData);
      const fileUrls = res.data?.files || [];
      if (fileUrls.length > 0) {
        onChange?.(fileUrls[0].url);
        message.success('上传成功');
      }
    } catch {
      message.error('上传失败');
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleUrlDownload = async () => {
    const url = urlText.trim();
    if (!url) return;
    if (!/^https?:\/\/.+/.test(url)) {
      message.warning('请输入有效的图片URL');
      return;
    }
    setUploading(true);
    try {
      const res = await request.post('/public/upload-url', { url });
      const localUrl = res.data?.url;
      if (localUrl) {
        onChange?.(localUrl);
        setUrlText('');
        message.success('已下载到服务器');
      }
    } catch {
      message.error('下载失败，请检查链接');
    }
    setUploading(false);
  };

  const handleClear = () => {
    onChange?.('');
    setUrlText('');
  };

  return (
    <div>
      {value && (
        <div style={{ marginBottom: 8 }}>
          <img src={value} alt="预览" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
          <Button type="link" size="small" icon={<DeleteOutlined />} onClick={handleClear} style={{ marginLeft: 8 }}>
            清除
          </Button>
        </div>
      )}
      <Input value={value || ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} style={{ marginBottom: 8 }} />
      <Space wrap>
        <Button icon={<UploadOutlined />} onClick={() => fileRef.current?.click()} loading={uploading} size="small">
          本地上传
        </Button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
        <Input
          value={urlText}
          onChange={(e) => setUrlText(e.target.value)}
          placeholder="粘贴网络图片URL"
          style={{ width: 220 }}
          size="small"
          onPressEnter={handleUrlDownload}
        />
        <Button icon={<DownloadOutlined />} onClick={handleUrlDownload} loading={uploading} disabled={!urlText.trim()} size="small">
          下载
        </Button>
      </Space>
    </div>
  );
}
