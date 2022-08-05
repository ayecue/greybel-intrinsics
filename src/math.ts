import {
  CustomFunction,
  CustomNil,
  CustomNumber,
  CustomValue,
  Defaults,
  OperationContext
} from 'greybel-interpreter';

export const abs = CustomFunction.createExternal(
  'abs',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(Defaults.Void);
    return Promise.resolve(new CustomNumber(Math.abs(value.toNumber())));
  }
).addArgument('value');

export const acos = CustomFunction.createExternal(
  'acos',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(Defaults.Void);
    return Promise.resolve(new CustomNumber(Math.acos(value.toNumber())));
  }
).addArgument('value');

export const asin = CustomFunction.createExternal(
  'asin',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(Defaults.Void);
    return Promise.resolve(new CustomNumber(Math.asin(value.toNumber())));
  }
).addArgument('value');

export const atan = CustomFunction.createExternal(
  'atan',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(Defaults.Void);
    return Promise.resolve(new CustomNumber(Math.atan(value.toNumber())));
  }
).addArgument('value');

export const ceil = CustomFunction.createExternal(
  'ceil',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(Defaults.Void);
    return Promise.resolve(new CustomNumber(Math.ceil(value.toNumber())));
  }
).addArgument('value');

export const cos = CustomFunction.createExternal(
  'cos',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(Defaults.Void);
    return Promise.resolve(new CustomNumber(Math.cos(value.toNumber())));
  }
).addArgument('value');

export const floor = CustomFunction.createExternal(
  'floor',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(Defaults.Void);
    return Promise.resolve(new CustomNumber(Math.floor(value.toNumber())));
  }
).addArgument('value');

export const sin = CustomFunction.createExternal(
  'sin',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(Defaults.Void);
    return Promise.resolve(new CustomNumber(Math.sin(value.toNumber())));
  }
).addArgument('value');

export const sign = CustomFunction.createExternal(
  'sign',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(Defaults.Void);
    return Promise.resolve(new CustomNumber(Math.sign(value.toNumber())));
  }
).addArgument('value');

export const round = CustomFunction.createExternal(
  'round',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(Defaults.Void);
    const decimalPlaces = args.get('decimalPlaces');
    const decPlaces = Math.max(Math.round(decimalPlaces.toNumber()) * 10, 1);
    const result =
      Math.round((value.toNumber() + Number.EPSILON) * decPlaces) / decPlaces;
    return Promise.resolve(new CustomNumber(result));
  }
)
  .addArgument('value')
  .addArgument('decimalPlaces', new CustomNumber(0));

export const sqrt = CustomFunction.createExternal(
  'sqrt',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    const value = args.get('value');
    if (value instanceof CustomNil) return Promise.resolve(Defaults.Void);
    return Promise.resolve(new CustomNumber(Math.sqrt(value.toNumber())));
  }
).addArgument('value');

export const pi = CustomFunction.createExternal(
  'pi',
  (
    _ctx: OperationContext,
    _self: CustomValue,
    _args: Map<string, CustomValue>
  ): Promise<CustomValue> => {
    return Promise.resolve(new CustomNumber(Math.PI));
  }
);

export const bitwise = CustomFunction.createExternal(
  'bitwise',
  (
    _ctx: OperationContext,
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

    return Promise.resolve(Defaults.Void);
  }
)
  .addArgument('operator')
  .addArgument('numA')
  .addArgument('numB');
