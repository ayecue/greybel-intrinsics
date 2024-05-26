import {
  CustomBoolean,
  CustomFunction,
  CustomList,
  CustomMap,
  CustomNil,
  CustomNumber,
  CustomString,
  CustomValue,
  deepEqual,
  DefaultType,
  VM
} from 'greybel-interpreter';
import XRegExp, { ExecArray } from 'xregexp';

import { at, checkRange } from './utils';

export const hasIndex = CustomFunction.createExternalWithSelf(
  'hasIndex',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const index = args.get('index');

    if (index instanceof CustomNil) {
      throw new Error('hasIndex requires an index argument');
    }

    if (origin instanceof CustomMap) {
      return Promise.resolve(new CustomBoolean(origin.value.has(index)));
    } else if (origin instanceof CustomList) {
      if (!(index instanceof CustomNumber)) {
        return Promise.resolve(DefaultType.False);
      }
      const listIndex = index.toInt();
      return Promise.resolve(new CustomBoolean(!!at(origin.value, listIndex)));
    } else if (origin instanceof CustomString) {
      const strIndex = index.toInt();
      return Promise.resolve(new CustomBoolean(!!at(origin.value, strIndex)));
    }

    return Promise.resolve(DefaultType.False);
  }
).addArgument('index');

export const indexOf = CustomFunction.createExternalWithSelf(
  'indexOf',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const value = args.get('value');
    const after = args.get('after');

    if (value instanceof CustomNil) {
      throw new Error('indexOf requires a value argument');
    }

    if (origin instanceof CustomMap) {
      let sawAfter: boolean = after instanceof CustomNil;
      for (const [key, item] of origin.value.entries()) {
        if (!sawAfter) {
          if (deepEqual(after, key)) sawAfter = true;
        } else if (deepEqual(value, item)) {
          return Promise.resolve(key);
        }
      }
    } else if (origin instanceof CustomList) {
      if (after instanceof CustomNil) {
        const index = origin.value.findIndex((item) => {
          return deepEqual(value, item);
        });

        if (index !== -1) {
          return Promise.resolve(new CustomNumber(index));
        }
      } else {
        let afterIdx = after.toInt();
        if (afterIdx < -1) afterIdx += origin.value.length;
        if (afterIdx < -1 || afterIdx >= origin.value.length - 1)
          return Promise.resolve(DefaultType.Void);
        const index = origin.value.findIndex((item, idx) => {
          return idx > afterIdx && deepEqual(value, item);
        });

        if (index !== -1) {
          return Promise.resolve(new CustomNumber(index));
        }
      }
    } else if (origin instanceof CustomString) {
      if (after instanceof CustomNil) {
        const index = origin.value.indexOf(value.toString());

        if (index !== -1) {
          return Promise.resolve(new CustomNumber(index));
        }
      } else {
        let afterIdx = after.toInt();
        if (afterIdx < -1) afterIdx += origin.value.length;
        if (afterIdx < -1 || afterIdx >= origin.value.length - 1)
          return Promise.resolve(DefaultType.Void);
        const index = origin.value.indexOf(value.toString(), afterIdx + 1);

        if (index !== -1) {
          return Promise.resolve(new CustomNumber(index));
        }
      }
    }

    return Promise.resolve(DefaultType.Void);
  }
)
  .addArgument('value')
  .addArgument('after');

export const indexes = CustomFunction.createExternalWithSelf(
  'indexes',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomMap) {
      const keys = Array.from(origin.value.keys());
      return Promise.resolve(new CustomList(keys));
    } else if (origin instanceof CustomList || origin instanceof CustomString) {
      const keys = Object.keys(origin.value).map(
        (item) => new CustomNumber(Number(item))
      );
      return Promise.resolve(new CustomList(keys));
    }

    return Promise.resolve(DefaultType.Void);
  }
);

export const values = CustomFunction.createExternalWithSelf(
  'values',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomMap) {
      const values = Array.from(origin.value.values());
      return Promise.resolve(new CustomList(values));
    } else if (origin instanceof CustomList) {
      const values = Object.values(origin.value);
      return Promise.resolve(new CustomList(values));
    } else if (origin instanceof CustomString) {
      const values = Object.values(origin.value).map(
        (item) => new CustomString(item)
      );
      return Promise.resolve(new CustomList(values));
    }

    return Promise.resolve(DefaultType.Void);
  }
);

export const len = CustomFunction.createExternalWithSelf(
  'len',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomMap) {
      return Promise.resolve(new CustomNumber(origin.value.size));
    } else if (origin instanceof CustomList || origin instanceof CustomString) {
      return Promise.resolve(new CustomNumber(origin.value.length));
    }

    return Promise.resolve(DefaultType.Void);
  }
);

export const lower = CustomFunction.createExternalWithSelf(
  'lower',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomString) {
      return Promise.resolve(new CustomString(origin.value.toLowerCase()));
    }
    return Promise.resolve(origin);
  }
);

export const upper = CustomFunction.createExternalWithSelf(
  'upper',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomString) {
      return Promise.resolve(new CustomString(origin.value.toUpperCase()));
    }
    return Promise.resolve(origin);
  }
);

export const slice = CustomFunction.createExternalWithSelf(
  'slice',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const from = args.get('from');
    const to = args.get('to');

    if (from instanceof CustomNil) {
      return Promise.resolve(DefaultType.Void);
    }

    if (origin instanceof CustomList || origin instanceof CustomString) {
      return Promise.resolve(origin.slice(from, to));
    }

    return Promise.resolve(DefaultType.Void);
  }
)
  .addArgument('from', DefaultType.Zero)
  .addArgument('to');

export const insert = CustomFunction.createExternalWithSelf(
  'insert',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const index = args.get('index');
    const value = args.get('value');

    if (index instanceof CustomNil) {
      throw new Error('insert: index argument required');
    }

    if (!(index instanceof CustomNumber)) {
      throw new Error('insert: number required for index argument');
    }

    let idx = index.toInt();

    if (origin instanceof CustomList) {
      if (idx < 0) idx += origin.value.length + 1;
      checkRange(idx, 0, origin.value.length);
      origin.value.splice(idx, 0, value);
      return Promise.resolve(origin);
    } else if (origin instanceof CustomString) {
      if (idx < 0) idx += origin.value.length + 1;
      checkRange(idx, 0, origin.value.length);
      const str =
        origin.value.substr(0, idx) +
        value.toString() +
        origin.value.substr(idx);
      return Promise.resolve(new CustomString(str));
    }

    throw new Error('insert called on invalid type');
  }
)
  .addArgument('index')
  .addArgument('value');

type CompareFn = (a: CustomValue, b: CustomValue) => number;

const ascendingSort: CompareFn = (a, b) => {
  if (a instanceof CustomString || b instanceof CustomString) {
    return a.toString().localeCompare(b.toString());
  }

  const left = a?.toNumber() ?? Infinity;
  const right = b?.toNumber() ?? Infinity;

  return left - right;
};

const descendingSort: CompareFn = (a, b) => {
  if (a instanceof CustomString && b instanceof CustomString) {
    return b.toString().localeCompare(a.toString());
  }

  const left = a?.toNumber() ?? Infinity;
  const right = b?.toNumber() ?? Infinity;

  return right - left;
};

export const sort = CustomFunction.createExternalWithSelf(
  'sort',
  (
    vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (!(origin instanceof CustomList) || origin.value.length < 2) {
      return Promise.resolve(origin);
    }

    const key = args.get('key');
    const asc = args.get('asc');

    const sortCallback: CompareFn = asc.toTruthy()
      ? ascendingSort
      : descendingSort;

    if (key instanceof CustomNil) {
      origin.value.sort(sortCallback);
    } else {
      const count = origin.value.length;
      const items: { value: CustomValue; sortKey: CustomValue }[] =
        origin.value.map((value) => ({ value, sortKey: null }));
      const byKeyInt = key.toInt();

      for (let i = 0; i < count; i++) {
        const item = origin.value[i];
        if (item instanceof CustomMap) {
          items[i].sortKey = item.get(key, vm.contextTypeIntrinsics);
        } else if (item instanceof CustomList) {
          items[i].sortKey =
            byKeyInt > -item.value.length && byKeyInt < item.value.length
              ? item.value[byKeyInt]
              : null;
        }
      }

      const sortedItems = items.sort((a, b) =>
        sortCallback(a.sortKey, b.sortKey)
      );

      for (let i = 0; i < count; i++) {
        origin.value[i] = sortedItems[i].value;
      }
    }

    return Promise.resolve(origin);
  }
)
  .addArgument('key')
  .addArgument('asc', new CustomNumber(1));

export const sum = CustomFunction.createExternalWithSelf(
  'sum',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    let result = 0;

    if (origin instanceof CustomList || origin instanceof CustomMap) {
      origin.value.forEach((v) => {
        result += v instanceof CustomNil ? 0 : v.toNumber();
      });
    }

    return Promise.resolve(new CustomNumber(result));
  }
);

export const shuffle = CustomFunction.createExternalWithSelf(
  'shuffle',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomList) {
      const value = origin.value;

      if (value.length > 10000) {
        throw new Error('shuffle: list too large');
      }

      for (let i = value.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [value[i], value[j]] = [value[j], value[i]];
      }
    } else if (origin instanceof CustomMap) {
      const value = origin.value;

      if (value.size > 10000) {
        throw new Error('shuffle: map too large');
      }

      const keys = Array.from(value.keys());

      for (let i = keys.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
      }

      const values = Array.from(value.values());

      for (let i = values.length - 1; i >= 0; i--) {
        origin.set(keys[i], values[i]);
      }
    }

    return Promise.resolve(DefaultType.Void);
  }
);

export const pop = CustomFunction.createExternalWithSelf(
  'pop',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomMap) {
      const keys = Array.from(origin.value.keys());
      origin.value.delete(keys[keys.length - 1]);
      return Promise.resolve(keys[keys.length - 1] || DefaultType.Void);
    } else if (origin instanceof CustomList) {
      return Promise.resolve(origin.value.pop() || DefaultType.Void);
    }

    return Promise.resolve(DefaultType.Void);
  }
);

export const pull = CustomFunction.createExternalWithSelf(
  'pull',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomMap) {
      const keys = Array.from(origin.value.keys());
      origin.value.delete(keys[0]);
      return Promise.resolve(keys[0] || DefaultType.Void);
    } else if (origin instanceof CustomList) {
      return Promise.resolve(origin.value.shift() || DefaultType.Void);
    }

    return Promise.resolve(DefaultType.Void);
  }
);

export const push = CustomFunction.createExternalWithSelf(
  'push',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const value = args.get('value');

    if (origin instanceof CustomMap) {
      if (origin.value === value.value) {
        throw new Error('(push) Unable to stack to itself');
      }

      if (value instanceof CustomNil) {
        throw new Error('Key map cannot be null.');
      }

      if (origin.has(value)) {
        throw new Error(`Key map has already been added: ${value.toString()}`);
      }

      origin.set(value, new CustomNumber(1));
      return Promise.resolve(origin);
    } else if (origin instanceof CustomList) {
      if (origin.value === value.value) {
        throw new Error('(push) Unable to stack to itself');
      }

      origin.value.push(value);
      return Promise.resolve(origin);
    }

    return Promise.resolve(DefaultType.Void);
  }
).addArgument('value');

export const remove = CustomFunction.createExternalWithSelf(
  'remove',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const keyValue = args.get('keyValue');

    if (origin instanceof CustomNil) {
      throw new Error("argument to 'remove' must not be null");
    }

    if (origin instanceof CustomMap) {
      if (origin.has(keyValue)) {
        origin.value.delete(keyValue);
        return Promise.resolve(DefaultType.True);
      }
      return Promise.resolve(DefaultType.False);
    } else if (origin instanceof CustomList) {
      let idx = keyValue.toInt();
      if (idx < 0) idx += origin.value.length;
      checkRange(idx, 0, origin.value.length - 1);
      origin.value.splice(idx, 1);
      return Promise.resolve(DefaultType.Void);
    } else if (origin instanceof CustomString) {
      const substr = keyValue.toString();
      const foundPos = origin.value.indexOf(substr);
      if (foundPos < 0) return Promise.resolve(origin);
      const newStr =
        origin.value.substring(0, foundPos) +
        origin.value.substring(foundPos + substr.length);
      return Promise.resolve(new CustomString(newStr));
    }

    throw new Error("Type Error: 'remove' requires map, list, or string");
  }
).addArgument('keyValue');

export const reverse = CustomFunction.createExternalWithSelf(
  'reverse',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomList) {
      origin.value.reverse();
    }

    return Promise.resolve(DefaultType.Void);
  }
);

export const join = CustomFunction.createExternalWithSelf(
  'join',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomList) {
      const seperator = args.get('seperator').toString();

      if (seperator.length > 128) {
        throw new Error('join: delimiter too large');
      }

      const str = origin.value.join(seperator);
      return Promise.resolve(new CustomString(str));
    }

    return Promise.resolve(DefaultType.Void);
  }
).addArgument('seperator', new CustomString(' '));

export const split = CustomFunction.createExternalWithSelf(
  'split',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const pattern = args.get('pattern');
    const regexOptions = args.get('regexOptions');

    if (
      origin instanceof CustomString &&
      pattern instanceof CustomString &&
      regexOptions instanceof CustomString
    ) {
      if (pattern.value === '') {
        throw new Error('split: Invalid arguments');
      }

      if (!['none', 'i', 'm', 's', 'n', 'x'].includes(regexOptions.value)) {
        throw new Error('split: Invalid regex option');
      }

      let options = regexOptions.value;

      if (options === 'none') {
        options = undefined;
      }

      const list = origin.value
        .split(XRegExp(pattern.value, options))
        .map((item) => new CustomString(item));
      return Promise.resolve(new CustomList(list));
    }

    return Promise.resolve(DefaultType.Void);
  }
)
  .addArgument('pattern')
  .addArgument('regexOptions', new CustomString('none'));

export const replaceRegex = CustomFunction.createExternalWithSelf(
  'replace_regex',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const pattern = args.get('pattern');
    const newVal = args.get('newVal');
    const regexOptions = args.get('regexOptions');

    if (
      origin instanceof CustomString &&
      pattern instanceof CustomString &&
      newVal instanceof CustomString &&
      regexOptions instanceof CustomString
    ) {
      if (pattern.value === '') {
        throw new Error("Type Error: 'replace' pattern can't be empty or null");
      }

      if (!['none', 'i', 'm', 's', 'n', 'x'].includes(regexOptions.value)) {
        throw new Error('replace: Invalid regex option');
      }

      if (origin.value === '') {
        return Promise.resolve(origin);
      }

      let options = regexOptions.value;

      if (options === 'none') {
        options = undefined;
      }

      const replaced = XRegExp.replace(
        origin.value,
        XRegExp(pattern.value, options),
        newVal.value,
        'all'
      );
      return Promise.resolve(new CustomString(replaced));
    }

    throw new Error("Type Error: 'replace' requires string");
  }
)
  .addArgument('pattern')
  .addArgument('newVal')
  .addArgument('regexOptions', new CustomString('none'));

export const isMatch = CustomFunction.createExternalWithSelf(
  'is_match',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const pattern = args.get('pattern');
    const regexOptions = args.get('regexOptions');

    if (
      origin instanceof CustomString &&
      pattern instanceof CustomString &&
      regexOptions instanceof CustomString
    ) {
      if (pattern.value === '') {
        throw new Error(
          "Type Error: 'is_match' pattern can't be empty or null"
        );
      }

      if (!['none', 'i', 'm', 's', 'n', 'x'].includes(regexOptions.value)) {
        throw new Error('is_match: Invalid regex option');
      }

      let options = regexOptions.value;

      if (options === 'none') {
        options = undefined;
      }

      const isMatch = XRegExp.test(
        origin.value,
        XRegExp(pattern.value, options)
      );
      return Promise.resolve(new CustomBoolean(isMatch));
    }

    throw new Error("Type Error: 'is_match' requires string");
  }
)
  .addArgument('pattern')
  .addArgument('regexOptions', new CustomString('none'));

export const matches = CustomFunction.createExternalWithSelf(
  'matches',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const pattern = args.get('pattern');
    const regexOptions = args.get('regexOptions');

    if (
      origin instanceof CustomString &&
      pattern instanceof CustomString &&
      regexOptions instanceof CustomString
    ) {
      if (pattern.value === '') {
        throw new Error("Type Error: 'matches' pattern can't be empty or null");
      }

      if (!['none', 'i', 'm', 's', 'n', 'x'].includes(regexOptions.value)) {
        throw new Error('matches: Invalid regex option');
      }

      let options = regexOptions.value;

      if (options === 'none') {
        options = '';
      }

      let match: ExecArray;
      const xreg = XRegExp(pattern.value, options + 'g');
      const result = new CustomMap();

      while ((match = xreg.exec(origin.value))) {
        result.set(new CustomNumber(match.index), new CustomString(match[0]));
      }

      return Promise.resolve(result);
    }

    throw new Error("Type Error: 'is_match' requires string");
  }
)
  .addArgument('pattern')
  .addArgument('regexOptions', new CustomString('none'));

export const replace = CustomFunction.createExternalWithSelf(
  'replace',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const maxCount = args.get('maxCount');
    let actualMaxCount = -1;

    if (!(maxCount instanceof CustomNil)) {
      actualMaxCount = maxCount.toInt();
      if (actualMaxCount < 1) {
        return Promise.resolve(origin);
      }
    }

    if (origin instanceof CustomString) {
      throw new Error(
        `invalid replace invocation: replace must be called from the string itself, for example: ${origin.toString()}.replace`
      );
    } else if (origin instanceof CustomList) {
      const toReplace = args.get('toReplace');
      const replaceWith = args.get('replaceWith');

      if (toReplace instanceof CustomNil || replaceWith instanceof CustomNil) {
        throw new Error('replace: Invalid arguments');
      }

      for (let index = 0; index < origin.value.length; index++) {
        if (deepEqual(toReplace, origin.value[index])) {
          origin.value[index] = replaceWith;
        }

        if (actualMaxCount > 0 && actualMaxCount === index) {
          break;
        }
      }

      return Promise.resolve(origin);
    } else if (origin instanceof CustomMap) {
      const toReplace = args.get('toReplace');
      const replaceWith = args.get('replaceWith');

      if (toReplace instanceof CustomNil || replaceWith instanceof CustomNil) {
        throw new Error('replace: Invalid arguments');
      }

      let index = 0;

      for (const [key, item] of origin.value.entries()) {
        if (deepEqual(toReplace, item)) {
          origin.value.set(key, replaceWith);
        }

        if (actualMaxCount > 0 && actualMaxCount === index) {
          break;
        }

        index++;
      }

      return Promise.resolve(origin);
    }

    throw new Error("Type Error: 'replace' requires map, list, or string");
  }
)
  .addArgument('toReplace')
  .addArgument('replaceWith')
  .addArgument('maxCount');

export const trim = CustomFunction.createExternalWithSelf(
  'trim',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const trimmed = origin.toString().trim();

    return Promise.resolve(new CustomString(trimmed));
  }
);

export const lastIndexOf = CustomFunction.createExternalWithSelf(
  'lastIndexOf',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const value = args.get('value');

    if (value instanceof CustomNil) {
      return Promise.resolve(DefaultType.Void);
    }

    if (origin instanceof CustomString) {
      const strIndex = origin.value.lastIndexOf(value.toString());
      return Promise.resolve(new CustomNumber(strIndex));
    }

    return Promise.resolve(DefaultType.Void);
  }
).addArgument('value');

export const toInt = CustomFunction.createExternalWithSelf(
  'to_int',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    if (origin instanceof CustomString) {
      if (origin.isNumber()) {
        const value = origin.parseFloat();
        return Promise.resolve(value % 1 === 0 ? new CustomNumber(origin.parseInt()) : origin);
      }
      return Promise.resolve(origin);
    }
    return Promise.resolve(DefaultType.Void);
  }
);
