<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-flex1 />
      <cl-search-key placeholder="搜索" />
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

const Crud = useCrud({ service: 'lodging.calendar' });

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: 'ID', prop: 'id', minWidth: 80 },
    { label: '房型ID', prop: 'roomTypeId', minWidth: 100 },
    { label: '日期', prop: 'date', minWidth: 120 },
    { label: '可用库存', prop: 'availableStock', minWidth: 100 },
    { label: '价格', prop: 'price', minWidth: 100 },
    { label: '是否可用', prop: 'isAvailable', minWidth: 100 },
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
    { label: '房型ID', prop: 'roomTypeId', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '日期', prop: 'date', required: true, component: { name: 'el-date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' } } },
    { label: '可用库存', prop: 'availableStock', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '价格', prop: 'price', required: true, value: 0, component: { name: 'el-input-number', props: { min: 0, precision: 2 } } },
    { label: '是否可用', prop: 'isAvailable', value: true, component: { name: 'el-switch' } },
  ],
});
</script>
