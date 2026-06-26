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

const Crud = useCrud({ service: service.lodging.review, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
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
    { type: 'selection' },
    { label: '民宿', prop: 'hostelName', minWidth: 140, formatter: (row: any) => getName(row, ['hostelName', 'hostel.name', 'hostelId']) },
    { label: '用户', prop: 'userName', minWidth: 120, formatter: formatUserName },
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

const Search = useSearch({
  items: [
    { label: '民宿', prop: 'hostelId', component: { name: 'cl-select', props: { api: () => service.lodging.hostel.list({}), labelKey: 'name', valueKey: 'id', clearable: true } } },
    { label: '用户', prop: 'userId', component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id', clearable: true } } },
    { label: '评分', prop: 'rating', component: { name: 'el-rate' } },
  ],
});

const Upsert = useUpsert({
  items: [
    { label: '订单', prop: 'orderId', component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '民宿', prop: 'hostelId', component: { name: 'cl-select', props: { api: () => service.lodging.hostel.list({}), labelKey: 'name', valueKey: 'id' } } },
    { label: '用户', prop: 'userId', component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id' } } },
    { label: '评分', prop: 'rating', required: true, value: 5, component: { name: 'el-rate' } },
    { label: '评价内容', prop: 'content', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
    { label: '图片', prop: 'images', component: { name: 'cl-upload-space', props: { multiple: true, accept: 'image/*' } } },
    { label: '回复', prop: 'reply', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
  ],
});
</script>
