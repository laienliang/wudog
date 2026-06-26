<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="搜索路线日程" />
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
import { ref } from 'vue';

const { service } = useCool();
const routeNameMap = ref<Record<string, string>>({});

const Crud = useCrud({ service: service.travel.routeDay, permission: { add: true, update: true, delete: true, page: true, list: true, info: true } }, app => {
  app.refresh();
});

function getRouteName(row: any) {
  const name = ['routeTitle', 'routeName', 'route.title']
    .map(key => key.split('.').reduce((data, field) => data?.[field], row))
    .find(Boolean);

  return name || routeNameMap.value[row.routeId] || '-';
}

service.travel.route.list({}).then((list: any[]) => {
  routeNameMap.value = list.reduce((map, item) => {
    map[item.id] = item.title;
    return map;
  }, {} as Record<string, string>);
});

const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: '路线', prop: 'routeTitle', minWidth: 160, formatter: getRouteName },
		{ label: '天数', prop: 'day', width: 80 },
		{ label: '描述', prop: 'description', minWidth: 180 },
		{ label: '景点', prop: 'spots', minWidth: 150 },
		{ label: '创建时间', prop: 'createTime', width: 170 },
		{ type: 'op', buttons: ['edit', 'delete'] },
	],
});

const Upsert = useUpsert({
	items: [
		{ label: '路线', prop: 'routeId', required: true, value: undefined, component: { name: 'cl-select', props: { api: () => service.travel.route.list({}), labelKey: 'title', valueKey: 'id' } } },
		{ label: '天数', prop: 'day', required: true, value: 1, component: { name: 'el-input-number', props: { min: 1 } } },
		{ label: '描述', prop: 'description', required: true, component: { name: 'el-input', props: { type: 'textarea', rows: 3 } } },
		{ label: '景点', prop: 'spots', component: { name: 'el-input' } },
		{ label: '餐饮', prop: 'meals', component: { name: 'el-input' } },
		{ label: '住宿', prop: 'accommodation', component: { name: 'el-input' } },
	],
});
</script>
