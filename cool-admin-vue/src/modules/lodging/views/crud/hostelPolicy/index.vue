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

const Crud = useCrud({ service: service.lodging.hostelPolicy, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
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
    { label: '民宿', prop: 'hostelName', minWidth: 140, formatter: (row: any) => getName(row, ['hostelName', 'hostel.name', 'hostelId']) },
    { label: '入住时间', prop: 'checkInTime', minWidth: 150 },
    { label: '退房时间', prop: 'checkOutTime', minWidth: 150 },
    { label: '宠物政策', prop: 'petPolicy', minWidth: 120 },
    { label: '含早餐', prop: 'includeBreakfast', minWidth: 80 },
    { label: '押金', prop: 'deposit', minWidth: 100 },
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
    { label: '民宿', prop: 'hostelId', value: 0, component: { name: 'cl-select', props: { api: () => service.lodging.hostel.list({}), labelKey: 'name', valueKey: 'id' } } },
    { label: '入住时间', prop: 'checkInTime', component: { name: 'el-input' } },
    { label: '退房时间', prop: 'checkOutTime', component: { name: 'el-input' } },
    { label: '宠物政策', prop: 'petPolicy', component: { name: 'el-input' } },
    { label: '含早餐', prop: 'includeBreakfast', value: false, component: { name: 'el-switch' } },
    { label: '押金', prop: 'deposit', value: 0, component: { name: 'el-input-number', props: { min: 0, precision: 2 } } },
  ],
});
</script>
