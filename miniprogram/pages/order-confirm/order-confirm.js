const { getAddressList, createOrder, deleteCartItem } = require('../../utils/api');
const app = getApp();

Page({
  data: {
    productId: '',
    skuId: '',
    productName: '',
    specName: '',
    price: 0,
    quantity: 1,
    totalAmount: '0.00',
    cartId: '',
    stock: 0,
    addresses: [],
    selectedAddress: null,
    submitting: false,
  },

  onLoad(options) {
    const price = Number(options.price) || 0;
    const quantity = Number(options.quantity) || 1;
    this.setData({
      productId: options.productId || '',
      skuId: options.skuId || '',
      productName: decodeURIComponent(options.productName || ''),
      specName: decodeURIComponent(options.specName || ''),
      price,
      quantity,
      totalAmount: (price * quantity).toFixed(2),
      cartId: options.cartId || '',
      stock: Number(options.stock) || 0,
    });
    this.loadAddresses();
  },

  onShow() {
    this.loadAddresses();
  },

  async loadAddresses() {
    try {
      const res = await getAddressList();
      const addresses = res.data || [];
      const selected = addresses.find(a => a.is_default) || addresses[0] || null;
      this.setData({ addresses, selectedAddress: selected });
    } catch {}
  },

  selectAddress(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ selectedAddress: this.data.addresses[index] });
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/address?select=1' });
  },

  async onSubmit() {
    if (!this.data.selectedAddress) {
      wx.showToast({ title: '请选择收货地址', icon: 'none' }); return;
    }
    const addr = this.data.selectedAddress;
    this.setData({ submitting: true });
    try {
      await createOrder({
        product_id: Number(this.data.productId),
        sku_id: Number(this.data.skuId),
        product_name: this.data.productName,
        spec_name: this.data.specName,
        price: this.data.price,
        quantity: this.data.quantity,
        receiver_name: addr.name,
        receiver_phone: addr.phone,
        receiver_address: `${addr.province} ${addr.city} ${addr.district} ${addr.town || ''} ${addr.detail}`.trim(),
      });
      // 如果是从购物车下单，删除购物车项
      if (this.data.cartId) {
        try { await deleteCartItem(this.data.cartId); } catch {}
      }
      wx.showToast({ title: '下单成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch {}
    finally { this.setData({ submitting: false }); }
  },
});
