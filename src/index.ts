import {
  CustomList,
  CustomMap,
  CustomString,
  ObjectValue
} from 'greybel-interpreter';

import * as generics from './generics';
import * as manipulation from './manipulation';
import * as math from './math';
import rndFunctionFactory from './rnd';

const s = (v: string) => new CustomString(v);

export function getAPI(): ObjectValue {
  const apiInterface = new ObjectValue();

  apiInterface.set(s('print'), generics.print);
  apiInterface.set(s('exit'), generics.exit);
  apiInterface.set(s('wait'), generics.wait);
  apiInterface.set(s('char'), generics.char);
  apiInterface.set(s('code'), generics.code);
  apiInterface.set(s('str'), generics.str);
  apiInterface.set(s('val'), generics.val);
  apiInterface.set(s('hash'), generics.hash);
  apiInterface.set(s('range'), generics.range);
  apiInterface.set(s('yield'), generics.customYield);
  apiInterface.set(s('time'), generics.time);

  apiInterface.set(s('abs'), math.abs);
  apiInterface.set(s('acos'), math.acos);
  apiInterface.set(s('asin'), math.asin);
  apiInterface.set(s('atan'), math.atan);
  apiInterface.set(s('tan'), math.tan);
  apiInterface.set(s('ceil'), math.ceil);
  apiInterface.set(s('cos'), math.cos);
  apiInterface.set(s('floor'), math.floor);
  apiInterface.set(s('sin'), math.sin);
  apiInterface.set(s('sign'), math.sign);
  apiInterface.set(s('round'), math.round);
  apiInterface.set(s('sqrt'), math.sqrt);
  apiInterface.set(s('pi'), math.pi);
  apiInterface.set(s('bitwise'), math.bitwise);
  apiInterface.set(s('bitAnd'), math.bitAnd);
  apiInterface.set(s('bitOr'), math.bitOr);
  apiInterface.set(s('bitXor'), math.bitXor);
  apiInterface.set(s('log'), math.log);

  apiInterface.set(s('rnd'), rndFunctionFactory());

  apiInterface.set(s('hasIndex'), manipulation.hasIndex);
  apiInterface.set(s('indexOf'), manipulation.indexOf);
  apiInterface.set(s('indexes'), manipulation.indexes);
  apiInterface.set(s('values'), manipulation.values);
  apiInterface.set(s('len'), manipulation.len);
  apiInterface.set(s('lower'), manipulation.lower);
  apiInterface.set(s('upper'), manipulation.upper);
  apiInterface.set(s('slice'), manipulation.slice);
  apiInterface.set(s('sort'), manipulation.sort);
  apiInterface.set(s('sum'), manipulation.sum);
  apiInterface.set(s('shuffle'), manipulation.shuffle);
  apiInterface.set(s('pop'), manipulation.pop);
  apiInterface.set(s('pull'), manipulation.pull);
  apiInterface.set(s('push'), manipulation.push);
  apiInterface.set(s('remove'), manipulation.remove);
  apiInterface.set(s('insert'), manipulation.insert);
  apiInterface.set(s('to_int'), manipulation.toInt);
  apiInterface.set(s('join'), manipulation.join);
  apiInterface.set(s('split'), manipulation.split);
  apiInterface.set(s('replace_regex'), manipulation.replaceRegex);
  apiInterface.set(s('is_match'), manipulation.isMatch);
  apiInterface.set(s('matches'), manipulation.matches);
  apiInterface.set(s('trim'), manipulation.trim);
  apiInterface.set(s('lastIndexOf'), manipulation.lastIndexOf);
  apiInterface.set(s('replace'), manipulation.replace);
  apiInterface.set(s('reverse'), manipulation.reverse);

  return apiInterface;
}

export function init(customAPI: ObjectValue = new ObjectValue()) {
  const apiInterface = getAPI();
  const api = new ObjectValue(apiInterface);

  api.extend(customAPI);

  // setup list
  CustomList.addIntrinsic(s('hasIndex'), manipulation.hasIndex);
  CustomList.addIntrinsic(s('indexes'), manipulation.indexes);
  CustomList.addIntrinsic(s('indexOf'), manipulation.indexOf);
  CustomList.addIntrinsic(s('len'), manipulation.len);
  CustomList.addIntrinsic(s('pop'), manipulation.pop);
  CustomList.addIntrinsic(s('pull'), manipulation.pull);
  CustomList.addIntrinsic(s('push'), manipulation.push);
  CustomList.addIntrinsic(s('shuffle'), manipulation.shuffle);
  CustomList.addIntrinsic(s('sort'), manipulation.sort);
  CustomList.addIntrinsic(s('sum'), manipulation.sum);
  CustomList.addIntrinsic(s('remove'), manipulation.remove);
  CustomList.addIntrinsic(s('values'), manipulation.values);
  CustomList.addIntrinsic(s('insert'), manipulation.insert);
  CustomList.addIntrinsic(s('reverse'), manipulation.reverse);
  CustomList.addIntrinsic(s('join'), manipulation.join);
  CustomList.addIntrinsic(s('replace'), manipulation.replace);

  // setup map
  CustomMap.addIntrinsic(s('hasIndex'), manipulation.hasIndex);
  CustomMap.addIntrinsic(s('indexes'), manipulation.indexes);
  CustomMap.addIntrinsic(s('indexOf'), manipulation.indexOf);
  CustomMap.addIntrinsic(s('len'), manipulation.len);
  CustomMap.addIntrinsic(s('pull'), manipulation.pull);
  CustomMap.addIntrinsic(s('pop'), manipulation.pop);
  CustomMap.addIntrinsic(s('push'), manipulation.push);
  CustomMap.addIntrinsic(s('shuffle'), manipulation.shuffle);
  CustomMap.addIntrinsic(s('sum'), manipulation.sum);
  CustomMap.addIntrinsic(s('remove'), manipulation.remove);
  CustomMap.addIntrinsic(s('values'), manipulation.values);
  CustomMap.addIntrinsic(s('replace'), manipulation.replace);

  // setup string
  CustomString.addIntrinsic(s('hasIndex'), manipulation.hasIndex);
  CustomString.addIntrinsic(s('indexOf'), manipulation.indexOf);
  CustomString.addIntrinsic(s('indexes'), manipulation.indexes);
  CustomString.addIntrinsic(s('code'), generics.code);
  CustomString.addIntrinsic(s('len'), manipulation.len);
  CustomString.addIntrinsic(s('lower'), manipulation.lower);
  CustomString.addIntrinsic(s('val'), generics.val);
  CustomString.addIntrinsic(s('remove'), manipulation.remove);
  CustomString.addIntrinsic(s('upper'), manipulation.upper);
  CustomString.addIntrinsic(s('values'), manipulation.values);
  CustomString.addIntrinsic(s('insert'), manipulation.insert);
  CustomString.addIntrinsic(s('split'), manipulation.split);
  CustomString.addIntrinsic(s('replace'), manipulation.replaceRegex);
  CustomString.addIntrinsic(s('trim'), manipulation.trim);
  CustomString.addIntrinsic(s('lastIndexOf'), manipulation.lastIndexOf);
  CustomString.addIntrinsic(s('to_int'), manipulation.toInt);
  CustomString.addIntrinsic(s('is_match'), manipulation.isMatch);
  CustomString.addIntrinsic(s('matches'), manipulation.matches);

  return api;
}
