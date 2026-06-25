import React, { useState, useEffect, useCallback } from 'react'
import {
  Card, Row, Col, Select, DatePicker, Table, Button, Space, Modal,
  Form, InputNumber, Switch, message, Popconfirm, Typography, Tag,
  Alert, Divider, Tooltip
} from 'antd'
import {
  CalendarOutlined, PlusOutlined, EditOutlined,
  DeleteOutlined, ThunderboltOutlined, ReloadOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  getAccommodationList, getRoomList,
  getCalendarList, createCalendar, updateCalendar,
  deleteCalendar, batchCalendar
} from '../../api/index'

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

export default function CalendarPage() {
  const [accommodations, setAccommodations] = useState([])
  const [rooms, setRooms] = useState([])
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(14)

  // 筛选条件
  const [accommodationId, setAccommodationId] = useState(undefined)
  const [roomId, setRoomId] = useState(undefined)
  const [dateRange, setDateRange] = useState(null)

  // 单条编辑弹窗
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  // 批量设置弹窗
  const [batchModalOpen, setBatchModalOpen] = useState(false)
  const [batchSubmitting, setBatchSubmitting] = useState(false)
  const [batchForm] = Form.useForm()

  // 加载住宿
  useEffect(() => {
    getAccommodationList({ page: 1, pageSize: 100 }).then(res => {
      if (res.code === 200) setAccommodations(res.data?.list || [])
    }).catch(() => {})
  }, [])

  // 住宿变化时加载对应房型
  useEffect(() => {
    if (!accommodationId) {
      setRooms([])
      setRoomId(undefined)
      return
    }
    getRoomList({ accommodationId, page: 1, pageSize: 100 }).then(res => {
      if (res.code === 200) setRooms(res.data?.list || [])
    }).catch(() => {})
  }, [accommodationId])

  const fetchList = useCallback(() => {
    if (!roomId) { setList([]); setTotal(0); return }
    setLoading(true)
    const params = {
      page, pageSize, roomId,
      dateFrom: dateRange?.[0]?.format('YYYY-MM-DD'),
      dateTo: dateRange?.[1]?.format('YYYY-MM-DD'),
    }
    getCalendarList(params)
      .then(res => {
        if (res.code === 200) {
          setList(res.data?.list || [])
          setTotal(res.data?.total || 0)
        }
      })
      .finally(() => setLoading(false))
  }, [page, pageSize, roomId, dateRange])

  useEffect(() => { fetchList() }, [fetchList])

  const openEdit = (record) => {
    setEditRecord(record)
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    })
    setEditModalOpen(true)
  }

  const openAdd = () => {
    setEditRecord(null)
    form.resetFields()
    form.setFieldsValue({ stock: 1, isClosed: false })
    setEditModalOpen(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      setSubmitting(true)
      const payload = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        roomId: roomId,
        accommodationId,
      }
      const action = editRecord ? updateCalendar(editRecord.id, payload) : createCalendar(payload)
      action.then(res => {
        if (res.code === 200) {
          message.success(editRecord ? '更新成功' : '新增成功')
          setEditModalOpen(false)
          fetchList()
        } else {
          message.error(res.message || '操作失败')
        }
      }).catch(() => message.error('操作失败')).finally(() => setSubmitting(false))
    })
  }

  const handleDelete = (id) => {
    deleteCalendar(id).then(res => {
      if (res.code === 200) { message.success('删除成功'); fetchList() }
      else message.error(res.message || '删除失败')
    }).catch(() => message.error('删除失败'))
  }

  // 批量生成日期区间
  const handleBatchSubmit = () => {
    batchForm.validateFields().then(values => {
      setBatchSubmitting(true)
      const { batchDateRange, price, stock, isClosed, remark } = values
      const startDate = batchDateRange[0]
      const endDate = batchDateRange[1]
      const items = []
      let cur = startDate.clone()
      while (cur.isBefore(endDate) || cur.isSame(endDate, 'day')) {
        items.push({
          roomId,
          accommodationId,
          date: cur.format('YYYY-MM-DD'),
          price,
          stock,
          isClosed: isClosed || false,
          remark: remark || '',
        })
        cur = cur.add(1, 'day')
      }
      batchCalendar(items).then(res => {
        if (res.code === 200) {
          message.success(`批量更新 ${items.length} 天房态成功`)
          setBatchModalOpen(false)
          batchForm.resetFields()
          fetchList()
        } else {
          message.error(res.message || '批量更新失败')
        }
      }).catch(() => message.error('批量更新失败')).finally(() => setBatchSubmitting(false))
    })
  }

  const columns = [
    {
      title: '日期', dataIndex: 'date', width: 110,
      render: d => {
        const date = dayjs(d)
        const isWeekend = date.day() === 0 || date.day() === 6
        return (
          <Space>
            <span>{d?.split('T')[0] || d}</span>
            {isWeekend && <Tag color="orange" style={{ fontSize: 10, padding: '0 4px' }}>周末</Tag>}
          </Space>
        )
      }
    },
    {
      title: '价格(¥)', dataIndex: 'price', width: 100,
      render: p => (
        <Text strong style={{ color: '#ff7a00' }}>
          ¥{Number(p).toLocaleString()}
        </Text>
      )
    },
    {
      title: '库存', dataIndex: 'stock', width: 80,
      render: s => (
        <Tag color={s === 0 ? 'red' : s <= 2 ? 'orange' : 'green'}>
          {s === 0 ? '已满' : `${s}间`}
        </Tag>
      )
    },
    {
      title: '状态', dataIndex: 'isClosed', width: 80,
      render: c => c ? <Tag color="red">关闭</Tag> : <Tag color="green">开放</Tag>
    },
    { title: '备注', dataIndex: 'remark', ellipsis: true },
    {
      title: '操作', width: 120, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除该日期房态？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const selectedRoom = rooms.find(r => r.id === roomId)

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle" justify="space-between" gutter={16} wrap>
          <Col flex="0 0 auto">
            <Title level={4} style={{ margin: 0 }}>
              <CalendarOutlined style={{ marginRight: 8, color: '#1a6b3a' }} />
              房态日历管理
            </Title>
          </Col>

          <Col flex="1 1 auto">
            <Row gutter={12} align="middle">
              <Col>
                <Select
                  placeholder="选择住宿"
                  value={accommodationId}
                  onChange={v => { setAccommodationId(v); setRoomId(undefined); setPage(1) }}
                  style={{ width: 200 }}
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {accommodations.map(a => <Option key={a.id} value={a.id}>{a.name}</Option>)}
                </Select>
              </Col>
              <Col>
                <Select
                  placeholder="选择房型"
                  value={roomId}
                  onChange={v => { setRoomId(v); setPage(1) }}
                  style={{ width: 180 }}
                  allowClear
                  disabled={!accommodationId}
                >
                  {rooms.map(r => <Option key={r.id} value={r.id}>{r.name}</Option>)}
                </Select>
              </Col>
              <Col>
                <RangePicker
                  value={dateRange}
                  onChange={v => { setDateRange(v); setPage(1) }}
                  style={{ width: 240 }}
                  placeholder={['开始日期', '结束日期']}
                />
              </Col>
              <Col>
                <Button icon={<ReloadOutlined />} onClick={() => { setDateRange(null); fetchList() }}>
                  刷新
                </Button>
              </Col>
            </Row>
          </Col>

          <Col flex="0 0 auto">
            <Space>
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                disabled={!roomId}
                onClick={() => {
                  batchForm.resetFields()
                  setBatchModalOpen(true)
                }}
                style={{ background: '#fa8c16', borderColor: '#fa8c16' }}
              >
                批量设置
              </Button>
              <Button type="primary" icon={<PlusOutlined />}
                disabled={!roomId} onClick={openAdd}
                style={{ background: '#1a6b3a', borderColor: '#1a6b3a' }}>
                单日新增
              </Button>
            </Space>
          </Col>
        </Row>

        {!roomId && (
          <Alert
            style={{ marginTop: 16 }}
            message="请先选择住宿和房型，查看该房型的价格日历"
            type="info"
            showIcon
          />
        )}

        {selectedRoom && (
          <div style={{ marginTop: 12, padding: '8px 16px', background: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
            <Space>
              <Text>当前房型：<Text strong>{selectedRoom.name}</Text></Text>
              <Divider type="vertical" />
              <Text>基准价：<Text strong style={{ color: '#ff7a00' }}>¥{selectedRoom.price}/晚</Text></Text>
              <Divider type="vertical" />
              <Text>容纳：{selectedRoom.capacity}人</Text>
            </Space>
          </div>
        )}
      </Card>

      {roomId && (
        <Card>
          <Table
            columns={columns}
            dataSource={list}
            rowKey="id"
            loading={loading}
            rowClassName={(record) => {
              if (record.isClosed) return 'row-closed'
              if (record.stock === 0) return 'row-full'
              return ''
            }}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: false,
              showTotal: t => `共 ${t} 条记录`,
              onChange: p => setPage(p),
            }}
          />
        </Card>
      )}

      {/* 单日新增/编辑弹窗 */}
      <Modal
        title={editRecord ? '编辑房态' : '新增单日房态'}
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="price" label="价格(¥)" rules={[{ required: true, message: '请输入价格' }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="当日价格" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="stock" label="库存(间数)" rules={[{ required: true }]}>
                <InputNumber min={0} max={99} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isClosed" label="关闭此日" valuePropName="checked">
                <Switch checkedChildren="关闭" unCheckedChildren="开放" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="remark" label="备注">
                <input
                  style={{ width: '100%', padding: '4px 11px', border: '1px solid #d9d9d9', borderRadius: 6 }}
                  placeholder="可填写如：节假日、满房预留等备注"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 批量设置弹窗 */}
      <Modal
        title={<><ThunderboltOutlined style={{ color: '#fa8c16' }} /> 批量设置房态（日期区间）</>}
        open={batchModalOpen}
        onCancel={() => setBatchModalOpen(false)}
        onOk={handleBatchSubmit}
        confirmLoading={batchSubmitting}
        destroyOnClose
        width={480}
      >
        <Alert
          message="批量设置会覆盖所选日期区间内的价格和库存（upsert 模式）"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Form form={batchForm} layout="vertical">
          <Form.Item name="batchDateRange" label="日期区间" rules={[{ required: true, message: '请选择日期区间' }]}>
            <RangePicker style={{ width: '100%' }} disabledDate={d => d < dayjs().startOf('day')} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="统一价格(¥)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="每晚价格" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="stock" label="统一库存(间)" rules={[{ required: true }]}>
                <InputNumber min={0} max={99} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isClosed" label="关闭此区间" valuePropName="checked">
                <Switch checkedChildren="全部关闭" unCheckedChildren="全部开放" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="remark" label="备注">
                <input
                  style={{ width: '100%', padding: '4px 11px', border: '1px solid #d9d9d9', borderRadius: 6 }}
                  placeholder="批量备注（可选）"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <style>{`
        .row-closed td { background: #fff1f0 !important; }
        .row-full td { background: #fffbe6 !important; }
      `}</style>
    </div>
  )
}
