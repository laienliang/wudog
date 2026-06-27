Component({
  properties: {
    text: { type: String, value: '暂无数据' },
    showBtn: { type: Boolean, value: false },
  },
  methods: {
    onRetry() { this.triggerEvent('retry'); },
  },
});
