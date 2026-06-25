import React, { useState, useEffect, useCallback } from 'react'
import {
  Table, Button, Space, Input, Modal, Form, InputNumber,
  message, Popconfirm, Card, Row, Col, Typography
} from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getVillageList, createVillage, updateVillage, deleteVillage } from '../../api/index'

const { Title } = Typography
const { TextArea } = Input

export default function VillagePage() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  const fetchList = useCallback(() => {
    setLoading(true)
    getVillageList({ page, pageSize, keyword })
      .then(res => {
        if (res.code === 200) {
          setList(res.data?.list || [])
          setTotal(res.data?.total || 0)
        }
      })
      .finally(() => setLoading(false))
  }, [page, pageSize, keyword])

  useEffect(() => { fetchList() }, [fetchList])

  const openAdd = () => { setEditRecord(null); form.resetFields(); setModalOpen(true) }
  const openEdit = (r) => { setEditRecord(r); form.setFieldsValue(r); setModalOpen(true) }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      setSubmitting(true)
      const action = editRecord ? updateVillage(editRecord.id, values) : createVillage(values)
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
    deleteVillage(id).then(res => {
      if (res.code === 200) { message.success('删除成功'); fetchList() }
      else message.error(res.message || '删除失败')
    }).catch(() => message.error('删除失败'))
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '苗寨名称', dataIndex: 'name', width: 160 },
    { title: '所在地区', dataIndex: 'location', width: 160 },
    { title: '特色标签', dataIndex: 'tags', width: 200, ellipsis: true },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '操作', width: 140, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除该苗寨？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><Title level={4} style={{ margin: 0 }}>苗寨管理</Title></Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}
            style={{ background: '#1a6b3a', borderColor: '#1a6b3a' }}>新增苗寨</Button>
        </Col>
      </Row>

      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col>
          <Input placeholder="搜索苗寨名称" prefix={<SearchOutlined />}
            value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1) }}
            style={{ width: 200 }} allowClear />
        </Col>
        <Col>
          <Button onClick={() => { setKeyword(''); setPage(1) }}>重置</Button>
        </Col>
      </Row>

      <Table columns={columns} dataSource={list} rowKey="id" loading={loading}
        pagination={{
          current: page, pageSize, total, showSizeChanger: false,
          showTotal: t => `共 ${t} 条`, onChange: p => setPage(p),
        }} />

      <Modal title={editRecord ? '编辑苗寨' : '新增苗寨'} open={modalOpen}
        onCancel={() => setModalOpen(false)} onOk={handleSubmit}
        confirmLoading={submitting} width={560} destroyOnClose>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="苗寨名称" rules={[{ required: true }]}>
                <Input placeholder="请输入苗寨名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="所在地区">
                <Input placeholder="如：贵州省黔东南州" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="tags" label="特色标签(逗号分隔)">
                <Input placeholder="如：苗族文化,梯田,传统建筑" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="简介">
                <TextArea rows={3} placeholder="苗寨简介" />
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
