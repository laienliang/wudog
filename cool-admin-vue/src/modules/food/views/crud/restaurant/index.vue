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

const Crud = useCrud({ service: service.food.restaurant, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: '餐厅名称', prop: 'name', minWidth: 150 },
    {
      label: '主图',
      prop: 'mainImage',
      width: 80,
      component: { name: 'cl-image', props: { size: 40 } },
    },
    { label: '地址', prop: 'address', minWidth: 200, showOverflowTooltip: true },
    { label: '营业时间', prop: 'businessHours', minWidth: 150 },
    { label: '容量', prop: 'capacity', width: 90 },
    {
      label: '评分',
      prop: 'rating',
      width: 90,
      formatter: (row: any) => {
        const rating = Number(row.rating) || 0;
        return rating.toFixed(1);
      },
    },
    {
      label: '状态',
      prop: 'status',
      width: 90,
      dict: [
        { label: '禁用', value: 0, type: 'danger' },
        { label: '启用', value: 1, type: 'success' },
      ],
    },
    { label: '创建时间', prop: 'createTime', width: 170 },
    { type: 'op', buttons: ['edit', 'delete'] },
  ],
});

const Upsert = useUpsert({
  items: [
    {
      label: '所属商家',
      prop: 'merchantId',
      required: true,
      component: {
        name: 'cl-select',
        props: {
          api: () => service.merchant.list({}),
          labelKey: 'shopName',
          valueKey: 'id',
        },
      },
    },
    { label: '餐厅名称', prop: 'name', required: true, component: { name: 'el-input' } },
    { label: '主图', prop: 'mainImage', component: { name: 'cl-upload-space', props: { multiple: false, accept: 'image/*' } } },
    { label: '简介', prop: 'description', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
    { label: '地址', prop: 'address', component: { name: 'el-input' } },
    { label: '营业时间', prop: 'businessHours', component: { name: 'el-input' } },
    { label: '容量', prop: 'capacity', component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '评分', prop: 'rating', component: { name: 'el-input-number', props: { min: 0, max: 5, precision: 1 } } },
    {
      label: '状态',
      prop: 'status',
      value: 1,
      component: {
        name: 'el-switch',
        props: { activeValue: 1, inactiveValue: 0, activeText: '启用', inactiveText: '禁用' },
      },
    },
  ],
});
</script>
