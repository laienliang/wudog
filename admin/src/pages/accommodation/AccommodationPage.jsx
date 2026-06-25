import React, { useState, useEffect, useCallback } from 'react'
import {
  Table, Button, Space, Input, Select, Modal, Form, InputNumber,
  message, Popconfirm, Tag, Card, Row, Col, Typography, Rate
} from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  getAccommodationList, createAccommodation, updateAccommodation,
  deleteAccommodation, getVillageList
} from '../../api/index'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

const TYPE_MAP = {
  homestay: { color: 'green', text: '民宿' },
  inn: { color: 'blue', text: '客栈' },
  hotel: { color: 'purple', text: '酒店' },
}

export default function AccommodationPage() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [villageId, setVillageId] = useState(undefined)
  const [type, setType] = useState(undefined)
  const [villages, setVillages] = useState([])

  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  // 加载苗寨
  useEffect(() => {
    getVillageList({ page: 1, pageSize: 50 }).then(res => {
      if (res.code === 200) setVillages(res.data?.list || [])
    }).catch(() => {})
  }, [])

  const fetchList = useCallback(() => {
    setLoading(true)
    getAccommodationList({ page, pageSize, keyword, villageId, type })
      .then(res => {
        if (res.code === 200) {
          setList(res.data?.list || [])
          setTotal(res.data?.total || 0)
        }
      })
      .finally(() => setLoading(false))
  }, [page, pageSize, keyword, villageId, type])

  useEffect(() => { fetchList() }, [fetchList])

  const openAdd = () => {
    setEditRecord(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditRecord(record)
    form.setFieldsValue({
      ...record,
      villageId: record.villageId,
    })
    setModalOpen(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      setSubmitting(true)
      const action = editRecord
        ? updateAccommodation(editRecord.id, values)
        : createAccommodation(values)
      action
        .then(res => {
          if (res.code === 200) {
            message.success(editRecord ? '更新成功' : '新增成功')
            setModalOpen(false)
            fetchList()
          } else {
            message.error(res.message || '操作失败')
          }
        })
        .catch(() => message.error('操作失败'))
        .finally(() => setSubmitting(false))
    })
  }

  const handleDelete = (id) => {
    deleteAccommodation(id).then(res => {
      if (res.code === 200) {
        message.success('删除成功')
        fetchList()
      } else {
        message.error(res.message || '删除失败')
      }
    }).catch(() => message.error('删除失败'))
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '住宿名称', dataIndex: 'name', width: 160, ellipsis: true },
    {
      title: '所属苗寨', dataIndex: 'villageName', width: 120,
      render: (_, r) => villages.find(v => v.id === r.villageId)?.name || r.villageName || '-'
    },
    {
      title: '类型', dataIndex: 'type', width: 80,
      render: t => {
        const m = TYPE_MAP[t]
        return m ? <Tag color={m.color}>{m.text}</Tag> : <Tag>{t}</Tag>
      }
    },
    {
      title: '价格(¥/晚)', dataIndex: 'price', width: 110,
      render: p => p ? `¥${Number(p).toLocaleString()}` : '-'
    },
    {
      title: '评分', dataIndex: 'rating', width: 120,
      render: r => r ? <><Rate disabled defaultValue={r} style={{ fontSize: 12 }} /> <span style={{ color: '#ff7a00' }}>{r}</span></> : '-'
    },
    { title: '联系电话', dataIndex: 'phone', width: 130 },
    {
      title: '操作', width: 140, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除该住宿？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>住宿管理</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}
            style={{ background: '#1a6b3a', borderColor: '#1a6b3a' }}>
            新增住宿
          </Button>
        </Col>
      </Row>

      {/* 搜索筛选 */}
      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="搜索住宿名称"
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={e => { setKeyword(e.target.value); setPage(1) }}
            style={{ width: 200 }}
            allowClear
          />
        </Col>
        <Col>
          <Select
            placeholder="所属苗寨"
            value={villageId}
            onChange={v => { setVillageId(v); setPage(1) }}
            style={{ width: 150 }}
            allowClear
          >
            {villages.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)}
          </Select>
        </Col>
        <Col>
          <Select
            placeholder="住宿类型"
            value={type}
            onChange={v => { setType(v); setPage(1) }}
            style={{ width: 120 }}
            allowClear
          >
            <Option value="homestay">民宿</Option>
            <Option value="inn">客栈</Option>
            <Option value="hotel">酒店</Option>
          </Select>
        </Col>
        <Col>
          <Button onClick={() => { setKeyword(''); setVillageId(undefined); setType(undefined); setPage(1) }}>
            重置
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={list}
        rowKey="id"
        loading={loading}
        scroll={{ x: 900 }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: false,
          showTotal: t => `共 ${t} 条`,
          onChange: p => setPage(p),
        }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editRecord ? '编辑住宿' : '新增住宿'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        width={620}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="住宿名称" rules={[{ required: true }]}>
                <Input placeholder="请输入住宿名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="villageId" label="所属苗寨" rules={[{ required: true }]}>
                <Select placeholder="请选择苗寨">
                  {villages.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="住宿类型" rules={[{ required: true }]}>
                <Select placeholder="请选择类型">
                  <Option value="homestay">民宿</Option>
                  <Option value="inn">客栈</Option>
                  <Option value="hotel">酒店</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="price" label="基准价格(¥/晚)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入价格" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="联系电话">
                <Input placeholder="联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="rating" label="评分(1-5)">
                <InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="address" label="详细地址">
                <Input placeholder="详细地址" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="住宿简介">
                <TextArea rows={3} placeholder="住宿简介" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="facilities" label="设施(逗号分隔)">
                <Input placeholder="如：WiFi,停车场,空调,热水" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="checkInNotice" label="入住须知">
                <TextArea rows={2} placeholder="入住须知" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="coverImage" label="封面图URL">
                <Input placeholder="封面图片URL" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  )
}
