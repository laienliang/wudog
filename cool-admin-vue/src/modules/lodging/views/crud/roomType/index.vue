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

const Crud = useCrud({ service: 'lodging.roomType' });

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: 'ID', prop: 'id', minWidth: 80 },
    { label: '房型名称', prop: 'name', minWidth: 150 },
    { label: '民宿ID', prop: 'hostelId', minWidth: 100 },
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
    { label: '民宿ID', prop: 'hostelId', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '房型名称', prop: 'name', required: true, component: { name: 'el-input' } },
    { label: '床型', prop: 'bedType', component: { name: 'el-input' } },
    { label: '面积', prop: 'area', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '容量', prop: 'capacity', value: 1, component: { name: 'el-input-number', props: { min: 1 } } },
    { label: '设施', prop: 'facilities', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
    { label: '价格', prop: 'price', required: true, value: 0, component: { name: 'el-input-number', props: { min: 0, precision: 2 } } },
    { label: '库存', prop: 'stock', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '主图', prop: 'mainImage', component: { name: 'cl-upload' } },
  ],
});
</script>
