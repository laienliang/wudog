<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn text="新增商品" />
      <cl-multi-delete-btn text="批量删除" />
      <cl-flex1 />
      <cl-search-key placeholder="搜索商品标题..." />
    </cl-row>
    <cl-row>
      <cl-table ref="Table" />
    </cl-row>
    <cl-row>
      <cl-flex1 />
      <cl-pagination />
    </cl-row>
    <cl-upsert ref="Upsert" />
  </cl-crud>
</template>

<script setup lang="ts">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

const Crud = useCrud({ service: 'clothing.goods' });

const Table = useTable({
  columns: [
    { type: 'selection', width: 50 },
    {
      label: '商品',
      prop: 'title',
      minWidth: 180,
      formatter: (row: any) => {
        const img = row.mainImage
          ? `<img src="${row.mainImage}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;margin-right:8px;vertical-align:middle;" />`
          : '';
        return `${img}<span>${row.title}</span>`;
      },
    },
    { label: '分类', prop: 'categoryId', minWidth: 100, slot: 'category' },
    {
      label: '价格',
      prop: 'price',
      width: 100,
      formatter: (row: any) => `¥${Number(row.price).toFixed(2)}`,
    },
    {
      label: '市场价',
      prop: 'marketPrice',
      width: 100,
      formatter: (row: any) => row.marketPrice ? `¥${Number(row.marketPrice).toFixed(2)}` : '-',
    },
    { label: '库存', prop: 'stock', width: 80, slot: 'stock' },
    { label: '销量', prop: 'sales', width: 80 },
    {
      label: '评分',
      prop: 'rating',
      width: 80,
      formatter: (row: any) => {
        const r = parseFloat(row.rating) || 5;
        return `<span style="color:#E85D2F;font-weight:bold;">${r.toFixed(2)}</span>`;
      },
    },
    {
      label: '状态',
      prop: 'status',
      width: 80,
      formatter: (row: any) => {
        return row.status === 1
          ? '<el-tag type="success" size="small">上架</el-tag>'
          : '<el-tag type="info" size="small">下架</el-tag>';
      },
    },
    { label: '创建时间', prop: 'createTime', width: 170 },
    {
      label: '操作',
      type: 'op',
      width: 120,
      buttons: ['edit', 'delete'],
    },
  ],
});

const Upsert = useUpsert({
  items: [
    { label: '商品标题', prop: 'title', required: true, components: [{ name: 'el-input' }] },
    { label: '副标题', prop: 'subtitle', components: [{ name: 'el-input' }] },
    { label: '分类ID', prop: 'categoryId', components: [{ name: 'el-input-number' }] },
    { label: '商家ID', prop: 'merchantId', components: [{ name: 'el-input-number' }] },
    {
      label: '价格 (¥)',
      prop: 'price',
      required: true,
      components: [{ name: 'el-input-number', props: { precision: 2, min: 0 } }],
    },
    {
      label: '市场价 (¥)',
      prop: 'marketPrice',
      components: [{ name: 'el-input-number', props: { precision: 2, min: 0 } }],
    },
    { label: '库存', prop: 'stock', components: [{ name: 'el-input-number', props: { min: 0 } }] },
    { label: '主图URL', prop: 'mainImage', components: [{ name: 'el-input' }] },
    { label: '图片列表(JSON)', prop: 'images', components: [{ name: 'el-input', props: { type: 'textarea', rows: 3 } }] },
    { label: '工艺介绍', prop: 'craftIntro', components: [{ name: 'el-input', props: { type: 'textarea', rows: 3 } }] },
    { label: '传承人', prop: 'inheritorName', components: [{ name: 'el-input' }] },
    { label: '详情', prop: 'detailContent', components: [{ name: 'el-input', props: { type: 'textarea', rows: 5 } }] },
    {
      label: '状态',
      prop: 'status',
      components: [{ name: 'el-switch', props: { activeValue: 1, inactiveValue: 0, activeText: '上架', inactiveText: '下架' } }],
    },
  ],
});
</script>
