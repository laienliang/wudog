<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-search-key placeholder="搜索订单ID或商品ID" />
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

const Crud = useCrud({ service: 'clothing.review' });

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: '订单ID', prop: 'orderId', minWidth: 100 },
    { label: '商品ID', prop: 'goodsId', minWidth: 100 },
    { label: '用户ID', prop: 'userId', minWidth: 100 },
    { label: '评分', prop: 'rating', width: 80 },
    { label: '评价内容', prop: 'content', minWidth: 200, formatter: (row: Record<string, unknown>) => (row.content as string)?.substring(0, 50) || '' },
    { label: '商家回复', prop: 'reply', minWidth: 200, formatter: (row: Record<string, unknown>) => (row.reply as string)?.substring(0, 50) || '' },
    { label: '创建时间', prop: 'createTime', width: 170 },
    {
      type: 'op',
      buttons: ['edit', 'delete'],
    },
  ],
});

const Upsert = useUpsert({
  items: [
    { label: '订单ID', prop: 'orderId', components: [{ name: 'el-input-number' }] },
    { label: '商品ID', prop: 'goodsId', components: [{ name: 'el-input-number' }] },
    { label: '用户ID', prop: 'userId', components: [{ name: 'el-input-number' }] },
    { label: '评分', prop: 'rating', components: [{ name: 'el-input-number', props: { min: 1, max: 5 } }] },
    { label: '评价内容', prop: 'content', components: [{ name: 'el-input', props: { type: 'textarea', rows: 3 } }] },
    { label: '商家回复', prop: 'reply', components: [{ name: 'el-input', props: { type: 'textarea', rows: 3 } }] },
  ],
});
</script>
