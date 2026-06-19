/**
 * 图片上传组件
 * 支持本地上传和 OSS 直传两种方式，提供上传进度、文件类型和大小校验
 */
import { useState, useEffect } from 'react';
import { Upload, message, Progress } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import request from '../utils/request';

/** 图片上传组件属性 */
interface ImageUploadProps {
  /** 当前图片 URL */
  value?: string;
  /** 图片 URL 变更回调 */
  onChange?: (url: string) => void;
  /** 最大文件大小（MB），默认 5 */
  maxSize?: number;
  /** 接受的文件类型，默认 .jpg,.jpeg,.png,.gif,.webp */
  accept?: string;
  /** 是否使用 OSS 直传，默认 false */
  useOss?: boolean;
}

/**
 * 图片上传组件
 * 支持本地上传和 OSS 直传两种方式
 */
export default function ImageUpload({
  value,
  onChange,
  maxSize = 5,
  accept = '.jpg,.jpeg,.png,.gif,.webp',
  useOss = false,
}: ImageUploadProps) {
  /** 上传加载状态 */
  const [loading, setLoading] = useState(false);
  /** OSS 签名凭证 */
  const [ossToken, setOssToken] = useState<any>(null);

  // 获取 OSS 签名
  useEffect(() => {
    if (useOss) {
      fetchOssToken();
    }
  }, [useOss]);

  /** 获取 OSS 上传签名凭证 */
  const fetchOssToken = async () => {
    try {
      const res: any = await request.post('/upload/oss-token', {});
      if (res.code === 200) {
        setOssToken(res.data);
      }
    } catch (err) {
      console.error('获取 OSS 签名失败:', err);
    }
  };

  /**
   * 将相对路径转换为完整 URL 用于预览
   * @param url - 原始图片路径
   * @returns 完整的图片 URL
   */
  const getFullUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3001${url}`;
  };

  /** 当前文件列表，用于 Upload 组件展示 */
  const fileList: UploadFile[] = value
    ? [{ uid: '-1', name: 'image', status: 'done', url: getFullUrl(value) }]
    : [];

  /**
   * 自定义上传逻辑
   * 根据 useOss 参数选择 OSS 直传或本地服务器上传
   */
  const customUpload = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options;

    setLoading(true);

    if (useOss && ossToken) {
      // OSS 直传
      try {
        const ext = file.name.split('.').pop();
        const key = `${ossToken.dir}${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

        const formData = new FormData();
        formData.append('key', key);
        formData.append('OSSAccessKeyId', ossToken.accessKeyId);
        formData.append('policy', ossToken.policy);
        formData.append('signature', ossToken.signature);
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', ossToken.host, true);

        /** OSS 上传进度回调 */
        xhr.upload.onprogress = (e) => {
          if (e.total > 0) {
            onProgress({ percent: Math.round((e.loaded / e.total) * 100) });
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            const url = `${ossToken.host}/${key}`;
            onSuccess({ code: 200, data: { url } });
            message.success('上传成功');
          } else {
            onError(new Error('上传失败'));
            message.error('上传失败');
          }
          setLoading(false);
        };

        xhr.onerror = () => {
          onError(new Error('上传失败'));
          message.error('上传失败');
          setLoading(false);
        };

        xhr.send(formData);
      } catch (err) {
        onError(err);
        message.error('上传失败');
        setLoading(false);
      }
    } else {
      // 本地上传
      try {
        const formData = new FormData();
        formData.append('files', file);

        const res: any = await request.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.code === 200) {
          onSuccess(res);
          message.success('上传成功');
        } else {
          onError(new Error(res.message));
          message.error(res.message || '上传失败');
        }
      } catch (err: any) {
        onError(err);
        message.error('上传失败');
      }
      setLoading(false);
    }
  };

  /**
   * 上传状态变更处理
   * 上传成功时回调 onChange 返回图片 URL，移除时回调空字符串
   */
  const handleChange: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'done') {
      const url = file.response?.data?.url;
      if (url) {
        onChange?.(url);
      }
    }
    if (file.status === 'removed') {
      onChange?.('');
    }
  };

  /**
   * 上传前校验
   * 验证文件类型是否为图片、文件大小是否超限
   */
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件');
      return false;
    }
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(`图片大小不能超过${maxSize}MB`);
      return false;
    }
    return true;
  };

  return (
    <Upload
      name="files"
      customRequest={customUpload}
      fileList={fileList}
      onChange={handleChange}
      beforeUpload={beforeUpload}
      accept={accept}
      listType="picture-card"
      maxCount={1}
      onRemove={() => onChange?.('')}
    >
      {!value && (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>{loading ? '上传中...' : '上传图片'}</div>
        </div>
      )}
    </Upload>
  );
}
