<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-search-key placeholder="搜索商品ID" />
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

const Crud = useCrud({ service: 'clothing.goodsSku' });

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: '商品ID', prop: 'goodsId', minWidth: 100 },
    { label: '规格名称', prop: 'specName', minWidth: 150 },
    { label: '价格', prop: 'price', minWidth: 100 },
    { label: '库存', prop: 'stock', width: 80 },
    { label: '图片', prop: 'image', minWidth: 150 },
    { label: '创建时间', prop: 'createTime', width: 170 },
    {
      type: 'op',
      buttons: ['edit', 'delete'],
    },
  ],
});

const Upsert = useUpsert({
  items: [
    { label: '商品ID', prop: 'goodsId', components: [{ name: 'el-input-number' }] },
    { label: '规格名称', prop: 'specName', components: [{ name: 'el-input' }] },
    { label: '价格', prop: 'price', components: [{ name: 'el-input-number', props: { precision: 2 } }] },
    { label: '库存', prop: 'stock', components: [{ name: 'el-input-number' }] },
    { label: '图片URL', prop: 'image', components: [{ name: 'el-input' }] },
  ],
});
</script>
