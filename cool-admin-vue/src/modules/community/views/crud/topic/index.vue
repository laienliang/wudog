<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索话题" />
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

const Crud = useCrud({ service: 'community.topic' });

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '话题名称', prop: 'name', minWidth: 150 },
		{ label: '描述', prop: 'description', minWidth: 180 },
		{ label: '图标', prop: 'icon', width: 100 },
		{ label: '粉丝数', prop: 'followers', width: 100 },
		{ label: '文章数', prop: 'articles', width: 100 },
		{ label: '是否推荐', prop: 'isRecommended', width: 100 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '话题名称', prop: 'name', component: { name: 'el-input' } },
		{ label: '描述', prop: 'description', component: { name: 'el-input', props: { type: 'textarea' } } },
		{
			label: '图标',
			prop: 'icon',
			component: { name: 'cl-upload' },
		},
		{ label: '粉丝数', prop: 'followers', component: { name: 'el-input-number' } },
		{ label: '文章数', prop: 'articles', component: { name: 'el-input-number' } },
		{ label: '是否推荐', prop: 'isRecommended', component: { name: 'el-switch' } },
	],
});
</script>
