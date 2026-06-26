<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索景区" />
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

const Crud = useCrud({ service: service.travel.scenic, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: '景区名称', prop: 'name', minWidth: 150 },
		{ label: '地址', prop: 'address', minWidth: 180 },
		{ label: '评分', prop: 'rating', width: 100 },
		{ label: '状态', prop: 'status', width: 100 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '商家', prop: 'merchantId', value: 0, component: { name: 'cl-select', props: { api: () => service.merchant.list({}), labelKey: 'shopName', valueKey: 'id' } } },
		{ label: '景区名称', prop: 'name', component: { name: 'el-input' } },
		{ label: '地址', prop: 'address', component: { name: 'el-input' } },
		{
			label: '主图',
			prop: 'mainImage',
			component: { name: 'cl-upload-space', props: { multiple: false, accept: 'image/*' } },
		},
		{ label: '描述', prop: 'description', component: { name: 'el-input', props: { type: 'textarea' } } },
		{ label: '开放时间', prop: 'openHours', component: { name: 'el-input' } },
		{ label: '评分', prop: 'rating', component: { name: 'el-input-number' } },
		{ label: '状态', prop: 'status', component: { name: 'el-switch' } },
	],
});
</script>
