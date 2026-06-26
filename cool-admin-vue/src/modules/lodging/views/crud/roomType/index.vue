<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-flex1 />
      <cl-search-key placeholder="搜索房型名称" />
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

const Crud = useCrud({ service: service.lodging.roomType, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
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
    { label: '房型名称', prop: 'name', minWidth: 150 },
    { label: '床型', prop: 'bedType', minWidth: 120 },
    { label: '面积', prop: 'area', minWidth: 100 },
    { label: '容量', prop: 'capacity', minWidth: 80 },
    { label: '设施', prop: 'facilities', minWidth: 150, showOverflowTooltip: true },
    { label: '价格', prop: 'price', minWidth: 100 },
    { label: '库存', prop: 'stock', minWidth: 80 },
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
    { label: '房型名称', prop: 'name', required: true, component: { name: 'el-input' } },
    { label: '床型', prop: 'bedType', component: { name: 'el-input' } },
    { label: '面积', prop: 'area', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '容量', prop: 'capacity', value: 1, component: { name: 'el-input-number', props: { min: 1 } } },
    { label: '设施', prop: 'facilities', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
    { label: '价格', prop: 'price', required: true, value: 0, component: { name: 'el-input-number', props: { min: 0, precision: 2 } } },
    { label: '库存', prop: 'stock', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '主图', prop: 'mainImage', component: { name: 'cl-upload-space', props: { multiple: false, accept: 'image/*' } } },
  ],
});
</script>
