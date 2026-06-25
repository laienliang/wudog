export default function Pagination({ page, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize) || 1

  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || i === totalPages ||
      (i >= page - 2 && i <= page + 2)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>‹ 上一页</button>
      {pages.map((p, i) =>
        p === '...'
          ? <span key={i} style={{ padding: '0 4px', color: '#aaa' }}>...</span>
          : <button key={p} className={page === p ? 'active' : ''} onClick={() => onChange(p)}>{p}</button>
      )}
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>下一页 ›</button>
      <span style={{ color: '#888', marginLeft: 8 }}>共 {total} 条</span>
    </div>
  )
}
