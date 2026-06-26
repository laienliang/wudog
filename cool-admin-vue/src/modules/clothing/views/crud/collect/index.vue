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

const Crud = useCrud({ service: service.clothing.collect, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
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
    { label: '用户', prop: 'userName', minWidth: 120, formatter: formatUserName },
    { label: '商品', prop: 'goodsName', minWidth: 160, formatter: (row: any) => getName(row, ['goodsName', 'goods.title', 'goods.name', 'title', 'goodsId']) },
    { label: '创建时间', prop: 'createTime', width: 170 },
    { type: 'op', buttons: ['edit', 'delete'] },
  ],
});

const Search = useSearch({
  items: [
    { label: '用户', prop: 'userId', component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id', clearable: true } } },
    { label: '商品', prop: 'goodsId', component: { name: 'cl-select', props: { api: () => service.clothing.goods.list({}), labelKey: 'title', valueKey: 'id', clearable: true } } },
  ],
});

const Upsert = useUpsert({
  items: [
    { label: '用户', prop: 'userId', value: 0, component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id' } } },
    { label: '商品', prop: 'goodsId', value: 0, component: { name: 'cl-select', props: { api: () => service.clothing.goods.list({}), labelKey: 'title', valueKey: 'id' } } },
  ],
});
</script>
