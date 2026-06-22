<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索举报" />
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

const Crud = useCrud({ service: 'community.report' });

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '用户ID', prop: 'userId', width: 100 },
		{ label: '目标类型', prop: 'targetType', width: 120 },
		{ label: '目标ID', prop: 'targetId', width: 100 },
		{ label: '举报原因', prop: 'reason', minWidth: 180 },
		{ label: '状态', prop: 'status', width: 100 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '用户ID', prop: 'userId', component: { name: 'el-input-number' } },
		{ label: '目标类型', prop: 'targetType', component: { name: 'el-input' } },
		{ label: '目标ID', prop: 'targetId', component: { name: 'el-input-number' } },
		{ label: '举报原因', prop: 'reason', component: { name: 'el-input', props: { type: 'textarea' } } },
		{ label: '状态', prop: 'status', component: { name: 'el-input' } },
	],
});
</script>
