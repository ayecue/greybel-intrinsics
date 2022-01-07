import {
	toInt,
	toNumber,
	compare
} from './utils';
import {
	CustomBoolean,
	CustomNumber,
	CustomString,
	CustomNil,
	CustomMap,
	CustomList
} from 'greybel-interpreter';

export function hasIndex(customValue: any, index: any): boolean {
	if (customValue instanceof CustomMap) {
		const key = index.value.toString();
		return customValue.value.has(key);
	} else if (customValue instanceof CustomList) {
		if (!(index instanceof CustomNumber)) {
			return false;
		}
		const listIndex = customValue.toIndex(toInt(index).value.toString());
		return customValue.value.hasOwnProperty(listIndex);
	} else if (customValue instanceof CustomString) {
		const strIndex = customValue.toIndex(toInt(index).value.toString());
		return !!customValue.value[strIndex];
	}

	return false;
}

export function indexOf(customValue: any, value: any, after: any): number | string {
	if (value instanceof CustomNil) {
		throw new Error('indexOf requires a value argument');
	}

	if (customValue instanceof CustomMap) {
		for (let [key, item] of customValue.value) {
			if (compare(item, value)) {
				return key;
			}
		}
	} else if (customValue instanceof CustomList) {
		for (let index = toInt(after).value; index < customValue.value.length; index++) {
			if (compare(customValue.value[index], value)) {
				return index;
			}
		}
	} else if (customValue instanceof CustomString) {
		const strIndex = customValue.value.indexOf(value.value.toString());
		if (strIndex !== -1) {
			return strIndex;
		}
	}

	return null;
}

export function indexes(customValue: any): any[] {
	if (customValue instanceof CustomMap) {
		return Array.from(customValue.value.keys());
	} else if (customValue instanceof CustomList || customValue instanceof CustomString) {
		return Object.keys(customValue.value);
	}

	return null;
}

export function values(customValue: any): any[] {
	if (customValue instanceof CustomMap) {
		return Array.from(customValue.value.values());
	} else if (customValue instanceof CustomList || customValue instanceof CustomString) {
		return Object.values(customValue.value);
	}

	return null;
}

export function len(customValue: any): number {
	if (customValue instanceof CustomMap) {
		return customValue.value.size;
	} else if (customValue instanceof CustomList || customValue instanceof CustomString) {
		return customValue.value.length;
	}
	return null;
}

export function lower(customValue: any): string {
	if (customValue instanceof CustomString) {
		return customValue.value.toLowerCase();
	}
	return customValue;
}

export function upper(customValue: any): string {
	if (customValue instanceof CustomString) {
		return customValue.value.toUpperCase();
	}
	return customValue;
}

export function slice(customValue: any, from: any, to: any): any {
	if (from instanceof CustomNil) {
		return null;
	}

	const start = toInt(from);
	let end = toInt(to);

	if (customValue instanceof CustomList || customValue instanceof CustomString) {
		if (end.value === 0) {
			end = new CustomNumber(customValue.value.length);
		}

		return customValue.slice(start, end);
	}

	return null;
}

export function sort(customValue: any, key: any): any[] {
	if (!(customValue instanceof CustomList)) {
		return null;
	}

	const orderBy = key ? key.toString() : null;

	return customValue.value.sort((a: any, b: any) => {
		let aVal = a.valueOf();
		let bVal = b.valueOf();

		if (orderBy) {
			throw new Error("order key is not yet supported");
		}

		if (typeof aVal === 'string' && typeof bVal === 'string') {
			return aVal.localeCompare(bVal);
		}

		return aVal - bVal;
	});

	return null;
}

export function sum(customValue: any): number {
	let result = 0;

	if (customValue instanceof CustomList || customValue instanceof CustomMap) {
		customValue.value.forEach((v) => {
			const temp = toNumber(v).value;
			result += Number.isNaN(temp) ? 0 : temp;
		});
	}

	return result;
}

export function shuffle(customValue: any) {
	const value = customValue.value;

	if (customValue instanceof CustomList) {
		for (let i = value.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[value[i], value[j]] = [value[j], value[i]];
		}
	} else if (customValue instanceof CustomMap) {
		const keys = Array.from(value.keys());

		for (let i = keys.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const a: any = value.get(keys[j]);
			const b: any = value.get(keys[i]);
			value.set(keys[i], b);
			value.set(keys[j], a);
		}
	}
}

export function pop(customValue: any): any {
	if (customValue instanceof CustomMap) {
		const keys = Array.from(customValue.value.keys());
		const item = customValue.value.get(keys[0]);
		customValue.value.delete(keys[0]);
		return item;
	} else if (customValue instanceof CustomList) {
		return customValue.value.pop();
	}

	return null;
}

export function pull(customValue: any): any {
	if (customValue instanceof CustomMap) {
		const keys = Array.from(customValue.value.keys());
		const item = customValue.value.get(keys[0]);
		customValue.value.delete(keys[0]);
		return item;
	} else if (customValue instanceof CustomList) {
		return customValue.value.shift();
	}

	return null;
}

export function push(customValue: any, value: any): any {
	if (customValue instanceof CustomMap) {
		if (value instanceof CustomNil) {
			throw new Error('Key map cannot be null.');
		}

		const key = value.value.toString();

		if (customValue.value.has(key)) {
			throw new Error(`Key map has already been added: ${key}`);
		}

		customValue.value.set(key, new CustomNumber(1));
		return customValue;
	} else if (customValue instanceof CustomList) {
		customValue.value.push(value);
		return customValue;
	}

	return null;
}

export function remove(customValue: any, keyValue: any): any {
	const key = keyValue.value.toString();

	if (customValue instanceof CustomMap) {
		if (customValue.value.has(key)) {
			customValue.value.delete(key);
			return true;
		}
		return false;
	} else if (customValue instanceof CustomList) {
		const listIndex = customValue.toIndex(toInt(keyValue).value.toString());
		if (customValue.value.hasOwnProperty(listIndex)) {
			customValue.value.splice(listIndex, 1);
		}
		return null;
	} else if (customValue instanceof CustomString) {
		return customValue.value.replace(key, '');
	}
}

export function reverse(customValue: CustomList): void {
	customValue.value = customValue.value.reverse();
}

export function join(customValue: CustomList, seperator: any): string {
	return customValue.value.join(seperator.value.toString());
}

export function split(customValue: CustomString, delimiter: any): string[] {
	return customValue.value.split(delimiter.value.toString());
}

export function replace(customValue: CustomString, toReplace: any, replaceWith: any): string {
	return customValue.value.replace(toReplace.value.toString(), replaceWith.value.toString());
}

export function trim(customValue: CustomString): string {
	return customValue.value.trim();
}

export function lastIndexOf(customValue: CustomString, value: any): number {
	return customValue.value.lastIndexOf(value.value.toString());
}

export function to_int(customValue: CustomString): any {
	const result = Number(customValue.value);
	return Number.isNaN(result) ? customValue : result;
}