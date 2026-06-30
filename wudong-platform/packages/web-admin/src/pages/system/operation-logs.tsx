import React, { useRef } from 'react';
import {
  Tag, Space, Typography, Tooltip, Empty,
} from 'antd';
import {
  ReloadOutlined,
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
   操作类型映射
   ============================================================ */
const ACTION_TYPE_MAP: Record<string, { text: string; color: string }> = {
  create: { text: '新增', color: 'green' },
  update: { text: '修改', color: 'blue' },
  delete: { text: '删除', color: 'red' },
  login: { text: '登录', color: 'cyan' },
  logout: { text: '退出', color: 'default' },
  review: { text: '审核', color: 'purple' },
  export: { text: '导出', color: 'geekblue' },
  config: { text: '配置', color: 'orange' },
};

/* ============================================================
   操作日志页面（只读）
   ============================================================ */
const OperationLogs: React.FC = () => {
  const actionRef = useRef<ActionType>();

  // 自定义请求
  const fetchLogs = async (params: any) => {
    const { current, pageSize, ...rest } = params;
    try {
      const res = await adminApi.listOperationLogs({
        page: current,
        pageSize,
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

  // 表格列配置
  const columns: ProColumns<any>[] = [
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 140,
      ellipsis: true,
      render: (v) => v ? (
        <Text strong>{v}</Text>
      ) : <Text type="secondary">-</Text>,
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      width: 110,
      align: 'center',
      render: (v) => {
        const actionInfo = ACTION_TYPE_MAP[v] || { text: v || '未知', color: 'default' };
        return <Tag color={actionInfo.color}>{actionInfo.text}</Tag>;
      },
    },
    {
      title: '操作对象',
      dataIndex: 'target',
      width: 180,
      ellipsis: true,
      render: (v) => v ? (
        <Text code style={{ fontSize: 12 }}>{v}</Text>
      ) : <Text type="secondary">-</Text>,
    },
    {
      title: '操作详情',
      dataIndex: 'detail',
      width: 300,
      ellipsis: true,
      render: (v) => v ? (
        <Tooltip title={v}>
          <Text style={{ fontSize: 13 }}>{v}</Text>
        </Tooltip>
      ) : <Text type="secondary">-</Text>,
    },
    {
      title: 'IP 地址',
      dataIndex: 'ip',
      width: 140,
      align: 'center',
      render: (v) => v ? (
        <Text copyable code style={{ fontSize: 12 }}>{v}</Text>
      ) : <Text type="secondary">-</Text>,
    },
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      width: 140,
      align: 'center',
      sorter: true,
      defaultSortOrder: 'descend',
      render: (v) => v ? (
        <Tooltip title={dayjs(v).format('YYYY-MM-DD HH:mm:ss')}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(v).format('YYYY-MM-DD HH:mm')}
          </Text>
        </Tooltip>
      ) : '-',
    },
  ];

  return (
    <ProTable
      actionRef={actionRef}
      columns={columns}
      rowKey="id"
      request={fetchLogs}
      search={false}
      toolBarRender={() => [
        <ReloadOutlined
          key="refresh"
          style={{ fontSize: 16, cursor: 'pointer', color: COLORS.textSecondary }}
          onClick={() => actionRef.current?.reload()}
        />,
      ]}
      pagination={{
        pageSize: 15,
        pageSizeOptions: ['15', '30', '50', '100'],
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
            description={<span>暂无操作日志</span>}
          />
        ),
      }}
      sticky={{ offsetHeader: 0 }}
    />
  );
};

export default OperationLogs;
