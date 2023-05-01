import {
  CustomFunction,
  CustomList,
  CustomMap,
  CustomString,
  ObjectValue
} from 'greybel-interpreter';

import * as generics from './generics';
import * as manipulation from './manipulation';
import * as math from './math';
import rnd from './rnd';

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

  apiInterface.set(s('rnd'), rnd);

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
  apiInterface.set(s('to_int'), manipulation.to_int);
  apiInterface.set(s('join'), manipulation.join);
  apiInterface.set(s('split'), manipulation.split);
  apiInterface.set(s('replace'), manipulation.replace);

  return apiInterface;
}

export function init(customAPI: ObjectValue = new ObjectValue()) {
  const apiInterface = getAPI();
  const api = new ObjectValue(apiInterface);

  api.extend(customAPI);

  // setup list
  CustomList.addIntrinsic(
    s('hasIndex'),
    apiInterface.get(s('hasIndex')) as CustomFunction
  );
  CustomList.addIntrinsic(
    s('indexes'),
    apiInterface.get(s('indexes')) as CustomFunction
  );
  CustomList.addIntrinsic(
    s('indexOf'),
    apiInterface.get(s('indexOf')) as CustomFunction
  );
  CustomList.addIntrinsic(
    s('len'),
    apiInterface.get(s('len')) as CustomFunction
  );
  CustomList.addIntrinsic(
    s('pop'),
    apiInterface.get(s('pop')) as CustomFunction
  );
  CustomList.addIntrinsic(
    s('pull'),
    apiInterface.get(s('pull')) as CustomFunction
  );
  CustomList.addIntrinsic(
    s('push'),
    apiInterface.get(s('push')) as CustomFunction
  );
  CustomList.addIntrinsic(
    s('shuffle'),
    apiInterface.get(s('shuffle')) as CustomFunction
  );
  CustomList.addIntrinsic(
    s('sort'),
    apiInterface.get(s('sort')) as CustomFunction
  );
  CustomList.addIntrinsic(
    s('sum'),
    apiInterface.get(s('sum')) as CustomFunction
  );
  CustomList.addIntrinsic(
    s('remove'),
    apiInterface.get(s('remove')) as CustomFunction
  );
  CustomList.addIntrinsic(
    s('values'),
    apiInterface.get(s('values')) as CustomFunction
  );
  CustomList.addIntrinsic(
    s('insert'),
    apiInterface.get(s('insert')) as CustomFunction
  );
  CustomList.addIntrinsic(s('reverse'), manipulation.reverse);
  CustomList.addIntrinsic(s('join'), manipulation.join);

  // setup map
  CustomMap.addIntrinsic(
    s('hasIndex'),
    apiInterface.get(s('hasIndex')) as CustomFunction
  );
  CustomMap.addIntrinsic(
    s('indexes'),
    apiInterface.get(s('indexes')) as CustomFunction
  );
  CustomMap.addIntrinsic(
    s('indexOf'),
    apiInterface.get(s('indexOf')) as CustomFunction
  );
  CustomMap.addIntrinsic(
    s('len'),
    apiInterface.get(s('len')) as CustomFunction
  );
  CustomMap.addIntrinsic(
    s('pop'),
    apiInterface.get(s('pop')) as CustomFunction
  );
  CustomMap.addIntrinsic(
    s('push'),
    apiInterface.get(s('push')) as CustomFunction
  );
  CustomMap.addIntrinsic(
    s('shuffle'),
    apiInterface.get(s('shuffle')) as CustomFunction
  );
  CustomMap.addIntrinsic(
    s('sum'),
    apiInterface.get(s('sum')) as CustomFunction
  );
  CustomMap.addIntrinsic(
    s('remove'),
    apiInterface.get(s('remove')) as CustomFunction
  );
  CustomMap.addIntrinsic(
    s('values'),
    apiInterface.get(s('values')) as CustomFunction
  );

  // setup string
  CustomString.addIntrinsic(
    s('hasIndex'),
    apiInterface.get(s('hasIndex')) as CustomFunction
  );
  CustomString.addIntrinsic(
    s('indexOf'),
    apiInterface.get(s('indexOf')) as CustomFunction
  );
  CustomString.addIntrinsic(
    s('indexes'),
    apiInterface.get(s('indexes')) as CustomFunction
  );
  CustomString.addIntrinsic(
    s('code'),
    apiInterface.get(s('code')) as CustomFunction
  );
  CustomString.addIntrinsic(
    s('len'),
    apiInterface.get(s('len')) as CustomFunction
  );
  CustomString.addIntrinsic(
    s('lower'),
    apiInterface.get(s('lower')) as CustomFunction
  );
  CustomString.addIntrinsic(
    s('val'),
    apiInterface.get(s('val')) as CustomFunction
  );
  CustomString.addIntrinsic(
    s('remove'),
    apiInterface.get(s('remove')) as CustomFunction
  );
  CustomString.addIntrinsic(
    s('upper'),
    apiInterface.get(s('upper')) as CustomFunction
  );
  CustomString.addIntrinsic(
    s('values'),
    apiInterface.get(s('values')) as CustomFunction
  );
  CustomString.addIntrinsic(
    s('insert'),
    apiInterface.get(s('insert')) as CustomFunction
  );
  CustomString.addIntrinsic(s('split'), manipulation.split);
  CustomString.addIntrinsic(s('replace'), manipulation.replace);
  CustomString.addIntrinsic(s('trim'), manipulation.trim);
  CustomString.addIntrinsic(s('lastIndexOf'), manipulation.lastIndexOf);
  CustomString.addIntrinsic(s('to_int'), manipulation.to_int);

  return api;
}
