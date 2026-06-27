/* ============================================================
   核销二维码验证组件
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\components\QrVerify\index.tsx
   ============================================================ */
import { useState } from 'react';
import { Modal, Input, Button, Descriptions, Tag, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { verifyCheckIn } from '../../api/lodging';

export default function QrVerify() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleVerify = async () => {
    if (!code.trim()) { message.warning('请输入核销码'); return; }
    try { const r = await verifyCheckIn(code.trim()); setResult(r); message.success('核销成功！'); } catch (err: any) { message.error(err.message || '核销失败'); }
  };

  return (
    <>
      <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => { setOpen(true); setResult(null); setCode(''); }}>
        核销验证
      </Button>
      <Modal title="入住核销验证" open={open} onCancel={() => setOpen(false)} footer={null}>
        <Input.Search
          placeholder="请输入或扫描核销码"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onSearch={handleVerify}
          enterButton="验证"
          size="large"
        />
        {result && (
          <Descriptions column={1} size="small" style={{ marginTop: 16 }} bordered>
            <Descriptions.Item label="订单号">{result.order_no}</Descriptions.Item>
            <Descriptions.Item label="入住人">{result.contact_name}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color="green">已核销</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
}
