import {
	CustomBoolean,
	CustomNumber,
	CustomString,
	CustomNil,
	CustomMap,
	CustomList
} from 'greybel-interpreter';

export function toNumber(customValue: any): CustomNumber {
	if (customValue instanceof CustomNumber) {
		return customValue;
	} else if (customValue instanceof CustomBoolean || customValue instanceof CustomString) {
		return new CustomNumber(Number(customValue.value));
	}
	return new CustomNumber(.0);
}

export function toBoolean(customValue: any): CustomBoolean {
	return new CustomBoolean(!!customValue.valueOf());
}

export function toInt(customValue: any): CustomNumber {
	return new CustomNumber(toNumber(customValue).value | 0);
}

export function getHashCode(value: number, offset: number = 0): number {
	if (value === 0.0) return 0;
	return (((offset << 5) - offset) + value) | 0;
}

export function getStringHashCode(value: string): number {
	let hash = 0;

	if (value.length === 0) {
		return hash;
	}

	for (let i = 0; i < value.length; i++) {
		const chr = value.charCodeAt(i);
		hash = getHashCode(chr, hash);
	}

	return hash;
}

export function compareMaps(map1: CustomMap, map2: CustomMap): boolean {
	if (map1.value.size !== map2.value.size) {
		return false;
	}

	for (const [key, itemA] of map1.value) {
		if (!map2.value.has(key)) {
			return false;
		}

		const itemB = map2.value.get(key);
		
		if (!compare(itemA, itemB)) {
			return false;
		}
	}

	return true;
}

export function compareList(list1: CustomList, list2: CustomList): boolean {
	if (list1.value.length !== list2.value.length) {
		return false;
	}

	for (let index = 0; index < list1.value.length; index++) {
		if (!list2.value.hasOwnProperty(index)) {
			return false;
		}

		const itemA = list1.value[index];
		const itemB = list2.value[index];
		
		if (!compare(itemA, itemB)) {
			return false;
		}
	}

	return true;
}

export function compare(customValueA: any, customValueB: any): boolean {
	if (customValueA instanceof CustomMap && customValueB instanceof CustomMap) {
		return compareMaps(customValueA, customValueB);
	} else if (customValueA instanceof CustomList && customValueB instanceof CustomList) {
		return compareList(customValueA, customValueB);
	}
	return customValueA.toString() === customValueB.toString();
}