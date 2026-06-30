import React, { useState, useRef } from 'react';
import {
  Button, Modal, Form, Input, message, Tag, Space, Card, Typography,
  Tooltip, Empty, Select, Divider, Tabs,
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
  FileTextOutlined,
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
   模块选项（审核通过时选择）
   ============================================================ */
const MODULE_OPTIONS = [
  { label: '衣·民族商品', value: 'clothing' },
  { label: '食·餐饮美食', value: 'food' },
  { label: '住·民宿住宿', value: 'accommodation' },
  { label: '行·旅游线路', value: 'travel' },
];

/* ============================================================
   状态映射
   ============================================================ */
const STATUS_TAB_MAP: Record<string, number> = {
  pending: 0,
  approved: 1,
  rejected: 2,
};

const STATUS_LABEL_MAP: Record<number, { label: string; color: string }> = {
  0: { label: '待审核', color: 'processing' },
  1: { label: '已通过', color: 'success' },
  2: { label: '已驳回', color: 'error' },
};

/* ============================================================
   申请表格组件（按 Tab 复用）
   ============================================================ */
const ApplicationTable: React.FC<{ status: number }> = ({ status }) => {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  // 自定义请求
  const fetchApplications = async (params: any) => {
    const { current, pageSize, ...rest } = params;
    try {
      const res = await adminApi.listMerchantApplications({
        page: current,
        pageSize,
        status,
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

  // 打开审核弹窗
  const handleReview = (record: any, action: 'approve' | 'reject') => {
    setSelectedApp(record);
    setReviewAction(action);
    form.resetFields();
    setReviewOpen(true);
  };

  // 提交审核
  const handleSubmitReview = async () => {
    if (!selectedApp) return;
    try {
      if (reviewAction === 'approve') {
        const values = await form.validateFields();
        await adminApi.reviewMerchantApplication(selectedApp.id, {
          status: 1,
          module: values.module,
          reviewerId: 1,
        });
        message.success('入驻申请已通过');
      } else {
        const values = await form.validateFields();
        await adminApi.reviewMerchantApplication(selectedApp.id, {
          status: 2,
          rejectReason: values.rejectReason,
        });
        message.success('已驳回入驻申请');
      }
      setReviewOpen(false);
      setSelectedApp(null);
      actionRef.current?.reload();
    } catch (err: any) {
      if (err.errorFields) return;
      message.error('操作失败');
    }
  };

  // 表格列配置
  const columns: ProColumns<any>[] = [
    {
      title: '排序',
      width: 55,
      align: 'center',
      render: (_: any, _r: any, index: number) => (
        <Tag style={{ borderRadius: 8, minWidth: 20, textAlign: 'center', fontSize: 11 }}>{index + 1}</Tag>
      ),
    },
    {
      title: '店铺名',
      dataIndex: 'shopName',
      width: 160,
      render: (_, r) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{r.shopName || r.name || '未命名'}</Text>
          <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>ID: {r.id}</Text>
        </div>
      ),
    },
    {
      title: '申请模块',
      dataIndex: 'module',
      width: 110,
      align: 'center',
      render: (v: string) => {
        const mod = MODULE_OPTIONS.find(m => m.value === v);
        return mod ? (
          <Tag color="blue" style={{ borderRadius: 4 }}>{mod.label}</Tag>
        ) : <Text type="secondary">-</Text>;
      },
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      width: 100,
      render: (v) => <Text>{v || '-'}</Text>,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      width: 130,
      render: (v) => <Text>{v ? v.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '-'}</Text>,
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      width: 130,
      align: 'center',
      render: (v) => v ? (
        <Tooltip title={dayjs(v).format('YYYY-MM-DD HH:mm:ss')}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(v).format('YYYY-MM-DD HH:mm')}
          </Text>
        </Tooltip>
      ) : '-',
    },
    {
      title: '操作',
      width: 180,
      align: 'center',
      render: (_, record) => {
        if (status !== 0) {
          // 已处理状态，显示状态标签
          const st = STATUS_LABEL_MAP[status];
          return st ? (
            <Tag color={st.color} style={{ borderRadius: 4 }}>{st.label}</Tag>
          ) : null;
        }
        // 待审核状态，显示操作按钮
        return (
          <Space size={0}>
            <Tooltip title="查看申请资料">
              <Button
                type="text"
                size="small"
                icon={<FileTextOutlined />}
                onClick={() => handleReview(record, 'approve')}
                style={{ color: COLORS.primary }}
              >
                审核
              </Button>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="通过申请">
              <Button
                type="text"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleReview(record, 'approve')}
                style={{ color: COLORS.success }}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="驳回申请">
              <Button
                type="text"
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReview(record, 'reject')}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
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
          request={fetchApplications}
          search={false}
          // ---- 分页 ----
          pagination={{
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50'],
            showSizeChanger: true,
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
                description={status === 0 ? '暂无待审核申请' : status === 1 ? '暂无已通过申请' : '暂无已驳回申请'}
              />
            ),
          }}
          sticky={{ offsetHeader: 0 }}
        />
      </Card>

      {/* ===== 审核弹窗 ===== */}
      <Modal
        title={
          <Space>
            {reviewAction === 'approve'
              ? <CheckCircleOutlined style={{ color: COLORS.success }} />
              : <CloseCircleOutlined style={{ color: COLORS.danger }} />
            }
            <span>{reviewAction === 'approve' ? '通过入驻申请' : '驳回入驻申请'}</span>
          </Space>
        }
        open={reviewOpen}
        onOk={handleSubmitReview}
        onCancel={() => { setReviewOpen(false); setSelectedApp(null); }}
        okText={reviewAction === 'approve' ? '确认通过' : '确认驳回'}
        cancelText="取消"
        okButtonProps={{ danger: reviewAction === 'reject' }}
        width={520}
        destroyOnClose
        style={{ top: 40 }}
      >
        <div style={{ padding: '8px 0' }}>
          {/* 申请者信息 + 资质材料 */}
          <Card
            size="small"
            style={{
              marginBottom: 16,
              borderRadius: 8,
              background: '#fafafa',
              border: '1px solid #f0f0f0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text type="secondary">店铺：</Text>
              <Text strong>{selectedApp?.shopName || selectedApp?.name || '未知'}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text type="secondary">联系人：</Text>
              <Text>{selectedApp?.contactName || selectedApp?.contactPerson || '-'}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">电话：</Text>
              <Text>{selectedApp?.contactPhone
                ? selectedApp.contactPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
                : '-'}</Text>
            </div>
            {selectedApp?.credentials && (
              <>
                <Divider style={{ margin: '8px 0' }} />
                <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>资质材料：</Text>
                <div style={{
                  background: '#fff', padding: '8px 12px', borderRadius: 6,
                  fontSize: 12, color: '#666', maxHeight: 120, overflowY: 'auto',
                  fontFamily: 'monospace', whiteSpace: 'pre-wrap',
                }}>
                  {(() => {
                    try { return JSON.stringify(JSON.parse(selectedApp.credentials), null, 2); }
                    catch { return selectedApp.credentials; }
                  })()}
                </div>
              </>
            )}
          </Card>

          <Form
            form={form}
            layout="vertical"
          >
            {reviewAction === 'approve' ? (
              <Form.Item
                name="module"
                label="分配所属模块"
                rules={[{ required: true, message: '请选择商家所属模块' }]}
                tooltip="选择该商家在前台展示的所属业务模块"
              >
                <Select
                  placeholder="请选择所属模块"
                  options={MODULE_OPTIONS}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            ) : (
              <Form.Item
                name="rejectReason"
                label="驳回原因"
                rules={[
                  { required: true, message: '请填写驳回原因' },
                  { min: 5, message: '驳回原因至少5个字符' },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="请填写驳回原因，将通知申请商家"
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
};

/* ============================================================
   主组件 - Tab 切换
   ============================================================ */
const MerchantApplications: React.FC = () => {
  const [activeKey, setActiveKey] = useState('pending');

  return (
    <div style={{ padding: 0 }}>
      <Card
        style={{
          borderRadius: 10,
          border: 'none',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
        styles={{ body: { padding: '0 24px', paddingTop: 0 } }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={[
            {
              key: 'pending',
              label: (
                <span>
                  <ExclamationCircleOutlined />
                  {' '}待审核
                </span>
              ),
              children: <ApplicationTable status={0} />,
            },
            {
              key: 'approved',
              label: (
                <span>
                  <CheckCircleOutlined />
                  {' '}已通过
                </span>
              ),
              children: <ApplicationTable status={1} />,
            },
            {
              key: 'rejected',
              label: (
                <span>
                  <CloseCircleOutlined />
                  {' '}已驳回
                </span>
              ),
              children: <ApplicationTable status={2} />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default MerchantApplications;
