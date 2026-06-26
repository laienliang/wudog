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
import { createUserNameFormatter } from '/@/modules/base/utils';
import { ref } from 'vue';

const { service } = useCool();
const formatUserName = createUserNameFormatter(service);
const articleNameMap = ref<Record<string, string>>({});

const Crud = useCrud({ service: service.community.comment, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
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

function getArticleName(row: any) {
	const name = getName(row, ['articleTitle', 'article.title']);

	return name !== '-' ? name : articleNameMap.value[row.articleId] || '-';
}

service.community.article.list({}).then((list: any[]) => {
	articleNameMap.value = list.reduce((map, item) => {
		map[item.id] = item.title;
		return map;
	}, {} as Record<string, string>);
});

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: '游记', prop: 'articleTitle', minWidth: 160, formatter: getArticleName },
			{ label: '用户', prop: 'userName', minWidth: 120, formatter: formatUserName },
		{ label: '内容', prop: 'content', minWidth: 180 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Search = useSearch({
	items: [
		{ label: '游记', prop: 'articleId', component: { name: 'cl-select', props: { api: () => service.community.article.list({}), labelKey: 'title', valueKey: 'id', clearable: true } } },
		{ label: '用户', prop: 'userId', component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id', clearable: true } } },
		{ label: '评论内容', prop: 'keyWord', component: { name: 'el-input', props: { clearable: true } } },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '游记', prop: 'articleId', component: { name: 'cl-select', props: { api: () => service.community.article.list({}), labelKey: 'title', valueKey: 'id' } } },
		{ label: '用户', prop: 'userId', component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id' } } },
		{ label: '父级评论', prop: 'parentId', value: 0, component: { name: 'cl-select', props: { api: () => service.community.comment.list({}), labelKey: 'content', valueKey: 'id' } } },
		{ label: '回复用户', prop: 'replyUserId', component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id' } } },
		{ label: '内容', prop: 'content', component: { name: 'el-input', props: { type: 'textarea' } } },
	],
});
</script>
