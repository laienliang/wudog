<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn text="新增SKU" />
      <cl-multi-delete-btn text="批量删除" />
      <cl-search-key placeholder="搜索规格名称..." />
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

const Crud = useCrud({ service: service.clothing.goodsSku, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
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
    { label: '商品', prop: 'goodsName', minWidth: 160, formatter: (row: any) => getName(row, ['goodsName', 'goods.title', 'goods.name', 'title', 'goodsId']) },
    { label: '规格名称', prop: 'specName', minWidth: 150 },
    {
      label: '价格',
      prop: 'price',
      width: 100,
      formatter: (row: any) => `¥${Number(row.price).toFixed(2)}`,
    },
    { label: '库存', prop: 'stock', width: 80 },
    {
      label: '图片',
      prop: 'image',
      width: 80,
      component: { name: 'cl-image', props: { size: 40 } },
    },
    { label: '销量', prop: 'sales', width: 80 },
    { label: '创建时间', prop: 'createTime', width: 170 },
    { label: '操作', type: 'op', width: 120, buttons: ['edit', 'delete'] },
  ],
});

const Upsert = useUpsert({
  items: [
    {
      label: '商品',
      prop: 'goodsId',
      required: true,
      component: {
        name: 'cl-select',
        props: {
          api: () => service.clothing.goods.list({}),
          labelKey: 'title',
          valueKey: 'id',
        },
      },
    },
    { label: '规格名称', prop: 'specName', required: true, component: { name: 'el-input' } },
    {
      label: '价格 (¥)',
      prop: 'price',
      required: true,
      component: { name: 'el-input-number', props: { precision: 2, min: 0 } },
    },
    { label: '库存', prop: 'stock', component: { name: 'el-input-number', props: { min: 0 } } },
    { label: '图片', prop: 'image', component: { name: 'cl-upload-space', props: { multiple: false, accept: 'image/*' } } },
  ],
});
</script>
