import React, { useState, useEffect, useCallback } from 'react'
import {
  Table, Button, Space, Select, Modal, Form, message,
  Popconfirm, Card, Row, Col, Typography, Tag, Descriptions
} from 'antd'
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { getOrderList, deleteOrder, updateOrder } from '../../api/index'

const { Title } = Typography
const { Option } = Select

const STATUS_MAP = {
  0: { color: 'orange', text: '待支付' },
  1: { color: 'blue', text: '已支付' },
  2: { color: 'green', text: '已完成' },
  3: { color: 'red', text: '已取消' },
  4: { color: 'purple', text: '已退款' },
}

export default function OrderPage() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [status, setStatus] = useState(undefined)
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailRecord, setDetailRecord] = useState(null)
  const [updating, setUpdating] = useState(false)

  const fetchList = useCallback(() => {
    setLoading(true)
    getOrderList({ page, pageSize, status })
      .then(res => {
        if (res.code === 200) {
          setList(res.data?.list || [])
          setTotal(res.data?.total || 0)
        }
      })
      .finally(() => setLoading(false))
  }, [page, pageSize, status])

  useEffect(() => { fetchList() }, [fetchList])

  const handleDelete = (id) => {
    deleteOrder(id).then(res => {
      if (res.code === 200) { message.success('删除成功'); fetchList() }
      else message.error(res.message || '删除失败')
    }).catch(() => message.error('删除失败'))
  }

  const handleStatusChange = (id, newStatus) => {
    setUpdating(true)
    updateOrder(id, { status: newStatus }).then(res => {
      if (res.code === 200) {
        message.success('状态更新成功')
        fetchList()
        if (detailRecord?.id === id) {
          setDetailRecord(prev => ({ ...prev, status: newStatus }))
        }
      } else {
        message.error(res.message || '更新失败')
      }
    }).catch(() => message.error('更新失败')).finally(() => setUpdating(false))
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '订单号', dataIndex: 'orderNo', width: 160, ellipsis: true },
    { title: '入住人', dataIndex: 'guestName', width: 90 },
    { title: '联系电话', dataIndex: 'guestPhone', width: 120 },
    {
      title: '入住日期', dataIndex: 'checkInDate', width: 110,
      render: d => d ? d.split('T')[0] : '-'
    },
    {
      title: '离店日期', dataIndex: 'checkOutDate', width: 110,
      render: d => d ? d.split('T')[0] : '-'
    },
    { title: '晚数', dataIndex: 'nights', width: 60 },
    {
      title: '总价', dataIndex: 'totalPrice', width: 100,
      render: p => p ? `¥${Number(p).toLocaleString()}` : '-'
    },
    {
      title: '状态', dataIndex: 'status', width: 90,
      render: s => {
        const m = STATUS_MAP[s]
        return m ? <Tag color={m.color}>{m.text}</Tag> : <Tag>{s}</Tag>
      }
    },
    {
      title: '操作', width: 180, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}
            onClick={() => { setDetailRecord(record); setDetailVisible(true) }}>
            详情
          </Button>
          <Popconfirm title="确认删除该订单？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><Title level={4} style={{ margin: 0 }}>订单管理</Title></Col>
        <Col>
          <Space>
            <Select placeholder="订单状态" value={status}
              onChange={v => { setStatus(v); setPage(1) }}
              style={{ width: 130 }} allowClear>
              {Object.entries(STATUS_MAP).map(([k, v]) =>
                <Option key={k} value={Number(k)}>{v.text}</Option>
              )}
            </Select>
            <Button onClick={() => { setStatus(undefined); setPage(1) }}>重置</Button>
          </Space>
        </Col>
      </Row>

      <Table columns={columns} dataSource={list} rowKey="id" loading={loading}
        scroll={{ x: 1100 }}
        pagination={{
          current: page, pageSize, total, showSizeChanger: false,
          showTotal: t => `共 ${t} 条`, onChange: p => setPage(p),
        }} />

      {/* 订单详情弹窗 */}
      <Modal title="订单详情" open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null} width={560}>
        {detailRecord && (
          <>
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="订单号" span={2}>{detailRecord.orderNo}</Descriptions.Item>
              <Descriptions.Item label="入住人">{detailRecord.guestName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{detailRecord.guestPhone}</Descriptions.Item>
              <Descriptions.Item label="入住日期">{detailRecord.checkInDate?.split('T')[0]}</Descriptions.Item>
              <Descriptions.Item label="离店日期">{detailRecord.checkOutDate?.split('T')[0]}</Descriptions.Item>
              <Descriptions.Item label="晚数">{detailRecord.nights} 晚</Descriptions.Item>
              <Descriptions.Item label="总价">¥{Number(detailRecord.totalPrice || 0).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="人数">{detailRecord.guests} 人</Descriptions.Item>
              <Descriptions.Item label="退订政策" span={2}>{detailRecord.cancelPolicy || '无'}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>{detailRecord.remark || '无'}</Descriptions.Item>
            </Descriptions>

            <Row gutter={8}>
              <Col span={24}>
                <Space wrap>
                  <span style={{ fontWeight: 500 }}>修改状态：</span>
                  {Object.entries(STATUS_MAP).map(([k, v]) => (
                    <Button key={k} size="small"
                      type={detailRecord.status === Number(k) ? 'primary' : 'default'}
                      onClick={() => handleStatusChange(detailRecord.id, Number(k))}
                      loading={updating}
                      danger={v.color === 'red'}>
                      {v.text}
                    </Button>
                  ))}
                </Space>
              </Col>
            </Row>
          </>
        )}
      </Modal>
    </Card>
  )
}
