<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-flex1 />
      <cl-search-key placeholder="搜索评价内容" />
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

const Crud = useCrud({ service: 'lodging.review' });

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: 'ID', prop: 'id', minWidth: 80 },
    { label: '订单ID', prop: 'orderId', minWidth: 100 },
    { label: '民宿ID', prop: 'hostelId', minWidth: 100 },
    { label: '用户ID', prop: 'userId', minWidth: 100 },
    { label: '评分', prop: 'rating', minWidth: 80 },
    { label: '评价内容', prop: 'content', minWidth: 200, showOverflowTooltip: true },
    { label: '回复', prop: 'reply', minWidth: 200, showOverflowTooltip: true },
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
    { label: '订单ID', prop: 'orderId', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '民宿ID', prop: 'hostelId', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '用户ID', prop: 'userId', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '评分', prop: 'rating', required: true, value: 5, component: { name: 'el-rate' } },
    { label: '评价内容', prop: 'content', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
    { label: '图片', prop: 'images', component: { name: 'cl-upload', props: { multiple: true } } },
    { label: '回复', prop: 'reply', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
  ],
});
</script>
