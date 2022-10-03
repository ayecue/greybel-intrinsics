import {
  CustomFunction,
  CustomList,
  CustomMap,
  CustomString
} from 'greybel-interpreter';

import * as generics from './generics';
import * as manipulation from './manipulation';
import * as math from './math';
import rnd from './rnd';

export function getAPI(): Map<string, CustomFunction> {
  const apiInterface = new Map();

  apiInterface.set('print', generics.print);
  apiInterface.set('exit', generics.exit);
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
  apiInterface.set('tan', math.tan);
  apiInterface.set('ceil', math.ceil);
  apiInterface.set('cos', math.cos);
  apiInterface.set('floor', math.floor);
  apiInterface.set('sin', math.sin);
  apiInterface.set('sign', math.sign);
  apiInterface.set('round', math.round);
  apiInterface.set('sqrt', math.sqrt);
  apiInterface.set('pi', math.pi);
  apiInterface.set('bitwise', math.bitwise);
  apiInterface.set('bitAnd', math.bitAnd);
  apiInterface.set('bitOr', math.bitOr);
  apiInterface.set('bitXor', math.bitXor);

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

export function init(customAPI: Map<string, CustomFunction> = new Map()) {
  const apiInterface = getAPI();
  const api: Map<string, CustomFunction> = new Map([
    ...Array.from(apiInterface.entries()),
    ...Array.from(customAPI.entries())
  ]);

  // setup list
  const listIntrinsics = CustomList.getIntrinsics();

  listIntrinsics.add('hasIndex', apiInterface.get('hasIndex'));
  listIntrinsics.add('indexes', apiInterface.get('indexes'));
  listIntrinsics.add('indexOf', apiInterface.get('indexOf'));
  listIntrinsics.add('len', apiInterface.get('len'));
  listIntrinsics.add('pop', apiInterface.get('pop'));
  listIntrinsics.add('pull', apiInterface.get('pull'));
  listIntrinsics.add('push', apiInterface.get('push'));
  listIntrinsics.add('shuffle', apiInterface.get('shuffle'));
  listIntrinsics.add('sort', apiInterface.get('sort'));
  listIntrinsics.add('sum', apiInterface.get('sum'));
  listIntrinsics.add('remove', apiInterface.get('remove'));
  listIntrinsics.add('values', apiInterface.get('values'));
  listIntrinsics.add('insert', manipulation.insert);
  listIntrinsics.add('reverse', manipulation.reverse);
  listIntrinsics.add('join', manipulation.join);

  // setup map
  const mapIntrinsics = CustomMap.getIntrinsics();

  mapIntrinsics.add('hasIndex', apiInterface.get('hasIndex'));
  mapIntrinsics.add('indexes', apiInterface.get('indexes'));
  mapIntrinsics.add('indexOf', apiInterface.get('indexOf'));
  mapIntrinsics.add('len', apiInterface.get('len'));
  mapIntrinsics.add('pop', apiInterface.get('pop'));
  mapIntrinsics.add('push', apiInterface.get('push'));
  mapIntrinsics.add('shuffle', apiInterface.get('shuffle'));
  mapIntrinsics.add('sum', apiInterface.get('sum'));
  mapIntrinsics.add('remove', apiInterface.get('remove'));
  mapIntrinsics.add('values', apiInterface.get('values'));

  // setup string
  const stringIntrinsics = CustomString.getIntrinsics();

  stringIntrinsics.add('hasIndex', apiInterface.get('hasIndex'));
  stringIntrinsics.add('indexOf', apiInterface.get('indexOf'));
  stringIntrinsics.add('indexes', apiInterface.get('indexes'));
  stringIntrinsics.add('code', apiInterface.get('code'));
  stringIntrinsics.add('len', apiInterface.get('len'));
  stringIntrinsics.add('lower', apiInterface.get('lower'));
  stringIntrinsics.add('val', apiInterface.get('val'));
  stringIntrinsics.add('remove', apiInterface.get('remove'));
  stringIntrinsics.add('upper', apiInterface.get('upper'));
  stringIntrinsics.add('values', apiInterface.get('values'));
  stringIntrinsics.add('insert', manipulation.insert);
  stringIntrinsics.add('split', manipulation.split);
  stringIntrinsics.add('replace', manipulation.replace);
  stringIntrinsics.add('trim', manipulation.trim);
  stringIntrinsics.add('lastIndexOf', manipulation.lastIndexOf);
  stringIntrinsics.add('to_int', manipulation.to_int);

  return api;
}
