import React, { useState, useRef } from 'react';
import { Button, message, Tag, Card, Space, Typography, Empty, Input, Modal } from 'antd';
import { VerificationOutlined, CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { travelApi } from '../../../services/travel';

const { Text } = Typography;
const STATUS_MAP: Record<number, { color: string; text: string }> = {
  0: { color: 'processing', text: '未使用' },
  1: { color: 'success', text: '已核销' },
  2: { color: 'default', text: '已过期' },
};

const ETicketTab: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [verifyCode, setVerifyCode] = useState('');

  const columns: ProColumns<any>[] = [
    { title: '票码', dataIndex: 'ticketCode', width: 160, render: (v) => <Text copyable style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</Text> },
    { title: '订单号', dataIndex: 'orderNo', width: 160, render: (v) => <Text style={{ fontSize: 12 }}>{v || '-'}</Text> },
    { title: '金额', dataIndex: 'totalAmount', width: 80, align: 'right', render: (v) => <Text style={{ color: '#E85D2F', fontWeight: 600 }}>¥{Number(v).toFixed(2)}</Text> },
    {
      title: '状态', dataIndex: 'status', width: 80, align: 'center',
      render: (v) => { const cfg = STATUS_MAP[Number(v)] || { color: 'default', text: '未知' }; return <Tag color={cfg.color} style={{ borderRadius: 4 }}>{cfg.text}</Tag>; },
    },
    { title: '核销时间', dataIndex: 'usedAt', width: 100, render: (v) => v ? String(v).slice(0, 16) : '-' },
    { title: '创建时间', dataIndex: 'createdAt', width: 90, render: (v) => v ? String(v).slice(0, 10) : '-' },
  ];

  const handleVerify = async () => {
    if (!verifyCode.trim()) { message.warning('请输入核销码'); return; }
    try {
      await travelApi.verifyETicket(verifyCode.trim());
      message.success('核销成功！');
      setVerifyCode('');
      actionRef.current?.reload();
    } catch { message.error('核销失败，请检查票码'); }
  };

  return (
    <div>
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }} styles={{ body: { padding: '16px 24px' } }}>
        <Space>
          <Input placeholder="输入核销码" value={verifyCode} onChange={e => setVerifyCode(e.target.value)}
            onPressEnter={handleVerify} style={{ width: 280 }} prefix={<SearchOutlined />} />
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleVerify}
            style={{ background: '#1F5FA8' }}>核销</Button>
        </Space>
      </Card>
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 24px' } }}>
        <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
          request={async () => { try { const res = await travelApi.listETickets({ page: 1, pageSize: 100 }); return { data: res?.data?.list || [], success: true }; } catch { return { data: [], success: false }; } }}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无电子票数据" /> }}
        />
      </Card>
    </div>
  );
};
export default ETicketTab;
