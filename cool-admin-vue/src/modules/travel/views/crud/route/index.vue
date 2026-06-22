<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索路线" />
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

const Crud = useCrud({ service: 'travel.route' });

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '商家ID', prop: 'merchantId', width: 100 },
		{ label: '标题', prop: 'title', minWidth: 150 },
		{ label: '天数', prop: 'days', width: 80 },
		{ label: '价格', prop: 'price', width: 100 },
		{ label: '状态', prop: 'status', width: 100 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '商家ID', prop: 'merchantId', component: { name: 'el-input-number' } },
		{ label: '标题', prop: 'title', component: { name: 'el-input' } },
		{
			label: '主图',
			prop: 'mainImage',
			component: { name: 'cl-upload' },
		},
		{ label: '天数', prop: 'days', component: { name: 'el-input-number' } },
		{ label: '价格', prop: 'price', component: { name: 'el-input-number' } },
		{ label: '包含内容', prop: 'includes', component: { name: 'el-input', props: { type: 'textarea' } } },
		{ label: '备注', prop: 'notes', component: { name: 'el-input', props: { type: 'textarea' } } },
		{
			label: '详情内容',
			prop: 'detailContent',
			component: { name: 'el-input', props: { type: 'textarea' } },
		},
		{ label: '状态', prop: 'status', component: { name: 'el-switch' } },
	],
});
</script>
