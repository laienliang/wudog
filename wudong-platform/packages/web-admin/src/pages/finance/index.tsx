import React, { useState, useRef } from 'react';
import {
  Tag, Space, Card, Typography, Tooltip, Empty,
} from 'antd';
import {
  ReloadOutlined, DollarOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import dayjs from 'dayjs';
import { adminApi } from '../../services/admin';

const { Text } = Typography;

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
   结算状态映射
   ============================================================ */
const SETTLEMENT_STATUS_MAP: Record<number, { text: string; color: string }> = {
  0: { text: '待结算', color: 'orange' },
  1: { text: '已结算', color: 'blue' },
  2: { text: '已到账', color: 'green' },
};

/* ============================================================
   财务管理页面
   ============================================================ */
const FinancePage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  // 自定义请求
  const fetchFinance = async (params: any) => {
    const { current, pageSize, status, ...rest } = params;
    try {
      const res = await adminApi.listFinance({
        page: current,
        pageSize,
        status: status !== undefined && status !== null ? Number(status) : undefined,
        ...rest,
      });
      const data = res.data || res;
      const list = data.list || [];
      const pagination = data.pagination || { total: 0 };
      return { data: list, success: true, total: pagination.total || 0 };
    } catch {
      return { data: [], success: false, total: 0 };
    }
  };

  // 金额格式化
  const formatMoney = (value: number | string | undefined | null) => {
    if (value === null || value === undefined) return '-';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `¥${num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // 表格列配置
  const columns: ProColumns<any>[] = [
    { title: '#', width: 45, search: false, render: (_: any, __: any, i: number) => i + 1 },
    {
      title: '结算单号',
      dataIndex: 'orderNo',
      width: 200,
      ellipsis: true,
      render: (v) => v ? (
        <Text copyable code style={{ fontSize: 12 }}>{v}</Text>
      ) : <Text type="secondary">-</Text>,
    },
    {
      title: '商家名称',
      dataIndex: 'shopName',
      width: 160,
      ellipsis: true,
      render: (v) => v ? (
        <Space>
          <DollarOutlined style={{ color: COLORS.primary, fontSize: 16 }} />
          <Text strong>{v}</Text>
        </Space>
      ) : <Text type="secondary">-</Text>,
    },
    {
      title: '订单金额',
      dataIndex: 'amount',
      width: 130,
      align: 'right',
      render: (v) => <Text style={{ fontWeight: 500 }}>{formatMoney(v)}</Text>,
    },
    {
      title: '平台抽佣',
      dataIndex: 'platformFee',
      width: 130,
      align: 'right',
      render: (v) => <Text type="danger">{formatMoney(v)}</Text>,
    },
    {
      title: '商家收入',
      dataIndex: 'merchantIncome',
      width: 130,
      align: 'right',
      render: (v) => <Text style={{ color: COLORS.success, fontWeight: 500 }}>{formatMoney(v)}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        0: { text: '待结算', status: 'Warning' },
        1: { text: '已结算', status: 'Processing' },
        2: { text: '已到账', status: 'Success' },
      },
      render: (v: any) => {
        const num = Number(v);
        const statusInfo = SETTLEMENT_STATUS_MAP[num] || { text: v || '未知', color: 'default' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '结算时间',
      dataIndex: 'settledAt',
      width: 140,
      align: 'center',
      sorter: true,
      render: (v) => v ? (
        <Tooltip title={dayjs(v).format('YYYY-MM-DD HH:mm:ss')}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(v).format('YYYY-MM-DD HH:mm')}
          </Text>
        </Tooltip>
      ) : (
        <Text type="secondary">-</Text>
      ),
    },
  ];

  return (
    <div style={{ padding: 0 }}>
      <Card
        style={{
          borderRadius: 10,
          border: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
        styles={{ body: { padding: '16px 24px' } }}
      >
        <ProTable
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={fetchFinance}
          search={{
            labelWidth: 'auto',
            defaultCollapsed: false,
            collapseRender: (collapsed) => collapsed ? '展开筛选' : '收起筛选',
            optionRender: (searchConfig, formProps, dom) => [
              ...dom,
              <a
                key="reset"
                onClick={() => {
                  formProps.form?.resetFields();
                  actionRef.current?.reload();
                }}
                style={{ color: COLORS.textSecondary }}
              >
                重置
              </a>,
            ],
          }}
          toolBarRender={() => [
            <ReloadOutlined
              key="refresh"
              style={{ fontSize: 16, cursor: 'pointer', color: COLORS.textSecondary }}
              onClick={() => actionRef.current?.reload()}
            />,
          ]}
          pagination={{
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50', '100'],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`,
          }}
          options={{
            density: true,
            fullScreen: true,
            reload: true,
            setting: true,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span>暂无结算记录</span>}
              />
            ),
          }}
          sticky={{ offsetHeader: 0 }}
        />
      </Card>
    </div>
  );
};

export default FinancePage;
