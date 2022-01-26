import {
	CustomNumber,
	CustomNil
} from 'greybel-interpreter';

export function abs(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	return Math.abs(customValue.toNumber());
}

export function acos(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	return Math.acos(customValue.toNumber());
}

export function asin(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	return Math.asin(customValue.toNumber());
}

export function atan(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	return Math.atan(customValue.toNumber());
}

export function ceil(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	return Math.ceil(customValue.toNumber());
}

export function cos(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	return Math.cos(customValue.toNumber());
}

export function floor(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	return Math.floor(customValue.toNumber());
}

export function sin(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	return Math.sin(customValue.toNumber());
}

export function sign(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	return Math.sign(customValue.toNumber());
}

export function round(customValue: any, decimalPlaces: any): number {
	if (customValue instanceof CustomNil) return null;
	const decPlaces = Math.max(Math.round(decimalPlaces?.toNumber() || 0) * 10, 1);
	return Math.round((customValue.toNumber() + Number.EPSILON) * decPlaces) / decPlaces;
}

export function sqrt(customValue: any): number {
	if (customValue instanceof CustomNil) return null;
	return Math.sqrt(customValue.toNumber());
}

export function pi(): number {
	return Math.PI;
}

export function bitwise(operator: any, numA: any, numB: any): number {
	const a = numA.toNumber();
	const b = numB?.toNumber();
	const op = operator.toString();

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