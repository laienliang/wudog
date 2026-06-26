<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-flex1 />
      <cl-search-key placeholder="搜索民宿名称" />
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

const Crud = useCrud({ service: service.lodging.hostel, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: '名称', prop: 'name', minWidth: 150 },
    { label: '地址', prop: 'address', minWidth: 200, showOverflowTooltip: true },
    { label: '评分', prop: 'rating', minWidth: 80 },
    { label: '风格标签', prop: 'styleTags', minWidth: 150, showOverflowTooltip: true },
    { label: '设施标签', prop: 'facilityTags', minWidth: 150, showOverflowTooltip: true },
    { label: '状态', prop: 'status', minWidth: 80 },
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
    { label: '商家', prop: 'merchantId', value: 0, component: { name: 'cl-select', props: { api: () => service.merchant.list({}), labelKey: 'shopName', valueKey: 'id' } } },
    { label: '名称', prop: 'name', required: true, component: { name: 'el-input' } },
    { label: '地址', prop: 'address', required: true, component: { name: 'el-input' } },
    { label: '主图', prop: 'mainImage', component: { name: 'cl-upload-space', props: { multiple: false, accept: 'image/*' } } },
    { label: '图片集', prop: 'images', component: { name: 'cl-upload-space', props: { multiple: true, accept: 'image/*' } } },
    { label: '描述', prop: 'description', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
    { label: '评分', prop: 'rating', value: 0, component: { name: 'el-input-number', props: { min: 0, max: 5, step: 0.1 } } },
    { label: '风格标签', prop: 'styleTags', component: { name: 'el-input' } },
    { label: '设施标签', prop: 'facilityTags', component: { name: 'el-input' } },
    { label: '状态', prop: 'status', value: 1, component: { name: 'cl-status' } },
  ],
});
</script>
