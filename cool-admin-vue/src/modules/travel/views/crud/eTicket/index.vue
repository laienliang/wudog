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

const Crud = useCrud({ service: service.travel.eTicket, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
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
		{ label: '订单号', prop: 'orderNo', minWidth: 180 },
		{ label: '票券对象', prop: 'targetName', minWidth: 160, formatter: (row: any) => getName(row, ['targetName', 'scenicName', 'routeTitle', 'target.name', 'target.title', 'targetId']) },
		{ label: '二维码', prop: 'qrCode', width: 100 },
		{ label: '状态', prop: 'status', width: 100 },
		{ label: '使用日期', prop: 'useDate', width: 120 },
		{ label: '核销时间', prop: 'verifyTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Search = useSearch({
	items: [
		{ label: '订单号', prop: 'keyWord', component: { name: 'el-input', props: { clearable: true } } },
		{ label: '状态', prop: 'status', component: { name: 'el-switch' } },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '订单号', prop: 'orderNo', component: { name: 'el-input' } },
		{ label: '票券对象', prop: 'targetId', component: { name: 'cl-select', props: { api: () => service.travel.scenic.list({}), labelKey: 'name', valueKey: 'id' } } },
		{ label: '二维码', prop: 'qrCode', component: { name: 'el-input' } },
		{ label: '状态', prop: 'status', component: { name: 'el-switch' } },
		{ label: '使用日期', prop: 'useDate', component: { name: 'el-date-picker', props: { type: 'date' } } },
		{ label: '核销时间', prop: 'verifyTime', component: { name: 'el-date-picker', props: { type: 'datetime' } } },
	],
});
</script>
