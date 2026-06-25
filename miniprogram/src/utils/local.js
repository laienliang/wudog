const USER_KEY = 'wudog_user_v1'
const ORDER_KEY = 'wudog_orders_v1'
const ADDRESS_KEY = 'wudog_addresses_v1'
const ALBUM_KEY = 'wudog_album_v1'
const COMMUNITY_KEY = 'wudog_community_posts_v1'
const ARTICLE_LIKE_KEY = 'wudog_article_likes_v1'
const ARTICLE_COMMENT_KEY = 'wudog_article_comments_v1'
const COLLECT_KEY = 'wudog_collect_v1'

function read(key, fallback) {
  const value = uni.getStorageSync(key)
  return value === '' || value === undefined || value === null ? fallback : value
}

function write(key, value) {
  uni.setStorageSync(key, value)
}

function readList(key) {
  const value = read(key, [])
  return Array.isArray(value) ? value : []
}

function writeList(key, list) {
  write(key, Array.isArray(list) ? list : [])
}

function nowText() {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function getCurrentUser() {
  const stored = read(USER_KEY, null)
  if (stored) {
    return stored
  }
  const guest = {
    id: 10001,
    nickName: '乌东游客',
    avatarUrl: '',
    description: '先逛逛乌东文旅',
  }
  write(USER_KEY, guest)
  return guest
}

export function setCurrentUser(user) {
  const next = {
    id: user?.id || getCurrentUser().id,
    nickName: user?.nickName || '乌东游客',
    avatarUrl: user?.avatarUrl || '',
    description: user?.description || '',
  }
  write(USER_KEY, next)
  return next
}

export function clearCurrentUser() {
  uni.removeStorageSync(USER_KEY)
}

export function getUserId() {
  return Number(getCurrentUser().id || 10001)
}

export function getOrders() {
  return readList(ORDER_KEY)
}

export function saveOrders(list) {
  writeList(ORDER_KEY, list)
}

export function appendOrder(order) {
  const list = getOrders()
  const record = {
    id: order.id || Date.now(),
    orderNo: order.orderNo || `WD${Date.now()}`,
    title: order.title || '未命名订单',
    moduleType: Number(order.moduleType || 1),
    moduleName: order.moduleName || '文旅订单',
    status: Number(order.status ?? 0),
    statusText: order.statusText || '待支付',
    amount: Number(order.amount || 0),
    items: Array.isArray(order.items) ? order.items : [],
    contactName: order.contactName || '',
    contactPhone: order.contactPhone || '',
    address: order.address || '',
    appointmentDate: order.appointmentDate || '',
    appointmentTime: order.appointmentTime || '',
    note: order.note || '',
    createdAt: order.createdAt || nowText(),
  }
  const idx = list.findIndex(item => String(item.id) === String(record.id))
  if (idx >= 0) {
    list.splice(idx, 1, { ...list[idx], ...record })
  } else {
    list.unshift(record)
  }
  saveOrders(list)
  return record
}

export function updateOrder(orderId, patch) {
  const list = getOrders()
  const idx = list.findIndex(item => String(item.id) === String(orderId))
  if (idx < 0) {
    return null
  }
  const current = list[idx]
  const next = {
    ...current,
    ...patch,
  }
  list.splice(idx, 1, next)
  saveOrders(list)
  return next
}

export function getOrderById(orderId) {
  return getOrders().find(item => String(item.id) === String(orderId)) || null
}

export function removeOrder(orderId) {
  saveOrders(getOrders().filter(item => String(item.id) !== String(orderId)))
}

export function getAddresses() {
  return readList(ADDRESS_KEY)
}

export function saveAddresses(list) {
  writeList(ADDRESS_KEY, list)
}

export function getAlbumPhotos() {
  return readList(ALBUM_KEY)
}

export function saveAlbumPhotos(list) {
  writeList(ALBUM_KEY, list)
}

export function getCommunityPosts() {
  return readList(COMMUNITY_KEY)
}

export function appendCommunityPost(post) {
  const list = getCommunityPosts()
  list.unshift({
    id: post.id || Date.now(),
    title: post.title || '未命名游记',
    description: post.description || '',
    images: post.images || [],
    nickName: post.nickName || getCurrentUser().nickName,
    likes: Number(post.likes || 0),
    comments: Number(post.comments || 0),
    typeName: post.typeName || '社区游记',
    miniPath: post.miniPath || `/pages_community/article/detail?id=${post.id || Date.now()}`,
    createTime: post.createTime || nowText(),
    localOnly: true,
  })
  writeList(COMMUNITY_KEY, list)
  return list[0]
}

export function getArticleLikes() {
  return read(ARTICLE_LIKE_KEY, {})
}

export function setArticleLikes(map) {
  write(ARTICLE_LIKE_KEY, map || {})
}

export function getArticleComments() {
  return read(ARTICLE_COMMENT_KEY, {})
}

export function setArticleComments(map) {
  write(ARTICLE_COMMENT_KEY, map || {})
}

export function appendArticleComment(articleId, comment) {
  const map = getArticleComments()
  const key = String(articleId)
  const list = Array.isArray(map[key]) ? map[key] : []
  list.unshift({
    id: comment.id || Date.now(),
    articleId,
    userId: comment.userId || getUserId(),
    nickName: comment.nickName || getCurrentUser().nickName,
    content: comment.content || '',
    createTime: comment.createTime || nowText(),
  })
  map[key] = list
  setArticleComments(map)
  return list[0]
}

export function getCollectList() {
  return readList(COLLECT_KEY)
}

export function upsertCollectItem(item) {
  const list = getCollectList()
  const idx = list.findIndex(record => String(record.id) === String(item.id))
  if (idx >= 0) {
    list.splice(idx, 1, { ...list[idx], ...item })
  } else {
    list.unshift(item)
  }
  writeList(COLLECT_KEY, list)
  return list
}

export function removeCollectItem(id) {
  writeList(COLLECT_KEY, getCollectList().filter(item => String(item.id) !== String(id)))
}

