<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-flex1 />
      <cl-search-key placeholder="搜索时段名称" />
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

const Crud = useCrud({ service: service.food.timeSlot, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
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

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: '所属餐厅', prop: 'restaurantName', minWidth: 140, formatter: (row: any) => getName(row, ['restaurantName', 'restaurant.name', 'restaurantId']) },
    { label: '时段名称', prop: 'name', minWidth: 150 },
    { label: '最大预订数', prop: 'maxBookings', minWidth: 120 },
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
    { label: '时段名称', prop: 'name', required: true, component: { name: 'el-input' } },
    { label: '最大预订数', prop: 'maxBookings', required: true, value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
  ],
});
</script>
