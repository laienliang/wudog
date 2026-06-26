<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-flex1 />
      <cl-search ref="Search" />
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
import { useCrud, useSearch, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { createUserNameFormatter } from '/@/modules/base/utils';

const { service } = useCool();
const formatUserName = createUserNameFormatter(service);

const Crud = useCrud({ service: service.food.collect, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

const targetTypeOptions = [
  { label: '农产品', value: 1 },
  { label: '餐厅', value: 2 },
  { label: '菜品', value: 3 },
];

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
    { label: '用户', prop: 'userName', minWidth: 120, formatter: formatUserName },
    { label: '目标类型', prop: 'targetType', minWidth: 100, dict: targetTypeOptions },
    { label: '收藏对象', prop: 'targetName', minWidth: 160, formatter: (row: any) => getName(row, ['targetName', 'goodsName', 'restaurantName', 'dishName', 'target.title', 'target.name', 'targetId']) },
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

const Search = useSearch({
  items: [
    { label: '用户', prop: 'userId', component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id', clearable: true } } },
    { label: '目标类型', prop: 'targetType', component: { name: 'cl-select', props: { options: targetTypeOptions, clearable: true } } },
  ],
});

const Upsert = useUpsert({
  items: [
    { label: '用户', prop: 'userId', value: 0, component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id' } } },
    { label: '目标类型', prop: 'targetType', value: 1, component: { name: 'cl-select', props: { options: targetTypeOptions } } },
    { label: '收藏对象', prop: 'targetId', value: 0, component: { name: 'cl-select', props: { api: () => service.food.agricultureGoods.list({}), labelKey: 'name', valueKey: 'id' } } },
  ],
});
</script>
