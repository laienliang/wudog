<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索攻略" />
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

const Crud = useCrud({ service: 'travel.guide' });

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '标题', prop: 'title', minWidth: 150 },
		{ label: '出发地', prop: 'departure', width: 120 },
		{ label: '交通方式', prop: 'transport', width: 120 },
		{ label: '时长', prop: 'duration', width: 100 },
		{ label: '费用', prop: 'cost', width: 100 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '标题', prop: 'title', component: { name: 'el-input' } },
		{ label: '出发地', prop: 'departure', component: { name: 'el-input' } },
		{ label: '交通方式', prop: 'transport', component: { name: 'el-input' } },
		{ label: '时长', prop: 'duration', component: { name: 'el-input' } },
		{ label: '费用', prop: 'cost', component: { name: 'el-input' } },
		{
			label: '内容',
			prop: 'content',
			component: { name: 'el-input', props: { type: 'textarea' } },
		},
		{
			label: '图片',
			prop: 'images',
			component: { name: 'cl-upload', props: { multiple: true } },
		},
	],
});
</script>
