<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索评论" />
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

const Crud = useCrud({ service: 'community.comment' });

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '游记ID', prop: 'articleId', width: 100 },
		{ label: '用户ID', prop: 'userId', width: 100 },
		{ label: '父级ID', prop: 'parentId', width: 100 },
		{ label: '回复用户ID', prop: 'replyUserId', width: 120 },
		{ label: '内容', prop: 'content', minWidth: 180 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '游记ID', prop: 'articleId', component: { name: 'el-input-number' } },
		{ label: '用户ID', prop: 'userId', component: { name: 'el-input-number' } },
		{ label: '父级ID', prop: 'parentId', component: { name: 'el-input-number' } },
		{ label: '回复用户ID', prop: 'replyUserId', component: { name: 'el-input-number' } },
		{ label: '内容', prop: 'content', component: { name: 'el-input', props: { type: 'textarea' } } },
	],
});
</script>
