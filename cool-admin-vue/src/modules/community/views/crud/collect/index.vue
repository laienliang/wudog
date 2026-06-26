<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索收藏" />
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
import { ref } from 'vue';

const { service } = useCool();
const formatUserName = createUserNameFormatter(service);
const articleNameMap = ref<Record<string, string>>({});

const Crud = useCrud({ service: service.community.collect, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

function getArticleName(row: any) {
	const name = ['articleTitle', 'article.title', 'title']
		.map(key => key.split('.').reduce((data, field) => data?.[field], row))
		.find(Boolean);

	return name || articleNameMap.value[row.articleId] || '-';
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
		{ label: '创建时间', prop: 'createTime', width: 170 },
			{
				label: '用户',
				prop: 'userName',
				width: 120,
				formatter: formatUserName,
			},
		{
			label: '游记',
			prop: 'articleTitle',
			width: 180,
			formatter: getArticleName,
		},
	],
});

const Upsert = useUpsert({
	items: [
		{
			label: '用户',
			prop: 'userId',
			component: {
				name: 'cl-select',
				props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id' },
			},
		},
		{
			label: '游记',
			prop: 'articleId',
			component: {
				name: 'cl-select',
				props: { api: () => service.community.article.list({}), labelKey: 'title', valueKey: 'id' },
			},
		},
	],
});
</script>
