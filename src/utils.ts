import { CustomList, CustomMap, CustomValue } from 'greybel-interpreter';

export function itemAtIndex(
  list: Array<CustomValue> | string,
  n: number
): number {
  n = Math.trunc(n) || 0;
  if (n < 0) n += list.length;
  if (n < 0 || n >= list.length) return -1;
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

export function compareMaps(map1: CustomMap, map2: CustomMap): boolean {
  if (map1.value.size !== map2.value.size) {
    return false;
  }

  for (const [key, itemA] of map1.value) {
    if (!map2.value.has(key)) {
      return false;
    }

    const itemB = map2.value.get(key);

    if (!compare(itemA, itemB)) {
      return false;
    }
  }

  return true;
}

export function compareList(list1: CustomList, list2: CustomList): boolean {
  if (list1.value.length !== list2.value.length) {
    return false;
  }

  for (let index = 0; index < list1.value.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(list2.value, index)) {
      return false;
    }

    const itemA = list1.value[index];
    const itemB = list2.value[index];

    if (!compare(itemA, itemB)) {
      return false;
    }
  }

  return true;
}

export function compare(a: CustomValue, b: CustomValue): boolean {
  if (a instanceof CustomMap && b instanceof CustomMap) {
    return compareMaps(a, b);
  } else if (a instanceof CustomList && b instanceof CustomList) {
    return compareList(a, b);
  }
  return a.toString() === b.toString();
}
