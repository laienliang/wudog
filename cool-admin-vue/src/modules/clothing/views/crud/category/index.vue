<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn text="新增分类" />
      <cl-flex1 />
      <cl-search-key placeholder="搜索分类名称..." />
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

const Crud = useCrud({ service: service.clothing.category, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
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
    { type: 'selection', width: 50 },
    { label: '分类名称', prop: 'name', minWidth: 120 },
    {
      label: '图标',
      prop: 'icon',
      width: 80,
      component: { name: 'cl-image', props: { size: 32 } },
    },
    { label: '父分类', prop: 'parentName', width: 120, formatter: (row: any) => row.parentId === 0 ? '顶级' : getName(row, ['parentName', 'parent.name', 'parentId']) },
    { label: '排序', prop: 'sort', width: 80 },
    {
      label: '状态',
      prop: 'status',
      width: 80,
      formatter: (row: any) => row.status === 1 ? '启用' : '停用',
    },
    { label: '创建时间', prop: 'createTime', width: 170 },
    { label: '操作', type: 'op', width: 120, buttons: ['edit', 'delete'] },
  ],
});

const Upsert = useUpsert({
  items: [
    { label: '分类名称', prop: 'name', required: true, component: { name: 'el-input' } },
    { label: '图标', prop: 'icon', component: { name: 'cl-upload-space', props: { multiple: false, accept: 'image/*' } } },
    {
      label: '父分类',
      prop: 'parentId',
      component: {
        name: 'cl-select',
        props: {
          api: () => service.clothing.category.list({}),
          labelKey: 'name',
          valueKey: 'id',
        },
      },
    },
    { label: '排序', prop: 'sort', component: { name: 'el-input-number', props: { min: 0 } } },
    {
      label: '状态',
      prop: 'status',
      component: { name: 'el-switch', props: { activeValue: 1, inactiveValue: 0, activeText: '启用', inactiveText: '停用' } },
    },
  ],
});
</script>
