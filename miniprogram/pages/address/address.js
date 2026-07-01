const { getAddressList, createAddress, deleteAddress, setDefaultAddress } = require('../../utils/api');
const REGIONS = require('../../data/regions');

Page({
  data: {
    addresses: [],
    showAdd: false,
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    provinces: [],
    cities: [],
    districts: [],
    provinceIndex: -1,
    cityIndex: -1,
    districtIndex: -1,
    selectMode: false,
  },

  onLoad(options) {
    this.setData({
      selectMode: options.select === '1',
      provinces: Object.keys(REGIONS),
    });
    this.loadAddresses();
  },

  onShow() {
    this.loadAddresses();
  },

  async loadAddresses() {
    try {
      const res = await getAddressList();
      this.setData({ addresses: res.data || [] });
    } catch {}
  },

  toggleAdd() {
    this.setData({
      showAdd: !this.data.showAdd,
      name: '', phone: '', province: '', city: '', district: '', detail: '',
      provinceIndex: -1, cityIndex: -1, districtIndex: -1,
      cities: [], districts: [],
    });
  },

  onNameInput(e) { this.setData({ name: e.detail.value }); },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }); },
  onDetailInput(e) { this.setData({ detail: e.detail.value }); },

  onProvinceChange(e) {
    const idx = e.detail.value;
    const province = this.data.provinces[idx];
    this.setData({
      provinceIndex: idx,
      province,
      city: '',
      district: '',
      cityIndex: -1,
      districtIndex: -1,
      cities: Object.keys(REGIONS[province] || {}),
      districts: [],
    });
  },

  onCityChange(e) {
    const idx = e.detail.value;
    const city = this.data.cities[idx];
    this.setData({
      cityIndex: idx,
      city,
      district: '',
      districtIndex: -1,
      districts: REGIONS[this.data.province]?.[city] || [],
    });
  },

  onDistrictChange(e) {
    const idx = e.detail.value;
    this.setData({
      districtIndex: idx,
      district: this.data.districts[idx],
    });
  },

  async onAdd() {
    const { name, phone, province, city, district, detail } = this.data;
    if (!name.trim()) { wx.showToast({ title: '请输入收货人', icon: 'none' }); return; }
    if (!/^\d{11}$/.test(phone)) { wx.showToast({ title: '手机号格式错误', icon: 'none' }); return; }
    if (!province || !city || !detail.trim()) { wx.showToast({ title: '请填写完整地址', icon: 'none' }); return; }
    try {
      await createAddress({ name, phone, province, city, district, detail: detail.trim() });
      wx.showToast({ title: '添加成功', icon: 'success' });
      this.setData({ showAdd: false });
      this.loadAddresses();
    } catch {}
  },

  async onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该地址吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteAddress(id);
            wx.showToast({ title: '已删除', icon: 'success' });
            this.loadAddresses();
          } catch {}
        }
      },
    });
  },

  async onSetDefault(e) {
    const id = e.currentTarget.dataset.id;
    try {
      await setDefaultAddress(id);
      wx.showToast({ title: '已设为默认', icon: 'success' });
      this.loadAddresses();
    } catch {}
  },

  onSelectAddress(e) {
    if (!this.data.selectMode) return;
    const index = e.currentTarget.dataset.index;
    const address = this.data.addresses[index];
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage) {
      prevPage.setData({ selectedAddress: address });
    }
    wx.navigateBack();
  },
});
