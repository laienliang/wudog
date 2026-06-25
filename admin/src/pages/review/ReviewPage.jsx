import React, { useState, useEffect, useCallback } from 'react'
import {
  Table, Button, Space, Select, message, Popconfirm, Card,
  Row, Col, Typography, Tag, Rate, Modal
} from 'antd'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { getReviewList, deleteReview } from '../../api/index'

const { Title, Paragraph } = Typography
const { Option } = Select

export default function ReviewPage() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [rating, setRating] = useState(undefined)
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailRecord, setDetailRecord] = useState(null)

  const fetchList = useCallback(() => {
    setLoading(true)
    getReviewList({ page, pageSize, rating })
      .then(res => {
        if (res.code === 200) {
          setList(res.data?.list || [])
          setTotal(res.data?.total || 0)
        }
      })
      .finally(() => setLoading(false))
  }, [page, pageSize, rating])

  useEffect(() => { fetchList() }, [fetchList])

  const handleDelete = (id) => {
    deleteReview(id).then(res => {
      if (res.code === 200) { message.success('删除成功'); fetchList() }
      else message.error(res.message || '删除失败')
    }).catch(() => message.error('删除失败'))
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    {
      title: '评分', dataIndex: 'rating', width: 140,
      render: r => <Space size={4}><Rate disabled defaultValue={r} style={{ fontSize: 12 }} /><Tag color={r >= 4 ? 'green' : r >= 3 ? 'orange' : 'red'}>{r}分</Tag></Space>
    },
    {
      title: '评价内容', dataIndex: 'content', ellipsis: true, width: 260,
      render: c => c || '（无文字评价）'
    },
    {
      title: '用户', dataIndex: 'userId', width: 80,
      render: (id, r) => r.isAnonymous ? '匿名' : `用户${id}`
    },
    {
      title: '评价时间', dataIndex: 'createdAt', width: 160,
      render: d => d ? d.replace('T', ' ').split('.')[0] : '-'
    },
    {
      title: '操作', width: 120, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}
            onClick={() => { setDetailRecord(record); setDetailVisible(true) }}>
            查看
          </Button>
          <Popconfirm title="确认删除该评论？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><Title level={4} style={{ margin: 0 }}>评论管理</Title></Col>
        <Col>
          <Space>
            <Select placeholder="按评分筛选" value={rating}
              onChange={v => { setRating(v); setPage(1) }}
              style={{ width: 130 }} allowClear>
              {[5, 4, 3, 2, 1].map(r => <Option key={r} value={r}>{r}星</Option>)}
            </Select>
            <Button onClick={() => { setRating(undefined); setPage(1) }}>重置</Button>
          </Space>
        </Col>
      </Row>

      <Table columns={columns} dataSource={list} rowKey="id" loading={loading}
        scroll={{ x: 800 }}
        pagination={{
          current: page, pageSize, total, showSizeChanger: false,
          showTotal: t => `共 ${t} 条`, onChange: p => setPage(p),
        }} />

      <Modal title="评论详情" open={detailVisible}
        onCancel={() => setDetailVisible(false)} footer={null}>
        {detailRecord && (
          <div>
            <Space style={{ marginBottom: 12 }}>
              <Rate disabled defaultValue={detailRecord.rating} />
              <Tag color={detailRecord.rating >= 4 ? 'green' : 'orange'}>{detailRecord.rating}分</Tag>
              {detailRecord.isAnonymous && <Tag color="default">匿名</Tag>}
            </Space>
            <Paragraph style={{ background: '#f9f9f9', padding: 12, borderRadius: 8 }}>
              {detailRecord.content || '（无文字评价）'}
            </Paragraph>
            <div style={{ color: '#999', fontSize: 12 }}>
              评价时间：{detailRecord.createdAt?.replace('T', ' ').split('.')[0]}
            </div>
          </div>
        )}
      </Modal>
    </Card>
  )
}
