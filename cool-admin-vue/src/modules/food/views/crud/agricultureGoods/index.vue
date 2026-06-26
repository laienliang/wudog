<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-flex1 />
      <cl-search-key placeholder="搜索农产品名称" />
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

const Crud = useCrud({ service: service.food.agricultureGoods, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

function getName(row: any, keys: string[]) {
  for (const key of keys) {
    const value = key.split('.').reduce((data, name) => data?.[name], row);

    if (value) {
      return value;
    }
  }

  return '-';
}

function getCategoryName(row: any) {
  const name = ['categoryName', 'category.name']
    .map(key => key.split('.').reduce((data, field) => data?.[field], row))
    .find(Boolean);

  return name || categoryNameMap.value[row.categoryId] || '-';
}

service.food.agricultureCategory.list({}).then((list: any[]) => {
  categoryNameMap.value = list.reduce((map, item) => {
    map[item.id] = item.name;
    return map;
  }, {} as Record<string, string>);
});

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: '名称', prop: 'name', minWidth: 150 },
    { label: '分类', prop: 'categoryName', minWidth: 120, formatter: getCategoryName },
    { label: '商家', prop: 'merchantName', minWidth: 140, formatter: (row: any) => getName(row, ['merchantName', 'merchant.shopName', 'shopName', 'merchantId']) },
    { label: '价格', prop: 'price', minWidth: 100 },
    { label: '规格', prop: 'specification', minWidth: 120 },
    { label: '库存', prop: 'stock', minWidth: 80 },
    { label: '产地', prop: 'origin', minWidth: 120 },
    { label: '保质期', prop: 'shelfLife', minWidth: 100 },
    { label: '状态', prop: 'status', minWidth: 80 },
    {
      label: '创建时间',
      prop: 'createTime',
      minWidth: 170,
      sortable: 'desc',
    },
    {
      type: 'op',
      buttons: ['edit', 'delete'],
    },
  ],
});

const Upsert = useUpsert({
  items: [
    { label: '分类', prop: 'categoryId', value: undefined, component: { name: 'cl-select', props: { api: () => service.food.agricultureCategory.list({}), labelKey: 'name', valueKey: 'id' } } },
    { label: '商家', prop: 'merchantId', value: undefined, component: { name: 'cl-select', props: { api: () => service.merchant.list({}), labelKey: 'shopName', valueKey: 'id' } } },
    { label: '名称', prop: 'name', required: true, component: { name: 'el-input' } },
    { label: '主图', prop: 'mainImage', component: { name: 'cl-upload-space', props: { multiple: false, accept: 'image/*' } } },
    { label: '价格', prop: 'price', required: true, value: 0, component: { name: 'el-input-number', props: { min: 0, precision: 2 } } },
    { label: '规格', prop: 'specification', component: { name: 'el-input' } },
    { label: '库存', prop: 'stock', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '产地', prop: 'origin', component: { name: 'el-input' } },
    { label: '保质期', prop: 'shelfLife', component: { name: 'el-input' } },
    { label: '详情', prop: 'detailContent', component: { name: 'el-input', props: { type: 'textarea', rows: 4 } } },
    { label: '状态', prop: 'status', value: 1, component: { name: 'cl-status' } },
  ],
});
</script>
