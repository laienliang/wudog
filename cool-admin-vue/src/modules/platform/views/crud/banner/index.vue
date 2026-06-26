<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索轮播图" />
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

const Crud = useCrud({ service: service.platform.banner, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: '标题', prop: 'title', minWidth: 150 },
		{ label: '图片', prop: 'imageUrl', width: 120 },
		{ label: '链接', prop: 'linkUrl', minWidth: 180 },
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
			label: '图片',
			prop: 'imageUrl',
			component: { name: 'cl-upload-space', props: { multiple: false, accept: 'image/*' } },
		},
		{ label: '链接', prop: 'linkUrl', component: { name: 'el-input' } },
		{ label: '排序', prop: 'sort', component: { name: 'el-input-number' } },
		{ label: '状态', prop: 'status', component: { name: 'el-switch' } },
	],
});
</script>
