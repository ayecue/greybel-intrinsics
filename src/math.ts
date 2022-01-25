import {
	toInt,
	toNumber
} from './utils';
import {
	CustomNumber,
	CustomNil
} from 'greybel-interpreter';

export function abs(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	const number = toNumber(customValue);
	return Math.abs(number.valueOf());
}

export function acos(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	const number = toNumber(customValue);
	return Math.acos(number.valueOf());
}

export function asin(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	const number = toNumber(customValue);
	return Math.asin(number.valueOf());
}

export function atan(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	const number = toNumber(customValue);
	return Math.atan(number.valueOf());
}

export function ceil(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	const number = toNumber(customValue);
	return Math.ceil(number.valueOf());
}

export function cos(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	const number = toNumber(customValue);
	return Math.cos(number.valueOf());
}

export function floor(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	const number = toNumber(customValue);
	return Math.floor(number.valueOf());
}

export function sin(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	const number = toNumber(customValue);
	return Math.sin(number.valueOf());
}

export function sign(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	const number = toNumber(customValue);
	return Math.sign(number.valueOf());
}

export function round(customValue: any, decimalPlaces: any): number {
	if (customValue instanceof CustomNil) return null;
	const number = toNumber(customValue);
	const decPlaces = Math.max(toInt(decimalPlaces).value * 10, 1);
	return Math.round((number.valueOf() + Number.EPSILON) * decPlaces) / decPlaces;
}

export function sqrt(customValue: any, decimalPlaces: any): number {
	if (customValue instanceof CustomNil) return null;
	const number = toNumber(customValue);
	return Math.sqrt(number.valueOf());
}

export function pi(): number {
	return Math.PI;
}

export function bitwise(operator: any, numA: any, numB: any): number {
	const a = toNumber(numA).value;
	const b = toNumber(numB).value;
	const op = operator.value.toString();

	switch (op) {
		case '&':
			return a & b;
		case '|':
			return a | b;
		case '^':
			return a ^ b;
		case '<<':
			return a << b;
		case '>>':
			return a >> b;
		case '>>>':
			return a >>> b;
		case '~':
			return ~a;
		default:
	}

	return null;
}