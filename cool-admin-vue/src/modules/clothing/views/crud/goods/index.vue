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
import { ref } from 'vue';

const { service } = useCool();
const categoryNameMap = ref<Record<string, string>>({});

const Crud = useCrud({ service: service.clothing.goods, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

function getCategoryName(row: any) {
  const name = ['categoryName', 'category.name']
    .map(key => key.split('.').reduce((data, field) => data?.[field], row))
    .find(Boolean);

  return name || categoryNameMap.value[row.categoryId] || '-';
}

service.clothing.category.list({}).then((list: any[]) => {
  categoryNameMap.value = list.reduce((map, item) => {
    map[item.id] = item.name;
    return map;
  }, {} as Record<string, string>);
});

const Table = useTable({
  columns: [
    { type: 'selection', width: 50 },
    { label: '主图', prop: 'mainImage', width: 80, component: { name: 'cl-image', props: { size: 40 } } },
    { label: '商品', prop: 'title', minWidth: 180 },
    { label: '分类', prop: 'categoryName', width: 120, formatter: getCategoryName },
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
    { label: '库存', prop: 'stock', width: 80 },
    { label: '销量', prop: 'sales', width: 80 },
    {
      label: '评分',
      prop: 'rating',
      width: 80,
      formatter: (row: any) => {
        const r = parseFloat(row.rating) || 5;
        return r.toFixed(2);
      },
    },
    {
      label: '状态',
      prop: 'status',
      width: 80,
      formatter: (row: any) => {
        return row.status === 1 ? '上架' : '下架';
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
    { label: '商品标题', prop: 'title', required: true, component: { name: 'el-input' } },
    { label: '副标题', prop: 'subtitle', component: { name: 'el-input' } },
    {
      label: '分类',
      prop: 'categoryId',
      component: {
        name: 'cl-select',
        props: {
          api: () => service.clothing.category.list({}),
          labelKey: 'name',
          valueKey: 'id',
        },
      },
    },
    {
      label: '商家',
      prop: 'merchantId',
      component: {
        name: 'cl-select',
        props: {
          api: () => service.merchant.list({}),
          labelKey: 'shopName',
          valueKey: 'id',
        },
      },
    },
    {
      label: '价格 (¥)',
      prop: 'price',
      required: true,
      component: { name: 'el-input-number', props: { precision: 2, min: 0 } },
    },
    {
      label: '市场价 (¥)',
      prop: 'marketPrice',
      component: { name: 'el-input-number', props: { precision: 2, min: 0 } },
    },
    { label: '库存', prop: 'stock', component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '主图', prop: 'mainImage', component: { name: 'cl-upload-space', props: { multiple: false, accept: 'image/*' } } },
    { label: '图片列表', prop: 'images', component: { name: 'cl-upload-space', props: { multiple: true, accept: 'image/*' } } },
    { label: '工艺介绍', prop: 'craftIntro', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
    { label: '传承人', prop: 'inheritorName', component: { name: 'el-input' } },
    { label: '详情', prop: 'detailContent', component: { name: 'el-input', props: { type: 'textarea', rows: 5 } } },
    {
      label: '状态',
      prop: 'status',
      component: { name: 'el-switch', props: { activeValue: 1, inactiveValue: 0, activeText: '上架', inactiveText: '下架' } },
    },
  ],
});
</script>
