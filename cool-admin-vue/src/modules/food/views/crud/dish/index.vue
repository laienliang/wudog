<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-flex1 />
      <cl-search-key placeholder="搜索菜品名称" />
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
const restaurantNameMap = ref<Record<string, string>>({});

const signatureOptions = [
  { label: '否', value: 0, type: 'info' },
  { label: '是', value: 1, type: 'success' },
];

const Crud = useCrud({ service: service.food.dish, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

function getRestaurantName(row: any) {
  const name = ['restaurantName', 'restaurant.name']
    .map(key => key.split('.').reduce((data, field) => data?.[field], row))
    .find(Boolean);

  return name || restaurantNameMap.value[row.restaurantId] || '-';
}

service.food.restaurant.list({}).then((list: any[]) => {
  restaurantNameMap.value = list.reduce((map, item) => {
    map[item.id] = item.name;
    return map;
  }, {} as Record<string, string>);
});

const Table = useTable({
  columns: [
    { type: 'selection' },
    {
      label: '主图',
      prop: 'mainImage',
      width: 80,
      component: { name: 'cl-image', props: { size: 40 } },
    },
    { label: '菜品名称', prop: 'name', minWidth: 150 },
    { label: '所属餐厅', prop: 'restaurantName', minWidth: 140, formatter: getRestaurantName },
    { label: '价格', prop: 'price', minWidth: 100 },
    { label: '是否招牌菜', prop: 'isSignature', minWidth: 100, dict: signatureOptions },
    { label: '排序', prop: 'sort', minWidth: 80 },
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
    { label: '所属餐厅', prop: 'restaurantId', value: 0, component: { name: 'cl-select', props: { api: () => service.food.restaurant.list({}), labelKey: 'name', valueKey: 'id' } } },
    { label: '菜品名称', prop: 'name', required: true, component: { name: 'el-input' } },
    { label: '主图', prop: 'mainImage', component: { name: 'cl-upload-space', props: { multiple: false, accept: 'image/*' } } },
    { label: '价格', prop: 'price', required: true, value: 0, component: { name: 'el-input-number', props: { min: 0, precision: 2 } } },
    { label: '描述', prop: 'description', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
    { label: '是否招牌菜', prop: 'isSignature', value: 0, component: { name: 'el-switch', props: { activeValue: 1, inactiveValue: 0, activeText: '是', inactiveText: '否' } } },
    { label: '排序', prop: 'sort', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
  ],
});
</script>
