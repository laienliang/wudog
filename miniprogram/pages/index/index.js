// pages/index/index.js
const { get, fixImageUrl } = require('../../utils/request')

Page({
  data: {
    list: [],          // 住宿列表
    loading: true,     // 加载状态
    page: 1,           // 当前页码
    pageSize: 10,      // 每页数量
    hasMore: true,      // 是否有更多
    keyword: '',        // 搜索关键词
    villageId: '',      // 筛选：苗寨ID
    villageName: '',    // 筛选：苗寨名称（显示用）
    villages: [],       // 苗寨列表
    villageNames: ['全部'] // 苗寨名称列表（用于 picker）
  },

  onLoad() {
    this.fetchVillages()
    this.fetchList()
  },

  // tabBar 页面每次切换到前台都会触发
  onShow() {
    // 确保页面数据正常渲染
    if (!this.data.loading && this.data.list.length === 0 && !this.data.keyword) {
      this.fetchList()
    }
  },

  onReachBottom() {
    if (this.data.hasMore) {
      this.loadMore()
    }
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true, list: [] })
    this.fetchList().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 获取苗寨列表（用于筛选）
  fetchVillages() {
    get('/api/miao-village/list', { pageSize: 100 })
      .then(res => {
        if (res.code === 200) {
          const villages = (res.data && res.data.list) || []
          const villageNames = ['全部', ...villages.map(v => v.name)]
          this.setData({ villages, villageNames })
        }
      })
  },

  // 获取住宿列表
  fetchList() {
    const { page, pageSize, keyword, villageId } = this.data

    this.setData({ loading: true })

    return get('/api/accommodation/list', {
      page: 1,
      pageSize,
      keyword,
      villageId
    }).then(res => {
      if (res.code === 200) {
        const data = res.data || {}
        const newList = data.list || []
        fixImageUrl(newList)
        this.setData({
          list: newList,
          page: 1,
          hasMore: newList.length >= pageSize,
          loading: false
        })
      } else {
        this.setData({ loading: false })
      }
    }).catch(() => {
      this.setData({ loading: false })
    })
  },

  // 加载更多
  loadMore() {
    const { page, pageSize, keyword, villageId, list } = this.data
    const nextPage = page + 1

    get('/api/accommodation/list', {
      page: nextPage,
      pageSize,
      keyword,
      villageId
    }).then(res => {
      if (res.code === 200) {
        const data = res.data || {}
        const newList = data.list || []
        fixImageUrl(newList)
        this.setData({
          list: [...list, ...newList],
          page: nextPage,
          hasMore: newList.length >= pageSize
        })
      }
    })
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  // 执行搜索
  onSearch() {
    this.setData({ page: 1, hasMore: true, list: [] })
    this.fetchList()
  },

  // 筛选苗寨
  onVillageChange(e) {
    const index = parseInt(e.detail.value, 10)
    if (index === 0) {
      this.setData({ villageId: '', villageName: '', page: 1, hasMore: true, list: [] })
    } else {
      const village = this.data.villages[index - 1]
      this.setData({ villageId: village.id, villageName: village.name, page: 1, hasMore: true, list: [] })
    }
    this.fetchList()
  },

  // 跳转到详情页
  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  }
})
