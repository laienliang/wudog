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

const Crud = useCrud({ service: 'clothing.category' });

const Table = useTable({
  columns: [
    { type: 'selection', width: 50 },
    { label: '分类名称', prop: 'name', minWidth: 120 },
    { label: '图标', prop: 'icon', width: 80, formatter: (row: any) => row.icon ? `<img src="${row.icon}" style="width:32px;height:32px;border-radius:4px;" />` : '-' },
    { label: '父分类', prop: 'parentId', width: 100, formatter: (row: any) => row.parentId === 0 ? '<el-tag size="small">顶级</el-tag>' : row.parentId },
    { label: '排序', prop: 'sort', width: 80 },
    {
      label: '状态',
      prop: 'status',
      width: 80,
      formatter: (row: any) => row.status === 1 ? '<el-tag type="success" size="small">启用</el-tag>' : '<el-tag type="info" size="small">停用</el-tag>',
    },
    { label: '创建时间', prop: 'createTime', width: 170 },
    { label: '操作', type: 'op', width: 120, buttons: ['edit', 'delete'] },
  ],
});

const Upsert = useUpsert({
  items: [
    { label: '分类名称', prop: 'name', required: true, components: [{ name: 'el-input' }] },
    { label: '图标URL', prop: 'icon', components: [{ name: 'el-input' }] },
    { label: '父分类ID', prop: 'parentId', components: [{ name: 'el-input-number', props: { min: 0 } }] },
    { label: '排序', prop: 'sort', components: [{ name: 'el-input-number', props: { min: 0 } }] },
    {
      label: '状态',
      prop: 'status',
      components: [{ name: 'el-switch', props: { activeValue: 1, inactiveValue: 0, activeText: '启用', inactiveText: '停用' } }],
    },
  ],
});
</script>
