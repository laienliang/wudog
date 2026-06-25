import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getRoomDetail, createRoom, updateRoom } from '../../api/room'
import Loading from '../../components/Loading'

const EMPTY_FORM = {
  accommodationId: '',
  name: '',
  price: '',
  maxGuests: 2,
  bedType: '',
  roomCount: '',
  area: '',
  description: '',
}

export default function RoomForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    ...EMPTY_FORM,
    accommodationId: searchParams.get('accommodationId') || '',
  })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit) {
      setLoading(true)
      getRoomDetail(id)
        .then(data => setForm({
          accommodationId: data.accommodationId || '',
          name: data.name || '',
          price: data.price || '',
          maxGuests: data.maxGuests || 2,
          bedType: data.bedType || '',
          roomCount: data.roomCount || '',
          area: data.area || '',
          description: data.description || '',
        }))
        .catch(e => alert('加载失败：' + e.message))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = '请输入房型名称'
    if (!form.price) e.price = '请输入价格'
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = '价格必须为正数'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    const payload = {
      ...form,
      accommodationId: Number(form.accommodationId),
      price: Number(form.price),
      maxGuests: Number(form.maxGuests),
      roomCount: form.roomCount ? Number(form.roomCount) : undefined,
      area: form.area ? Number(form.area) : undefined,
    }

    try {
      if (isEdit) {
        await updateRoom(id, payload)
        alert('更新成功！')
        navigate(-1)
      } else {
        await createRoom(payload)
        alert('创建成功！')
        navigate(-1)
      }
    } catch (err) {
      alert((isEdit ? '更新' : '创建') + '失败：' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="container"><Loading /></div>

  return (
    <div className="container">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>← 返回</button>
        <h1 className="page-title">{isEdit ? '✏️ 编辑房型' : '+ 新增房型'}</h1>
        <div />
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>房型名称 <span className="required-star">*</span></label>
          <input type="text" placeholder="如：大床房、标准双人间" value={form.name} onChange={e => set('name', e.target.value)} />
          {errors.name && <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
        </div>

        <div className="form-row">
          <label>价格（元/晚）<span className="required-star">*</span></label>
          <input type="number" placeholder="请输入价格" value={form.price} onChange={e => set('price', e.target.value)} />
          {errors.price && <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.price}</div>}
        </div>

        <div className="form-row">
          <label>最多入住人数</label>
          <input type="number" min={1} max={20} value={form.maxGuests} onChange={e => set('maxGuests', e.target.value)} />
        </div>

        <div className="form-row">
          <label>床型</label>
          <input type="text" placeholder="如：大床/双床/上下铺" value={form.bedType} onChange={e => set('bedType', e.target.value)} />
        </div>

        <div className="form-row">
          <label>剩余房间数</label>
          <input type="number" min={0} placeholder="选填" value={form.roomCount} onChange={e => set('roomCount', e.target.value)} />
        </div>

        <div className="form-row">
          <label>房间面积（㎡）</label>
          <input type="number" min={0} placeholder="选填" value={form.area} onChange={e => set('area', e.target.value)} />
        </div>

        <div className="form-row">
          <label>房型描述</label>
          <textarea placeholder="选填" value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '提交中...' : (isEdit ? '保存修改' : '立即创建')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>取消</button>
        </div>
      </form>
    </div>
  )
}
