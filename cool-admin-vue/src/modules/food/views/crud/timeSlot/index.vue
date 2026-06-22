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

const Crud = useCrud({ service: 'food.timeSlot' });

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: 'ID', prop: 'id', minWidth: 80 },
    { label: '时段名称', prop: 'name', minWidth: 150 },
    { label: '餐厅ID', prop: 'restaurantId', minWidth: 100 },
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
    { label: '餐厅ID', prop: 'restaurantId', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '时段名称', prop: 'name', required: true, component: { name: 'el-input' } },
    { label: '最大预订数', prop: 'maxBookings', required: true, value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
  ],
});
</script>
