import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getAccommodationDetail,
  createAccommodation,
  updateAccommodation,
} from '../../api/accommodation'
import { getMiaoVillageList } from '../../api/miaoVillage'
import Loading from '../../components/Loading'

const TYPES = [
  { value: 'minsute', label: '民宿' },
  { value: 'inn', label: '客栈' },
  { value: 'hotel', label: '酒店' },
  { value: 'farm', label: '农家乐' },
]

const EMPTY_FORM = {
  villageId: '',
  name: '',
  type: 'minsute',
  description: '',
  address: '',
  lowestPrice: '',
  highestPrice: '',
  facilities: '',
  houseRules: '',
  status: 1,
}

export default function AccommodationForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(EMPTY_FORM)
  const [villages, setVillages] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    getMiaoVillageList({ page: 1, pageSize: 50 })
      .then(d => setVillages(d.list || []))
      .catch(() => {})

    if (isEdit) {
      setLoading(true)
      getAccommodationDetail(id)
        .then(data => {
          setForm({
            villageId: data.villageId || '',
            name: data.name || '',
            type: data.type || 'minsute',
            description: data.description || '',
            address: data.address || '',
            lowestPrice: data.lowestPrice || '',
            highestPrice: data.highestPrice || '',
            facilities: data.facilities || '',
            houseRules: data.houseRules || '',
            status: data.status ?? 1,
          })
        })
        .catch(err => alert('加载失败：' + err.message))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.villageId) e.villageId = '请选择所属苗寨'
    if (!form.name.trim()) e.name = '请输入民宿名称'
    if (!form.lowestPrice) e.lowestPrice = '请输入最低价格'
    else if (isNaN(Number(form.lowestPrice)) || Number(form.lowestPrice) <= 0) e.lowestPrice = '价格必须为正数'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    const payload = {
      ...form,
      villageId: Number(form.villageId),
      lowestPrice: Number(form.lowestPrice),
      highestPrice: form.highestPrice ? Number(form.highestPrice) : undefined,
    }

    try {
      if (isEdit) {
        await updateAccommodation(id, payload)
        alert('更新成功！')
        navigate(`/accommodation/detail/${id}`)
      } else {
        await createAccommodation(payload)
        alert('创建成功！')
        navigate('/accommodation')
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
        <h1 className="page-title">{isEdit ? '✏️ 编辑民宿' : '+ 新增民宿'}</h1>
        <div />
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {/* 所属苗寨 */}
        <div className="form-row">
          <label>所属苗寨 <span className="required-star">*</span></label>
          <select value={form.villageId} onChange={e => set('villageId', e.target.value)}>
            <option value="">请选择苗寨</option>
            {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          {errors.villageId && <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.villageId}</div>}
        </div>

        {/* 名称 */}
        <div className="form-row">
          <label>民宿名称 <span className="required-star">*</span></label>
          <input
            type="text"
            placeholder="请输入民宿名称"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
          {errors.name && <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
        </div>

        {/* 类型 */}
        <div className="form-row">
          <label>类型</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* 价格 */}
        <div className="form-row">
          <label>价格（元/晚）<span className="required-star">*</span></label>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <input
                type="number"
                placeholder="最低价（必填）"
                value={form.lowestPrice}
                onChange={e => set('lowestPrice', e.target.value)}
                style={{ width: '100%' }}
              />
              {errors.lowestPrice && <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.lowestPrice}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="number"
                placeholder="最高价（选填）"
                value={form.highestPrice}
                onChange={e => set('highestPrice', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* 地址 */}
        <div className="form-row">
          <label>地址</label>
          <input
            type="text"
            placeholder="详细地址（选填）"
            value={form.address}
            onChange={e => set('address', e.target.value)}
          />
        </div>

        {/* 简介 */}
        <div className="form-row">
          <label>简介</label>
          <textarea
            placeholder="民宿描述（选填）"
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        {/* 设施 */}
        <div className="form-row">
          <label>设施</label>
          <input
            type="text"
            placeholder="如：WiFi/空调/停车场（选填）"
            value={form.facilities}
            onChange={e => set('facilities', e.target.value)}
          />
        </div>

        {/* 房屋规则 */}
        <div className="form-row">
          <label>房屋规则</label>
          <textarea
            placeholder="入住须知、规则等（选填）"
            value={form.houseRules}
            onChange={e => set('houseRules', e.target.value)}
          />
        </div>

        {/* 状态 */}
        <div className="form-row">
          <label>营业状态</label>
          <select value={form.status} onChange={e => set('status', Number(e.target.value))}>
            <option value={1}>营业中</option>
            <option value={0}>暂停营业</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '提交中...' : (isEdit ? '保存修改' : '立即创建')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
