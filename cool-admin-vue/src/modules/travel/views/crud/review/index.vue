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

const { service } = useCool();
const formatUserName = createUserNameFormatter(service);

const Crud = useCrud({ service: service.travel.review, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
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
			{ label: '用户', prop: 'userName', minWidth: 120, formatter: formatUserName },
		{ label: '评价对象', prop: 'targetName', minWidth: 160, formatter: (row: any) => getName(row, ['targetName', 'scenicName', 'routeTitle', 'target.name', 'target.title', 'targetId']) },
		{ label: '评分', prop: 'rating', width: 80 },
		{ label: '内容', prop: 'content', minWidth: 180 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Search = useSearch({
	items: [
		{ label: '用户', prop: 'userId', component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id', clearable: true } } },
		{ label: '评分', prop: 'rating', component: { name: 'el-rate' } },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '订单', prop: 'orderId', component: { name: 'el-input-number' } },
		{ label: '评价对象', prop: 'targetId', component: { name: 'cl-select', props: { api: () => service.travel.scenic.list({}), labelKey: 'name', valueKey: 'id' } } },
		{ label: '用户', prop: 'userId', component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id' } } },
		{ label: '评分', prop: 'rating', component: { name: 'el-rate' } },
		{ label: '内容', prop: 'content', component: { name: 'el-input', props: { type: 'textarea' } } },
		{
			label: '图片',
			prop: 'images',
			component: { name: 'cl-upload-space', props: { multiple: true, accept: 'image/*' } },
		},
	],
});
</script>
