<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索路线日程" />
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

const Crud = useCrud({ service: 'travel.routeDay' });

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '路线ID', prop: 'routeId', width: 100 },
		{ label: '天数', prop: 'day', width: 80 },
		{ label: '描述', prop: 'description', minWidth: 180 },
		{ label: '景点', prop: 'spots', minWidth: 150 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '路线ID', prop: 'routeId', component: { name: 'el-input-number' } },
		{ label: '天数', prop: 'day', component: { name: 'el-input-number' } },
		{ label: '描述', prop: 'description', component: { name: 'el-input', props: { type: 'textarea' } } },
		{ label: '景点', prop: 'spots', component: { name: 'el-input' } },
		{ label: '餐饮', prop: 'meals', component: { name: 'el-input' } },
		{ label: '住宿', prop: 'accommodation', component: { name: 'el-input' } },
	],
});
</script>
