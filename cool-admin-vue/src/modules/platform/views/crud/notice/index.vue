<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索公告" />
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

const Crud = useCrud({ service: 'platform.notice' });

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '标题', prop: 'title', minWidth: 180 },
		{ label: '内容', prop: 'content', minWidth: 200 },
		{ label: '排序', prop: 'sort', width: 80 },
		{ label: '状态', prop: 'status', width: 100 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '标题', prop: 'title', component: { name: 'el-input' } },
		{
			label: '内容',
			prop: 'content',
			component: { name: 'el-input', props: { type: 'textarea' } },
		},
		{ label: '排序', prop: 'sort', component: { name: 'el-input-number' } },
		{ label: '状态', prop: 'status', component: { name: 'el-switch' } },
	],
});
</script>
