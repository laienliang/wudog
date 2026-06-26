<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn text="新增评价" />
      <cl-multi-delete-btn text="批量删除" />
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

const Crud = useCrud({ service: service.clothing.review, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
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
    {
      label: '评分',
      prop: 'rating',
      width: 80,
      formatter: (row: any) => {
        const stars = '⭐'.repeat(parseInt(row.rating) || 0);
        return stars;
      },
    },
    { label: '评价内容', prop: 'content', minWidth: 200, formatter: (row: any) => (row.content || '').substring(0, 50) },
    { label: '商家回复', prop: 'reply', minWidth: 150, formatter: (row: any) => (row.reply || '').substring(0, 50) },
    {
      label: '匿名',
      prop: 'isAnonymous',
      width: 80,
      formatter: (row: any) => row.isAnonymous === 1 ? '是' : '否',
    },
    { label: '创建时间', prop: 'createTime', width: 170 },
    { label: '操作', type: 'op', width: 120, buttons: ['edit', 'delete'] },
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
    { label: '商品', prop: 'goodsId', component: { name: 'cl-select', props: { api: () => service.clothing.goods.list({}), labelKey: 'title', valueKey: 'id' } } },
    { label: '评分', prop: 'rating', component: { name: 'el-rate', props: { max: 5 } } },
    { label: '评价内容', prop: 'content', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
    {
      label: '是否匿名',
      prop: 'isAnonymous',
      component: { name: 'el-switch', props: { activeValue: 1, inactiveValue: 0, activeText: '匿名', inactiveText: '不匿名' } },
    },
  ],
});
</script>
