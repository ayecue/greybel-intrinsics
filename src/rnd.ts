import {
  CustomFunction,
  CustomNil,
  CustomNumber,
  CustomValue,
  VM
} from 'greybel-interpreter';

type RndFn = () => number;

// https://stackoverflow.com/a/47593316
const xmur3 = function (str: string): RndFn {
  const length = str.length;
  let i = 0;
  let h = 1779033703 ^ length;

  for (; i < length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  return function (): number {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
};

const mulberry32 = function (a: number): RndFn {
  return function (): number {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export default function rndFunctionFactory(): CustomFunction {
  let rndFn: RndFn = () => Math.random();
  const rndFnFactory = (seed: string): void => {
    rndFn = mulberry32(xmur3(seed)());
  };

  return CustomFunction.createExternal(
    'rnd',
    (
      _vm: VM,
      _self: CustomValue,
      args: Map<string, CustomValue>
    ): Promise<CustomValue> => {
      const seedId = args.get('seedId');

      if (!(seedId instanceof CustomNil)) {
        const seedStr = seedId.toString();
        rndFnFactory(seedStr);
      }

      return Promise.resolve(new CustomNumber(rndFn()));
    }
  ).addArgument('seedId');
}
