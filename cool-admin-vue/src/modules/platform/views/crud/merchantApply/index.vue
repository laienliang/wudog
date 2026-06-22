<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索商家入驻申请" />
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

const Crud = useCrud({ service: 'platform.merchantApply' });

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '用户ID', prop: 'userId', width: 100 },
		{ label: '店铺名称', prop: 'shopName', minWidth: 150 },
		{ label: '模块类型', prop: 'moduleType', width: 120 },
		{ label: '联系人', prop: 'contactName', width: 100 },
		{ label: '联系电话', prop: 'contactPhone', width: 130 },
		{ label: '审核状态', prop: 'status', width: 100 },
		{ label: '审核人', prop: 'reviewer', width: 100 },
		{ label: '审核时间', prop: 'reviewTime', width: 170 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '用户ID', prop: 'userId', component: { name: 'el-input-number' } },
		{ label: '店铺名称', prop: 'shopName', component: { name: 'el-input' } },
		{ label: '模块类型', prop: 'moduleType', component: { name: 'el-input' } },
		{ label: '联系人', prop: 'contactName', component: { name: 'el-input' } },
		{ label: '联系电话', prop: 'contactPhone', component: { name: 'el-input' } },
		{
			label: '材料',
			prop: 'materials',
			component: { name: 'cl-upload', props: { multiple: true } },
		},
		{ label: '审核状态', prop: 'status', component: { name: 'el-input' } },
		{ label: '审核人', prop: 'reviewer', component: { name: 'el-input' } },
		{ label: '审核时间', prop: 'reviewTime', component: { name: 'el-date-picker', props: { type: 'datetime' } } },
		{ label: '拒绝原因', prop: 'rejectReason', component: { name: 'el-input', props: { type: 'textarea' } } },
	],
});
</script>
