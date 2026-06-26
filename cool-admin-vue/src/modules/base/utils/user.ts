import { ref } from 'vue';

function readValue(data: any, path: string) {
	if (typeof path !== 'string') {
		return undefined;
	}

	return path.split('.').reduce((value, field) => value?.[field], data);
}

function getUserLabel(user: any) {
	return user?.nickName || user?.username || user?.name || user?.phone;
}

export function createUserNameFormatter(service: any) {
	const userNameMap = ref<Record<string, string>>({});

	service.user.info.list({}).then((list: any[]) => {
		userNameMap.value = list.reduce((map, item) => {
			if (item.id != null) {
				map[item.id] = getUserLabel(item) || String(item.id);
			}

			return map;
		}, {} as Record<string, string>);
	});

	return (row: any, userIdKey: any = 'userId', extraKeys: string[] = []) => {
		const idKey = typeof userIdKey === 'string' ? userIdKey : 'userId';
		const keys = Array.isArray(extraKeys) ? extraKeys : [];

		const name = [
			...keys,
			'userName',
			'user.nickName',
			'user.username',
			'nickName',
			'username'
		]
			.map(key => readValue(row, key))
			.find(Boolean);

		const userId = readValue(row, idKey);

		return name || userNameMap.value[userId] || '-';
	};
}
