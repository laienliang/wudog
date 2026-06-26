<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search ref="Search" />
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
import { useCrud, useSearch, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

const Crud = useCrud({ service: service.community.image, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
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
		{ type: 'selection' },
		{ label: '游记', prop: 'articleTitle', minWidth: 160, formatter: (row: any) => getName(row, ['articleTitle', 'article.title', 'articleId']) },
		{ label: '图片链接', prop: 'imageUrl', minWidth: 200 },
		{ label: '排序', prop: 'sort', width: 80 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ label: '操作', type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Search = useSearch({
	items: [
		{ label: '游记', prop: 'articleId', component: { name: 'cl-select', props: { api: () => service.community.article.list({}), labelKey: 'title', valueKey: 'id', clearable: true } } },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '游记', prop: 'articleId', component: { name: 'cl-select', props: { api: () => service.community.article.list({}), labelKey: 'title', valueKey: 'id' } } },
		{
			label: '图片链接',
			prop: 'imageUrl',
			component: { name: 'cl-upload-space', props: { multiple: false, accept: 'image/*' } },
		},
		{ label: '排序', prop: 'sort', component: { name: 'el-input-number' } },
	],
});
</script>
