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

import { compare, itemAtIndex } from './utils';

export const hasIndex = CustomFunction.createExternalWithSelf(
  'hasIndex',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const index = args.get('index');

    if (origin instanceof CustomMap) {
      const key = index.toString();
      return Promise.resolve(new CustomBoolean(origin.value.has(key)));
    } else if (origin instanceof CustomList) {
      if (!(index instanceof CustomNumber)) {
        return Promise.resolve(Defaults.False);
      }
      const listIndex = index.toInt();
      return Promise.resolve(
        new CustomBoolean(
          Object.prototype.hasOwnProperty.call(origin.value, listIndex)
        )
      );
    } else if (origin instanceof CustomString) {
      const strIndex = index.toInt();
      return Promise.resolve(new CustomBoolean(!!origin.value[strIndex]));
    }

    return Promise.resolve(Defaults.False);
  }
).addArgument('index');

export const indexOf = CustomFunction.createExternalWithSelf(
  'indexOf',
  (
    _ctx: OperationContext,
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
      for (const [key, item] of origin.value) {
        if (compare(item, value)) {
          return Promise.resolve(new CustomString(key));
        }
      }
    } else if (origin instanceof CustomList) {
      for (let index = after.toInt(); index < origin.value.length; index++) {
        if (compare(origin.value[index], value)) {
          return Promise.resolve(new CustomNumber(index));
        }
      }
    } else if (origin instanceof CustomString) {
      const strIndex = origin.value.indexOf(value.toString(), after.toInt());
      if (strIndex !== -1) {
        return Promise.resolve(new CustomNumber(strIndex));
      }
    }

    return Promise.resolve(Defaults.Void);
  }
)
  .addArgument('value')
  .addArgument('after', new CustomNumber(0));

export const indexes = CustomFunction.createExternalWithSelf(
  'indexes',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomMap) {
      const keys = Array.from(origin.value.keys()).map(
        (item) => new CustomString(item)
      );
      return Promise.resolve(new CustomList(keys));
    } else if (origin instanceof CustomList || origin instanceof CustomString) {
      const keys = Object.keys(origin.value).map(
        (item) => new CustomNumber(Number(item))
      );
      return Promise.resolve(new CustomList(keys));
    }

    return Promise.resolve(Defaults.Void);
  }
);

export const values = CustomFunction.createExternalWithSelf(
  'values',
  (
    _ctx: OperationContext,
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

    return Promise.resolve(Defaults.Void);
  }
);

export const len = CustomFunction.createExternalWithSelf(
  'len',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomMap) {
      return Promise.resolve(new CustomNumber(origin.value.size));
    } else if (origin instanceof CustomList || origin instanceof CustomString) {
      return Promise.resolve(new CustomNumber(origin.value.length));
    }

    return Promise.resolve(Defaults.Void);
  }
);

export const lower = CustomFunction.createExternalWithSelf(
  'lower',
  (
    _ctx: OperationContext,
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
    _ctx: OperationContext,
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
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const from = args.get('from');
    const to = args.get('to');

    if (from instanceof CustomNil) {
      return Promise.resolve(Defaults.Void);
    }

    if (origin instanceof CustomList || origin instanceof CustomString) {
      return Promise.resolve(origin.slice(from, to));
    }

    return Promise.resolve(Defaults.Void);
  }
)
  .addArgument('from')
  .addArgument('to');

export const sort = CustomFunction.createExternalWithSelf(
  'sort',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const key = args.get('key');

    if (!(origin instanceof CustomList)) {
      return null;
    }

    const orderBy = key instanceof CustomNil ? null : key.toString();
    const sorted = origin.value.sort((a: CustomValue, b: CustomValue) => {
      if (orderBy) {
        throw new Error('order key is not yet supported');
      }

      if (a instanceof CustomString && b instanceof CustomString) {
        return a.toString().localeCompare(b.toString());
      }

      return a.toNumber() - b.toNumber();
    });

    return Promise.resolve(new CustomList(sorted));
  }
).addArgument('key');

export const sum = CustomFunction.createExternalWithSelf(
  'sum',
  (
    _ctx: OperationContext,
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
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomList) {
      const value = origin.value;
      for (let i = value.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [value[i], value[j]] = [value[j], value[i]];
      }
    } else if (origin instanceof CustomMap) {
      const value = origin.value;
      const keys = Array.from(value.keys());

      for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const a: any = value.get(keys[j]);
        const b: any = value.get(keys[i]);
        value.set(keys[i], b);
        value.set(keys[j], a);
      }
    }

    return Promise.resolve(Defaults.Void);
  }
);

export const pop = CustomFunction.createExternalWithSelf(
  'pop',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomMap) {
      const keys = Array.from(origin.value.keys());
      const lastIndex = keys.length - 1;
      const item = origin.value.get(keys[lastIndex]);
      origin.value.delete(keys[lastIndex]);
      return Promise.resolve(item);
    } else if (origin instanceof CustomList) {
      return Promise.resolve(origin.value.pop());
    }

    return Promise.resolve(Defaults.Void);
  }
);

export const pull = CustomFunction.createExternalWithSelf(
  'pull',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomMap) {
      const keys = Array.from(origin.value.keys());
      const item = origin.value.get(keys[0]);
      origin.value.delete(keys[0]);
      return Promise.resolve(item);
    } else if (origin instanceof CustomList) {
      return Promise.resolve(origin.value.shift());
    }

    return Promise.resolve(Defaults.Void);
  }
);

export const push = CustomFunction.createExternalWithSelf(
  'push',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const value = args.get('value');

    if (origin instanceof CustomMap) {
      if (value instanceof CustomNil) {
        throw new Error('Key map cannot be null.');
      }

      const key = value.toString();

      if (origin.value.has(key)) {
        throw new Error(`Key map has already been added: ${key}`);
      }

      origin.value.set(key, new CustomNumber(1));
      return Promise.resolve(origin);
    } else if (origin instanceof CustomList) {
      origin.value.push(value);
      return Promise.resolve(origin);
    }

    return Promise.resolve(Defaults.Void);
  }
).addArgument('value');

export const remove = CustomFunction.createExternalWithSelf(
  'remove',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const keyValue = args.get('keyValue');
    const key = keyValue.toString();

    if (origin instanceof CustomMap) {
      if (origin.value.has(key)) {
        origin.value.delete(key);
        return Promise.resolve(Defaults.True);
      }
      return Promise.resolve(Defaults.False);
    } else if (origin instanceof CustomList) {
      const listIndex = itemAtIndex(origin.value, keyValue.toInt());
      if (Object.prototype.hasOwnProperty.call(origin.value, listIndex)) {
        origin.value.splice(listIndex, 1);
      }
      return Promise.resolve(Defaults.Void);
    } else if (origin instanceof CustomString) {
      const replaced = new CustomString(origin.value.replace(key, ''));
      return Promise.resolve(replaced);
    }

    return Promise.resolve(Defaults.Void);
  }
).addArgument('keyValue');

export const reverse = CustomFunction.createExternalWithSelf(
  'reverse',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomList) {
      origin.value.reverse();
    }

    return Promise.resolve(Defaults.Void);
  }
);

export const join = CustomFunction.createExternalWithSelf(
  'join',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomList) {
      const str = origin.value.join(args.get('seperator').toString());
      return Promise.resolve(new CustomString(str));
    }

    return Promise.resolve(Defaults.Void);
  }
).addArgument('seperator', new CustomString(','));

export const split = CustomFunction.createExternalWithSelf(
  'split',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');

    if (origin instanceof CustomString) {
      const list = origin.value
        .split(args.get('delimiter').toString())
        .map((item) => new CustomString(item));
      return Promise.resolve(new CustomList(list));
    }

    return Promise.resolve(Defaults.Void);
  }
).addArgument('delimiter', new CustomString(','));

export const replace = CustomFunction.createExternalWithSelf(
  'replace',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const toReplace = args.get('toReplace').toString();
    const replaceWith = args.get('replaceWith').toString();
    const replaced = origin.toString().replace(toReplace, replaceWith);

    return Promise.resolve(new CustomString(replaced));
  }
)
  .addArgument('toReplace')
  .addArgument('replaceWith');

export const trim = CustomFunction.createExternalWithSelf(
  'trim',
  (
    _ctx: OperationContext,
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
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    const value = args.get('value');
    const before = args.get('before');

    if (value instanceof CustomNil) {
      throw new Error('lastIndexOf requires a value argument');
    }

    if (origin instanceof CustomMap) {
      const reversedMap = Array.from(origin.value.entries()).reverse();
      for (const [key, item] of reversedMap) {
        if (compare(item, value)) {
          return Promise.resolve(new CustomString(key));
        }
      }
    } else if (origin instanceof CustomList) {
      for (
        let index =
          before instanceof CustomNil
            ? origin.value.length - 1
            : before.toInt();
        index >= 0;
        index--
      ) {
        if (compare(origin.value[index], value)) {
          return Promise.resolve(new CustomNumber(index));
        }
      }
    } else if (origin instanceof CustomString) {
      const strIndex = origin.value.lastIndexOf(
        value.toString(),
        before.toInt()
      );
      if (strIndex !== -1) {
        return Promise.resolve(new CustomNumber(strIndex));
      }
    }

    return Promise.resolve(Defaults.Void);
  }
)
  .addArgument('value')
  .addArgument('before');

export const to_int = CustomFunction.createExternalWithSelf(
  'to_int',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const origin = args.get('self');
    if (origin instanceof CustomString) {
      return Promise.resolve(
        origin.isNumber() ? new CustomNumber(origin.parseInt()) : origin
      );
    }
    return Promise.resolve(Defaults.Void);
  }
);
