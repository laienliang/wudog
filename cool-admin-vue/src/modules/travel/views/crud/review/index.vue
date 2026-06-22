<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索评价" />
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

const Crud = useCrud({ service: 'travel.review' });

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '订单ID', prop: 'orderId', width: 100 },
		{ label: '目标ID', prop: 'targetId', width: 100 },
		{ label: '用户ID', prop: 'userId', width: 100 },
		{ label: '评分', prop: 'rating', width: 80 },
		{ label: '内容', prop: 'content', minWidth: 180 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '订单ID', prop: 'orderId', component: { name: 'el-input-number' } },
		{ label: '目标ID', prop: 'targetId', component: { name: 'el-input-number' } },
		{ label: '用户ID', prop: 'userId', component: { name: 'el-input-number' } },
		{ label: '评分', prop: 'rating', component: { name: 'el-rate' } },
		{ label: '内容', prop: 'content', component: { name: 'el-input', props: { type: 'textarea' } } },
		{
			label: '图片',
			prop: 'images',
			component: { name: 'cl-upload', props: { multiple: true } },
		},
	],
});
</script>
