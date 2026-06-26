<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索推荐位" />
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

const Crud = useCrud({ service: service.platform.recommend }, app => {
  app.refresh();
});

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: '名称', prop: 'name', minWidth: 150 },
		{ label: '内容类型', prop: 'contentType', width: 120 },
		{ label: '排序', prop: 'sort', width: 80 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '名称', prop: 'name', component: { name: 'el-input' } },
		{ label: '内容类型', prop: 'contentType', component: { name: 'el-input' } },
		{ label: '排序', prop: 'sort', component: { name: 'el-input-number' } },
	],
});
</script>
