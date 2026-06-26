<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-flex1 />
      <cl-search-key placeholder="搜索分类名称" />
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

const Crud = useCrud({ service: service.food.agricultureCategory, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: '分类名称', prop: 'name', minWidth: 150 },
    { label: '图标', prop: 'icon', minWidth: 100 },
    { label: '排序', prop: 'sort', minWidth: 80 },
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
    { label: '父级分类', prop: 'parentId', value: 0, component: { name: 'cl-select', props: { api: () => service.food.agricultureCategory.list({}), labelKey: 'name', valueKey: 'id' } } },
    { label: '分类名称', prop: 'name', required: true, component: { name: 'el-input' } },
    { label: '图标', prop: 'icon', component: { name: 'cl-upload-space', props: { multiple: false, accept: 'image/*' } } },
    { label: '排序', prop: 'sort', value: 0, component: { name: 'el-input-number', props: { min: 0 } } },
  ],
});
</script>
