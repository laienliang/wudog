<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-flex1 />
      <cl-search-key placeholder="搜索餐厅名称" />
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

const Crud = useCrud({ service: 'food.restaurant' });

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: 'ID', prop: 'id', minWidth: 80 },
    { label: '名称', prop: 'name', minWidth: 150 },
    { label: '简介', prop: 'description', minWidth: 200, showOverflowTooltip: true },
    { label: '地址', prop: 'address', minWidth: 200, showOverflowTooltip: true },
    { label: '营业时间', prop: 'businessHours', minWidth: 150 },
    { label: '容量', prop: 'capacity', minWidth: 80 },
    { label: '评分', prop: 'rating', minWidth: 80 },
    { label: '状态', prop: 'status', minWidth: 80 },
    { label: '商家ID', prop: 'merchantId', minWidth: 100 },
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
    { label: '名称', prop: 'name', required: true, component: { name: 'el-input' } },
    { label: '简介', prop: 'description', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
    { label: '主图', prop: 'mainImage', component: { name: 'cl-upload' } },
    { label: '地址', prop: 'address', component: { name: 'el-input' } },
    { label: '营业时间', prop: 'businessHours', component: { name: 'el-input' } },
    { label: '容量', prop: 'capacity', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '评分', prop: 'rating', value: 0, component: { name: 'el-input-number', props: { min: 0, max: 5, step: 0.1 } } },
    { label: '状态', prop: 'status', value: 1, component: { name: 'cl-status' } },
    { label: '商家ID', prop: 'merchantId', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
  ],
});
</script>
