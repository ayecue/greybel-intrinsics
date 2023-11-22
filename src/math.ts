import {
  CustomFunction,
  CustomNil,
  CustomNumber,
  CustomValue,
  DefaultType,
  VM
} from 'greybel-interpreter';

export const abs = CustomFunction.createExternal(
  'abs',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(DefaultType.Void);
    return Promise.resolve(new CustomNumber(Math.abs(value.toNumber())));
  }
).addArgument('value', DefaultType.Zero);

export const acos = CustomFunction.createExternal(
  'acos',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(DefaultType.Void);
    return Promise.resolve(new CustomNumber(Math.acos(value.toNumber())));
  }
).addArgument('value', DefaultType.Zero);

export const asin = CustomFunction.createExternal(
  'asin',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(DefaultType.Void);
    return Promise.resolve(new CustomNumber(Math.asin(value.toNumber())));
  }
).addArgument('value', DefaultType.Zero);

export const atan = CustomFunction.createExternal(
  'atan',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(DefaultType.Void);
    return Promise.resolve(new CustomNumber(Math.atan(value.toNumber())));
  }
).addArgument('value', DefaultType.Zero);

export const tan = CustomFunction.createExternal(
  'tan',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(DefaultType.Void);
    return Promise.resolve(new CustomNumber(Math.tan(value.toNumber())));
  }
).addArgument('value', DefaultType.Zero);

export const ceil = CustomFunction.createExternal(
  'ceil',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(DefaultType.Void);
    return Promise.resolve(new CustomNumber(Math.ceil(value.toNumber())));
  }
).addArgument('value', DefaultType.Zero);

export const cos = CustomFunction.createExternal(
  'cos',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(DefaultType.Void);
    return Promise.resolve(new CustomNumber(Math.cos(value.toNumber())));
  }
).addArgument('value', DefaultType.Zero);

export const floor = CustomFunction.createExternal(
  'floor',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(DefaultType.Void);
    return Promise.resolve(new CustomNumber(Math.floor(value.toNumber())));
  }
).addArgument('value', DefaultType.Zero);

export const sin = CustomFunction.createExternal(
  'sin',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(DefaultType.Void);
    return Promise.resolve(new CustomNumber(Math.sin(value.toNumber())));
  }
).addArgument('value', DefaultType.Zero);

export const sign = CustomFunction.createExternal(
  'sign',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(DefaultType.Void);
    return Promise.resolve(new CustomNumber(Math.sign(value.toNumber())));
  }
).addArgument('value', DefaultType.Zero);

export const round = CustomFunction.createExternal(
  'round',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    let value = args.get('value').toNumber();
    let decimalPlaces = args.get('decimalPlaces').toNumber();

    if (decimalPlaces >= 0) {
      if (decimalPlaces > 15) decimalPlaces = 15;
      const pow10 = Math.pow(10, decimalPlaces);
      value = Math.round(value * pow10) / pow10;
    } else {
      const pow10 = Math.pow(10, -decimalPlaces);
      value = Math.round(value / pow10) * pow10;
    }

    return Promise.resolve(new CustomNumber(value));
  }
)
  .addArgument('value', DefaultType.Zero)
  .addArgument('decimalPlaces', DefaultType.Zero);

export const sqrt = CustomFunction.createExternal(
  'sqrt',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(DefaultType.Void);
    return Promise.resolve(new CustomNumber(Math.sqrt(value.toNumber())));
  }
).addArgument('value', DefaultType.Zero);

export const pi = CustomFunction.createExternal(
  'pi',
  (
    _vm: VM,
    _self: CustomValue,
    _args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    return Promise.resolve(new CustomNumber(Math.PI));
  }
);

export const bitwise = CustomFunction.createExternal(
  'bitwise',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const a = args.get('numA').toNumber();
    const b = args.get('numB').toNumber();
    const op = args.get('operator').toString();

    switch (op) {
      case '&':
        return Promise.resolve(new CustomNumber(a & b));
      case '|':
        return Promise.resolve(new CustomNumber(a | b));
      case '^':
        return Promise.resolve(new CustomNumber(a ^ b));
      case '<<':
        return Promise.resolve(new CustomNumber(a << b));
      case '>>':
        return Promise.resolve(new CustomNumber(a >> b));
      case '>>>':
        return Promise.resolve(new CustomNumber(a >>> b));
      case '~':
        return Promise.resolve(new CustomNumber(~a));
      default:
    }

    return Promise.resolve(DefaultType.Void);
  }
)
  .addArgument('operator')
  .addArgument('numA')
  .addArgument('numB');

export const bitAnd = CustomFunction.createExternal(
  'bitAnd',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const a = args.get('numA').toNumber();
    const b = args.get('numB').toNumber();

    return Promise.resolve(new CustomNumber(a & b));
  }
)
  .addArgument('numA')
  .addArgument('numB');

export const bitOr = CustomFunction.createExternal(
  'bitOr',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const a = args.get('numA').toNumber();
    const b = args.get('numB').toNumber();

    return Promise.resolve(new CustomNumber(a | b));
  }
)
  .addArgument('numA')
  .addArgument('numB');

export const bitXor = CustomFunction.createExternal(
  'bitXor',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const a = args.get('numA').toNumber();
    const b = args.get('numB').toNumber();

    return Promise.resolve(new CustomNumber(a ^ b));
  }
)
  .addArgument('numA')
  .addArgument('numB');

export const log = CustomFunction.createExternal(
  'log',
  (
    _vm: VM,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value').toNumber();
    const base = args.get('base').toNumber();

    return Promise.resolve(new CustomNumber(Math.log(value) / Math.log(base)));
  }
)
  .addArgument('value')
  .addArgument('base', new CustomNumber(10));
