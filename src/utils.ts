export function getHashCode(value: number, offset: number = 0): number {
  if (value === 0.0) return 0;
  return ((offset << 5) - offset + value) | 0;
}

export function getStringHashCode(value: string): number {
  let hash = 0;

  if (value.length === 0) {
    return hash;
  }

  for (let i = 0; i < value.length; i++) {
    const chr = value.charCodeAt(i);
    hash = getHashCode(chr, hash);
  }

  return hash;
}

export function isValidUnicodeChar(value: number): boolean {
  if (value <= 1114111 && (value < 55296 || value > 57343)) {
    return value < 65536;
  }
  return false;
}

export function checkRange(
  i: number,
  min: number,
  max: number,
  desc: string = 'index'
) {
  if (i < min || i > max) {
    throw new Error(
      `Index Error: ${desc} (${i}) out of range (${min} to ${max})`
    );
  }
}

export function at<T>(arr: T[] | string, index: number): T | string {
  const k = index >= 0 ? index : arr.length + index;

  if (k < 0 || k >= arr.length) {
    return undefined;
  }

  return arr[k];
}

export function bitwiseAnd(a: number, b: number): number {
  return Number(BigInt(a) & BigInt(b | 0));
}

export function bitwiseOr(a: number, b: number): number {
  return Number(BigInt(a) | BigInt(b | 0));
}

export function bitwiseXor(a: number, b: number): number {
  return Number(BigInt(a) ^ BigInt(b | 0));
}

export function bitwiseLShift(a: number, b: number): number {
  return Number(BigInt(a) << BigInt((b | 0) % 64));
}

export function bitwiseRShift(a: number, b: number): number {
  return Number(BigInt(a) >> BigInt((b | 0) % 64));
}

export function bitwiseUnsignedRShift(a: number, b: number): number {
  return a >>> (b | 0) % 64;
}

export function bitwiseNot(a: number): number {
  return ~a;
}
