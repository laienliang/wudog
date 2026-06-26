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
import { createUserNameFormatter } from '/@/modules/base/utils';

const { service } = useCool();
const formatUserName = createUserNameFormatter(service);

const Crud = useCrud({ service: service.community.article, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

const Table = useTable({
	columns: [
			{ type: 'selection' },
			{ label: '标题', prop: 'title', minWidth: 180 },
			{ label: '用户', prop: 'userName', minWidth: 120, formatter: formatUserName },
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
		{
			label: '用户',
			prop: 'userId',
			component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id' } },
			value: '',
		},
		{ label: '标题', prop: 'title', component: { name: 'el-input' } },
		{
			label: '内容',
			prop: 'content',
			component: { name: 'el-input', props: { type: 'textarea' } },
		},
		{
			label: '图片',
			prop: 'images',
			component: { name: 'cl-upload-space', props: { multiple: true, accept: 'image/*' } },
		},
		{ label: '视频链接', prop: 'videoUrl', component: { name: 'el-input' } },
		{ label: '话题', prop: 'topicIds', component: { name: 'el-input' } },
		{ label: '关联地点类型', prop: 'relatedPlaceType', component: { name: 'el-input' } },
		{ label: '状态', prop: 'status', component: { name: 'el-switch' } },
	],
});
</script>
