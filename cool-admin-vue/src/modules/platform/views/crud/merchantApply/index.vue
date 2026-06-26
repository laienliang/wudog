<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-flex1 />
      <cl-search-key placeholder="搜索店铺名称、联系人" />
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
import { createUserNameFormatter } from '/@/modules/base/utils';

const { service } = useCool();
const formatUserName = createUserNameFormatter(service);

const moduleOptions = [
  { label: '衣', value: 1 },
  { label: '食', value: 2 },
  { label: '住', value: 3 },
  { label: '行', value: 4 },
];

const statusOptions = [
  { label: '待审核', value: 0, type: 'warning' },
  { label: '通过', value: 1, type: 'success' },
  { label: '驳回', value: 2, type: 'danger' },
];

const Crud = useCrud({ service: service.platform.merchantApply }, app => {
  app.refresh();
});

const Table = useTable({
  columns: [
	    { type: 'selection' },
	    { label: '店铺名称', prop: 'shopName', minWidth: 160 },
	    { label: '申请人', prop: 'userName', width: 120, formatter: formatUserName },
	    { label: '所属模块', prop: 'moduleType', width: 100, dict: moduleOptions },
    { label: '联系人', prop: 'contactName', width: 120 },
    { label: '联系电话', prop: 'contactPhone', width: 140 },
    { label: '审核状态', prop: 'status', width: 100, dict: statusOptions },
    { label: '审核人', prop: 'reviewer', width: 120 },
    { label: '审核时间', prop: 'reviewTime', width: 170 },
    { label: '创建时间', prop: 'createTime', width: 170 },
    { type: 'op', buttons: ['edit', 'delete'] },
  ],
});

const Upsert = useUpsert({
  items: [
    {
      label: '申请人',
      prop: 'userId',
      required: true,
      component: {
        name: 'cl-select',
        props: {
          api: () => service.user.info.list({}),
          labelKey: 'nickName',
          valueKey: 'id',
        },
      },
    },
    { label: '店铺名称', prop: 'shopName', required: true, component: { name: 'el-input' } },
    {
      label: '所属模块',
      prop: 'moduleType',
      required: true,
      component: {
        name: 'cl-select',
        props: { options: moduleOptions },
      },
    },
    { label: '联系人', prop: 'contactName', required: true, component: { name: 'el-input' } },
    { label: '联系电话', prop: 'contactPhone', required: true, component: { name: 'el-input' } },
    { label: '资质材料', prop: 'materials', component: { name: 'el-input', props: { type: 'textarea', rows: 4 } } },
    {
      label: '审核状态',
      prop: 'status',
      value: 0,
      component: {
        name: 'cl-select',
        props: { options: statusOptions },
      },
    },
    { label: '审核人', prop: 'reviewer', component: { name: 'el-input' } },
    { label: '审核时间', prop: 'reviewTime', component: { name: 'el-date-picker', props: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' } } },
    { label: '驳回原因', prop: 'rejectReason', component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
  ],
});
</script>
