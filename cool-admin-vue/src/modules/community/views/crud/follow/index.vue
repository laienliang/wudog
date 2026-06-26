<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索关注" />
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

const Crud = useCrud({ service: service.community.follow, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

const Table = useTable({
		columns: [
			{ type: 'selection' },
			{ label: '关注者', prop: 'followerName', minWidth: 120, formatter: (row: any) => formatUserName(row, 'followerId', ['followerName', 'follower.nickName', 'follower.username']) },
			{ label: '被关注者', prop: 'followeeName', minWidth: 120, formatter: (row: any) => formatUserName(row, 'followeeId', ['followeeName', 'followee.nickName', 'followee.username']) },
			{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
			{ label: '关注者', prop: 'followerId', value: 0, component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id' } } },
			{ label: '被关注者', prop: 'followeeId', value: 0, component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id' } } },
	],
});
</script>
