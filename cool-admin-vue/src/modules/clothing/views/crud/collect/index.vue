<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-search-key placeholder="搜索用户ID或商品ID" />
    </cl-row>
    <cl-row>
      <cl-table ref="Table" />
    </cl-row>
    <cl-row>
      <cl-flex1 />
      <cl-pagination />
    </cl-row>
  </cl-crud>
</template>

<script setup lang="ts">
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

const Crud = useCrud({ service: 'clothing.collect' });

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: '用户ID', prop: 'userId', minWidth: 100 },
    { label: '商品ID', prop: 'goodsId', minWidth: 100 },
    { label: '创建时间', prop: 'createTime', width: 170 },
  ],
});
</script>
