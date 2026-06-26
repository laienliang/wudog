<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索敏感词" />
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

const Crud = useCrud({ service: service.platform.sensitiveWord }, app => {
  app.refresh();
});

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: '敏感词', prop: 'word', minWidth: 150 },
		{ label: '类型', prop: 'type', width: 100 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '敏感词', prop: 'word', component: { name: 'el-input' } },
		{ label: '类型', prop: 'type', component: { name: 'el-input' } },
	],
});
</script>
