export default function Empty({ text = '暂无数据' }) {
  return (
    <div className="empty-box">
      <div className="empty-icon">🏜️</div>
      <div>{text}</div>
    </div>
  )
}
