<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索举报" />
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

const Crud = useCrud({ service: service.community.report, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

const Table = useTable({
	columns: [
			{ type: 'selection' },
			{ label: '用户', prop: 'userName', minWidth: 120, formatter: formatUserName },
			{ label: '目标类型', prop: 'targetType', width: 120 },
		{ label: '举报原因', prop: 'reason', minWidth: 180 },
		{ label: '状态', prop: 'status', width: 100 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '用户', prop: 'userId', component: { name: 'cl-select', props: { api: () => service.user.info.list({}), labelKey: 'nickName', valueKey: 'id' } } },
		{ label: '目标类型', prop: 'targetType', component: { name: 'el-input' } },
		{ label: '举报原因', prop: 'reason', component: { name: 'el-input', props: { type: 'textarea' } } },
		{ label: '状态', prop: 'status', component: { name: 'el-switch', props: { activeValue: 1, inactiveValue: 0 } } },
	],
});
</script>
