import {
	toInt,
	toNumber,
	getStringHashCode,
	getHashCode
} from './utils';
import {
	CustomBoolean,
	CustomNumber,
	CustomString,
	CustomNil,
	CustomMap,
	CustomList
} from 'greybel-interpreter';

export function print(customValue: any): void {
	console.log(customValue.toString());
}

export function wait(delay: any): Promise<void> {
	const seconds = toNumber(delay).value || 1;

	return new Promise((resolve) => {
		setTimeout(resolve, seconds);
	});
}

export function char(customValue: any): string {
	if (customValue instanceof CustomNil) return null;
	const code = toInt(customValue).value;
	if (code === 0) return null;
	return String.fromCharCode(code);
}

export function code(customValue: any): number {
	if (customValue instanceof CustomNil) {
		throw new Error('code: invalid char code.')
	}
	const str = customValue.value.toString();
	return str.charCodeAt(0);
}

export function str(customValue: any): string {
	if (customValue instanceof CustomString) {
		return customValue.value.toString();
	}
	return customValue.toString();
}

export function val(customValue: any): any {
	if (customValue instanceof CustomNumber) {
		return customValue.value;
	} else if (customValue instanceof CustomString) {
		const result = toNumber(customValue).value;
		return Number.isNaN(result) ? customValue : result;
	}
	return null;
}

export function hash(customValue: any, recursionDepth: number = 16): number {
	let result: number;
	if (customValue instanceof CustomList) {
		result = getHashCode(customValue.value.length);
		if (recursionDepth < 1) return result;
		customValue.value.forEach((value: any) => {
			result ^= hash(value, recursionDepth - 1);
		});
		return result;
	} else if (customValue instanceof CustomMap) {
		result = getHashCode(customValue.value.size);
		if (recursionDepth < 0) return result;
		customValue.value.forEach((value: any, key: string) => {
			result ^= getStringHashCode(key);
			result ^= hash(value, recursionDepth - 1);
		});
		return result;
	} else if (customValue instanceof CustomString) {
		return getStringHashCode(customValue.value);
	} else if (customValue instanceof CustomBoolean) {
		return getHashCode(toInt(customValue).value);
	} else if (customValue instanceof CustomNumber) {
		return getHashCode(customValue.value);
	}

	return 0;
}

export function range(from: any, to: any, step: any): any[] {
	if (!(to instanceof CustomNumber)) {
		throw new Error('range() "to" parameter not a number');
	}

	const inc = toNumber(step).value || 1;

	if (inc === .0) {
		throw new Error('range() error (step==0)');
	}

	const start = toNumber(from).value;
	const end = to.value;
	const result = [];

	for (let index = start; index < end; index += inc) {
		result.push(index);
	}

	return result;
}
