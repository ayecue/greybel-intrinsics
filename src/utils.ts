import { CustomValue } from 'greybel-interpreter';

export function itemAtIndex(
  list: Array<CustomValue> | string,
  n: number
): number {
  n = Math.trunc(n) || 0;
  if (n < 0) n += list.length;
  return n;
}

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
