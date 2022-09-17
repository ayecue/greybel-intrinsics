import {
  CustomBoolean,
  CustomFunction,
  CustomList,
  CustomMap,
  CustomNil,
  CustomNumber,
  CustomString,
  CustomValue,
  Defaults,
  OperationContext
} from 'greybel-interpreter';

import { getHashCode, getStringHashCode, isValidUnicodeChar } from './utils';

export const print = CustomFunction.createExternal(
  'print',
  (
    ctx: OperationContext,
    self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    console.log(args.get('value').toString());
    return Promise.resolve(Defaults.Void);
  }
).addArgument('value', new CustomString('')).addArgument('replaceText', Defaults.False);

export const wait = CustomFunction.createExternal(
  'wait',
  (
    ctx: OperationContext,
    self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const delay = args.get('delay');

    if (delay instanceof CustomNil) {
      throw new Error('wait: Invalid arguments');
    }

    const seconds = delay.toNumber();
    
    if (seconds < 0.01 || seconds > 300) {
      throw new Error('wait: time must have a value between 0.01 and 300');
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Defaults.Void);
      }, seconds);
    });
  }
).addArgument('delay', new CustomNumber(1.));

export const char = CustomFunction.createExternal(
  'char',
  (
    ctx: OperationContext,
    self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const code = args.get('code');

    if (code instanceof CustomNil) {
      return Promise.resolve(Defaults.Void);
    }

    if (!isValidUnicodeChar(code.toInt())) {
      throw new Error('char: invalid char code.');
    }

    const str = String.fromCharCode(code.toInt());
    return Promise.resolve(new CustomString(str));
  }
).addArgument('code', new CustomNumber(65.));

export const code = CustomFunction.createExternal(
  'code',
  (
    ctx: OperationContext,
    self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');

    if (value instanceof CustomNil) {
      throw new Error('code: invalid char code.');
    }

    const str = value.toString();
    const strCode = str.charCodeAt(0);

    if (!isValidUnicodeChar(strCode)) {
      throw new Error('code: invalid char code.');
    }

    return Promise.resolve(new CustomNumber(strCode));
  }
)
  .addArgument('value')
  .setInjectSelf(true);

export const str = CustomFunction.createExternal(
  'str',
  (
    ctx: OperationContext,
    self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    return Promise.resolve(new CustomString(args.get('value').toString()));
  }
).addArgument('value', new CustomString(''));

export const val = CustomFunction.createExternal(
  'val',
  (
    ctx: OperationContext,
    self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNumber) {
      return Promise.resolve(value);
    } else if (value instanceof CustomString) {
      return Promise.resolve(
        value.isNumber() ? new CustomNumber(value.parseFloat()) : Defaults.Zero
      );
    }
    return Promise.resolve(Defaults.Void);
  }
)
  .addArgument('value', Defaults.Zero)
  .setInjectSelf(true);

const hashEx = (value: CustomValue, recursionDepth: number): number => {
  let result: number;
  if (value instanceof CustomList) {
    result = getHashCode(value.value.length);
    if (recursionDepth < 1) return result;
    value.value.forEach((value: CustomValue) => {
      result ^= hashEx(value, recursionDepth - 1);
    });
    return result;
  } else if (value instanceof CustomMap) {
    result = getHashCode(value.value.size);
    if (recursionDepth < 0) return result;
    value.value.forEach((value: CustomValue, key: CustomValue) => {
      result ^= hashEx(key, recursionDepth - 1);
      result ^= hashEx(value, recursionDepth - 1);
    });
    return result;
  } else if (value instanceof CustomString) {
    return getStringHashCode(value.toString());
  } else if (value instanceof CustomBoolean) {
    return getHashCode(value.toNumber());
  } else if (value instanceof CustomNumber) {
    return getHashCode(value.toNumber());
  }

  return 0;
};

export const hash = CustomFunction.createExternal(
  'hash',
  (
    ctx: OperationContext,
    self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    const recursionDepth = args.get('recursionDepth').toInt();

    return Promise.resolve(new CustomNumber(hashEx(value, recursionDepth)));
  }
)
  .addArgument('value')
  .addArgument('recursionDepth', new CustomNumber(16));

export const range = CustomFunction.createExternal(
  'range',
  (
    ctx: OperationContext,
    self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    let from = args.get('from');
    let to = args.get('to');
    const step = args.get('step');

    if (!(to instanceof CustomNumber)) {
      throw new Error('range() "to" parameter not a number');
    }

    const start = from.toNumber();
    const end = to.toNumber();
    const inc = step?.toInt() || (end >= start ? 1 : -1);

    if (inc === 0) {
      throw new Error('range() error (step==0)');
    }

    const check =
      inc > 0
        ? (i: number) => i <= end
        : (i: number) => i >= end;
    const result: Array<CustomValue> = [];

    for (let index = start; check(index); index += inc) {
      result.push(new CustomNumber(index));
    }

    return Promise.resolve(new CustomList(result));
  }
)
  .addArgument('from', Defaults.Zero)
  .addArgument('to', Defaults.Zero)
  .addArgument('step');
