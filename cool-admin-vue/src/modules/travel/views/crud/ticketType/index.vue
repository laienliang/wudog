<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索票种" />
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

const Crud = useCrud({ service: 'travel.ticketType' });

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '景区ID', prop: 'scenicId', width: 100 },
		{ label: '票种名称', prop: 'name', minWidth: 150 },
		{ label: '价格', prop: 'price', width: 100 },
		{ label: '库存', prop: 'stock', width: 100 },
		{ label: '有效期规则', prop: 'validityRule', minWidth: 150 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '景区ID', prop: 'scenicId', component: { name: 'el-input-number' } },
		{ label: '票种名称', prop: 'name', component: { name: 'el-input' } },
		{ label: '价格', prop: 'price', component: { name: 'el-input-number' } },
		{ label: '库存', prop: 'stock', component: { name: 'el-input-number' } },
		{ label: '有效期规则', prop: 'validityRule', component: { name: 'el-input' } },
	],
});
</script>
