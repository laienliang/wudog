import { useEffect, useState } from 'react'
import { api } from '../api'

export default function ScenicManagePage() {
  const [list, setList] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', coverImage: '', address: '', description: '', lat: '', lng: '', sort: 0 })

  const load = () => {
    api.getScenicSpots(1, 100).then((res) => setList(res.list))
  }
  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', coverImage: '', address: '', description: '', lat: '', lng: '', sort: 0 })
    setShowModal(true)
  }

  const openEdit = (item: any) => {
    setEditing(item)
    setForm({
      name: item.name,
      coverImage: item.coverImage || '',
      address: item.address || '',
      description: item.description || '',
      lat: item.lat ?? '',
      lng: item.lng ?? '',
      sort: item.sort ?? 0,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editing) {
        await api.updateScenicSpot(editing.id, form)
      } else {
        await api.createScenicSpot(form)
      }
      setShowModal(false)
      load()
    } catch (e: any) { alert(e.message) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return
    await api.deleteScenicSpot(id)
    load()
  }

  const handleToggleStatus = async (id: number) => {
    await api.toggleScenicSpotStatus(id)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <h2>景区管理</h2>
      </div>
      <div className="table-wrapper">
        <div className="table-toolbar">
          <span>共 {list.length} 条</span>
          <button className="btn btn-primary" onClick={openCreate}>+ 新增景区</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>地址</th>
              <th>状态</th>
              <th>排序</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.address}</td>
                <td>
                  <span className={`badge ${item.status === 1 ? 'badge-success' : 'badge-error'}`}>
                    {item.status === 1 ? '上架' : '下架'}
                  </span>
                </td>
                <td>{item.sort}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => openEdit(item)}>编辑</button>
                  <button className="btn btn-outline btn-sm" onClick={() => handleToggleStatus(item.id)}>
                    {item.status === 1 ? '下架' : '上架'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 新增/编辑弹窗 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? '编辑景区' : '新增景区'}</h3>
            <div className="form-group">
              <label>名称</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>封面图 URL</label>
              <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
            </div>
            <div className="form-group">
              <label>地址</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="form-group">
              <label>简介</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>经度 (lng)</label>
              <input type="number" step="any" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} placeholder="如: 108.32" />
            </div>
            <div className="form-group">
              <label>纬度 (lat)</label>
              <input type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} placeholder="如: 22.82" />
            </div>
            <div className="form-group">
              <label>排序</label>
              <input type="number" value={form.sort} onChange={(e) => setForm({ ...form, sort: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSave}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
