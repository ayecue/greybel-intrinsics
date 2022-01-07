import * as generics from './generics';
import * as math from './math';
import rnd from './rnd';
import * as manipulation from './manipulation';
import {
	Interpreter,
	CustomString,
	CustomList,
	CustomMap
} from 'greybel-interpreter';

export function getAPI(): Map<string, Function> {
	const apiInterface = new Map();

	apiInterface.set('print', generics.print);
	apiInterface.set('wait', generics.wait);
	apiInterface.set('char', generics.char);
	apiInterface.set('code', generics.code);
	apiInterface.set('str', generics.str);
	apiInterface.set('val', generics.val);
	apiInterface.set('hash', generics.hash);
	apiInterface.set('range', generics.range);

	apiInterface.set('abs', math.abs);
	apiInterface.set('acos', math.acos);
	apiInterface.set('asin', math.asin);
	apiInterface.set('atan', math.atan);
	apiInterface.set('ceil', math.ceil);
	apiInterface.set('cos', math.cos);
	apiInterface.set('floor', math.floor);
	apiInterface.set('sin', math.sin);
	apiInterface.set('sign', math.sign);
	apiInterface.set('round', math.round);
	apiInterface.set('sqrt', math.sqrt);
	apiInterface.set('pi', math.pi);
	apiInterface.set('bitwise', math.bitwise);

	apiInterface.set('rnd', rnd);

	apiInterface.set('hasIndex', manipulation.hasIndex);
	apiInterface.set('indexOf', manipulation.indexOf);
	apiInterface.set('indexes', manipulation.indexes);
	apiInterface.set('values', manipulation.values);
	apiInterface.set('len', manipulation.len);
	apiInterface.set('lower', manipulation.lower);
	apiInterface.set('upper', manipulation.upper);
	apiInterface.set('slice', manipulation.slice);
	apiInterface.set('sort', manipulation.sort);
	apiInterface.set('sum', manipulation.sum);
	apiInterface.set('shuffle', manipulation.shuffle);
	apiInterface.set('pop', manipulation.pop);
	apiInterface.set('pull', manipulation.pull);
	apiInterface.set('push', manipulation.push);
	apiInterface.set('remove', manipulation.remove);

	return apiInterface;
}

export function init(customAPI: Map<string, Function> = new Map()) {
	const apiInterface = getAPI();
	const api: Map<string, Function> = new Map([
		...Array.from(apiInterface.entries()),
		...Array.from(customAPI.entries())
	]);

	//setup list
	CustomList.intrinsics.set('hasIndex', apiInterface.get('hasIndex'));
	CustomList.intrinsics.set('indexes', apiInterface.get('indexes'));
	CustomList.intrinsics.set('indexOf', apiInterface.get('indexOf'));
	CustomList.intrinsics.set('len', apiInterface.get('len'));
	CustomList.intrinsics.set('pop', apiInterface.get('pop'));
	CustomList.intrinsics.set('pull', apiInterface.get('pull'));
	CustomList.intrinsics.set('push', apiInterface.get('push'));
	CustomList.intrinsics.set('shuffle', apiInterface.get('shuffle'));
	CustomList.intrinsics.set('sort', apiInterface.get('sort'));
	CustomList.intrinsics.set('sum', apiInterface.get('sum'));
	CustomList.intrinsics.set('remove', apiInterface.get('remove'));
	CustomList.intrinsics.set('values', apiInterface.get('values'));
	CustomList.intrinsics.set('reverse', manipulation.reverse);
	CustomList.intrinsics.set('join', manipulation.join);

	//setup map
	CustomMap.intrinsics.set('hasIndex', apiInterface.get('hasIndex'));
	CustomMap.intrinsics.set('indexes', apiInterface.get('indexes'));
	CustomMap.intrinsics.set('indexOf', apiInterface.get('indexOf'));
	CustomMap.intrinsics.set('len', apiInterface.get('len'));
	CustomMap.intrinsics.set('pop', apiInterface.get('pop'));
	CustomMap.intrinsics.set('push', apiInterface.get('push'));
	CustomMap.intrinsics.set('shuffle', apiInterface.get('shuffle'));
	CustomMap.intrinsics.set('sum', apiInterface.get('sum'));
	CustomMap.intrinsics.set('remove', apiInterface.get('remove'));
	CustomMap.intrinsics.set('values', apiInterface.get('values'));

	//setup string
	CustomString.intrinsics.set('hasIndex', apiInterface.get('hasIndex'));
	CustomString.intrinsics.set('indexes', apiInterface.get('indexes'));
	CustomString.intrinsics.set('indexOf', apiInterface.get('indexOf'));
	CustomString.intrinsics.set('code', apiInterface.get('code'));
	CustomString.intrinsics.set('len', apiInterface.get('len'));
	CustomString.intrinsics.set('lower', apiInterface.get('lower'));
	CustomString.intrinsics.set('val', apiInterface.get('val'));
	CustomString.intrinsics.set('remove', apiInterface.get('remove'));
	CustomString.intrinsics.set('upper', apiInterface.get('upper'));
	CustomString.intrinsics.set('values', apiInterface.get('values'));
	CustomString.intrinsics.set('split', manipulation.split);
	CustomString.intrinsics.set('replace', manipulation.replace);
	CustomString.intrinsics.set('trim', manipulation.trim);
	CustomString.intrinsics.set('lastIndexOf', manipulation.lastIndexOf);
	CustomString.intrinsics.set('to_int', manipulation.to_int);

	return api;
}