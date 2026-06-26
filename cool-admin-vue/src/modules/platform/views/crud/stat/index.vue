<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-search-key placeholder="搜索统计数据" />
		</cl-row>
		<cl-row>
			<cl-table ref="Table" />
		</cl-row>
		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>
	</cl-crud>
</template>

<script setup lang="ts">
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// 统计数据只读，不支持增删改
const Crud = useCrud({ service: service.platform.stat }, app => {
  app.refresh();
});

const Table = useTable({
	columns: [
		{ label: '统计日期', prop: 'statDate', width: 120 },
		{ label: '新增用户', prop: 'newUserCount', width: 100 },
		{ label: '订单数', prop: 'orderCount', width: 100 },
		{ label: 'GMV', prop: 'gmv', width: 100 },
		{ label: '文章数', prop: 'articleCount', width: 100 },
		{ label: '更新时间', prop: 'createTime', width: 170 },
	],
});
</script>
