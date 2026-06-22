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

const { service } = useCool();

const Crud = useCrud({ service: 'food.agricultureGoods' });

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: 'ID', prop: 'id', minWidth: 80 },
    { label: '名称', prop: 'name', minWidth: 150 },
    { label: '分类ID', prop: 'categoryId', minWidth: 100 },
    { label: '价格', prop: 'price', minWidth: 100 },
    { label: '规格', prop: 'specification', minWidth: 120 },
    { label: '库存', prop: 'stock', minWidth: 80 },
    { label: '产地', prop: 'origin', minWidth: 120 },
    { label: '保质期', prop: 'shelfLife', minWidth: 100 },
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
    { label: '分类ID', prop: 'categoryId', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '商家ID', prop: 'merchantId', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '名称', prop: 'name', required: true, component: { name: 'el-input' } },
    { label: '主图', prop: 'mainImage', component: { name: 'cl-upload' } },
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
