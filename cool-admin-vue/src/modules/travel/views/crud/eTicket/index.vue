<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索电子票" />
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

const Crud = useCrud({ service: 'travel.eTicket' });

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '订单号', prop: 'orderNo', minWidth: 180 },
		{ label: '目标ID', prop: 'targetId', width: 100 },
		{ label: '二维码', prop: 'qrCode', width: 100 },
		{ label: '状态', prop: 'status', width: 100 },
		{ label: '使用日期', prop: 'useDate', width: 120 },
		{ label: '核销时间', prop: 'verifyTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '订单号', prop: 'orderNo', component: { name: 'el-input' } },
		{ label: '目标ID', prop: 'targetId', component: { name: 'el-input-number' } },
		{ label: '二维码', prop: 'qrCode', component: { name: 'el-input' } },
		{ label: '状态', prop: 'status', component: { name: 'el-input' } },
		{ label: '使用日期', prop: 'useDate', component: { name: 'el-date-picker', props: { type: 'date' } } },
		{ label: '核销时间', prop: 'verifyTime', component: { name: 'el-date-picker', props: { type: 'datetime' } } },
	],
});
</script>
