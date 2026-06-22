<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索游记" />
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

const Crud = useCrud({ service: 'community.article' });

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '用户ID', prop: 'userId', width: 100 },
		{ label: '标题', prop: 'title', minWidth: 180 },
		{ label: '点赞', prop: 'likes', width: 80 },
		{ label: '评论', prop: 'comments', width: 80 },
		{ label: '收藏', prop: 'collects', width: 80 },
		{ label: '浏览', prop: 'views', width: 80 },
		{ label: '状态', prop: 'status', width: 100 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '用户ID', prop: 'userId', component: { name: 'el-input-number' } },
		{ label: '标题', prop: 'title', component: { name: 'el-input' } },
		{
			label: '内容',
			prop: 'content',
			component: { name: 'el-input', props: { type: 'textarea' } },
		},
		{
			label: '图片',
			prop: 'images',
			component: { name: 'cl-upload', props: { multiple: true } },
		},
		{ label: '视频链接', prop: 'videoUrl', component: { name: 'el-input' } },
		{ label: '话题ID', prop: 'topicIds', component: { name: 'el-input' } },
		{ label: '关联地点类型', prop: 'relatedPlaceType', component: { name: 'el-input' } },
		{ label: '关联地点ID', prop: 'relatedPlaceId', component: { name: 'el-input-number' } },
		{ label: '状态', prop: 'status', component: { name: 'el-switch' } },
	],
});
</script>
