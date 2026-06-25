import React, { useState, useEffect, useCallback } from 'react'
import {
  Table, Button, Space, Input, Select, Modal, Form, InputNumber,
  message, Popconfirm, Card, Row, Col, Typography
} from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getRoomList, createRoom, updateRoom, deleteRoom, getAccommodationList } from '../../api/index'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

export default function RoomPage() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [accommodationId, setAccommodationId] = useState(undefined)
  const [accommodations, setAccommodations] = useState([])

  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  // 加载住宿列表（用于下拉）
  useEffect(() => {
    getAccommodationList({ page: 1, pageSize: 100 }).then(res => {
      if (res.code === 200) setAccommodations(res.data?.list || [])
    }).catch(() => {})
  }, [])

  const fetchList = useCallback(() => {
    setLoading(true)
    getRoomList({ page, pageSize, keyword, accommodationId })
      .then(res => {
        if (res.code === 200) {
          setList(res.data?.list || [])
          setTotal(res.data?.total || 0)
        }
      })
      .finally(() => setLoading(false))
  }, [page, pageSize, keyword, accommodationId])

  useEffect(() => { fetchList() }, [fetchList])

  const openAdd = () => {
    setEditRecord(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditRecord(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      setSubmitting(true)
      const action = editRecord ? updateRoom(editRecord.id, values) : createRoom(values)
      action.then(res => {
        if (res.code === 200) {
          message.success(editRecord ? '更新成功' : '新增成功')
          setModalOpen(false)
          fetchList()
        } else {
          message.error(res.message || '操作失败')
        }
      }).catch(() => message.error('操作失败')).finally(() => setSubmitting(false))
    })
  }

  const handleDelete = (id) => {
    deleteRoom(id).then(res => {
      if (res.code === 200) { message.success('删除成功'); fetchList() }
      else message.error(res.message || '删除失败')
    }).catch(() => message.error('删除失败'))
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '房型名称', dataIndex: 'name', width: 160, ellipsis: true },
    {
      title: '所属住宿', dataIndex: 'accommodationId', width: 160,
      render: id => accommodations.find(a => a.id === id)?.name || `ID:${id}`
    },
    {
      title: '床型', dataIndex: 'bedType', width: 100,
      render: t => ({ king: '大床', double: '双床', suite: '套房', dorm: '通铺', treehouse: '树屋' }[t] || t || '-')
    },
    { title: '容纳人数', dataIndex: 'capacity', width: 90 },
    {
      title: '价格(¥/晚)', dataIndex: 'price', width: 110,
      render: p => p ? `¥${Number(p).toLocaleString()}` : '-'
    },
    {
      title: '操作', width: 140, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除该房型？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><Title level={4} style={{ margin: 0 }}>房型管理</Title></Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}
            style={{ background: '#1a6b3a', borderColor: '#1a6b3a' }}>
            新增房型
          </Button>
        </Col>
      </Row>

      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col>
          <Input placeholder="搜索房型名称" prefix={<SearchOutlined />}
            value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1) }}
            style={{ width: 200 }} allowClear />
        </Col>
        <Col>
          <Select placeholder="所属住宿" value={accommodationId}
            onChange={v => { setAccommodationId(v); setPage(1) }}
            style={{ width: 200 }} allowClear>
            {accommodations.map(a => <Option key={a.id} value={a.id}>{a.name}</Option>)}
          </Select>
        </Col>
        <Col>
          <Button onClick={() => { setKeyword(''); setAccommodationId(undefined); setPage(1) }}>重置</Button>
        </Col>
      </Row>

      <Table columns={columns} dataSource={list} rowKey="id" loading={loading}
        scroll={{ x: 800 }}
        pagination={{
          current: page, pageSize, total, showSizeChanger: false,
          showTotal: t => `共 ${t} 条`, onChange: p => setPage(p),
        }} />

      <Modal title={editRecord ? '编辑房型' : '新增房型'} open={modalOpen}
        onCancel={() => setModalOpen(false)} onOk={handleSubmit}
        confirmLoading={submitting} width={560} destroyOnClose>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="房型名称" rules={[{ required: true }]}>
                <Input placeholder="请输入房型名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="accommodationId" label="所属住宿" rules={[{ required: true }]}>
                <Select placeholder="请选择住宿">
                  {accommodations.map(a => <Option key={a.id} value={a.id}>{a.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bedType" label="床型">
                <Select placeholder="请选择床型" allowClear>
                  <Option value="king">大床</Option>
                  <Option value="double">双床</Option>
                  <Option value="suite">套房</Option>
                  <Option value="dorm">通铺</Option>
                  <Option value="treehouse">树屋</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="capacity" label="容纳人数">
                <InputNumber min={1} max={20} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="price" label="基准价格(¥/晚)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="area" label="房间面积(㎡)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="房型简介">
                <TextArea rows={2} placeholder="房型简介" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  )
}
