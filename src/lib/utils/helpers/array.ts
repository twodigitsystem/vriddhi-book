export const chunk = <T>(array: T[], size: number): T[][] => {
  return array.reduce((acc, _, i) => {
    if (i % size === 0) {
      acc.push(array.slice(i, i + size));
    }
    return acc;
  }, [] as T[][]);
};

export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  return [...new Map(array.map((item) => [item[key], item])).values()];
};

export const flatten = <T>(array: T[][]): T[] => {
  return array.reduce((acc, val) => acc.concat(val), []);
};

export const removeDuplicates = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

export const isArrayEqual = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
};

export const arrayToObject = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T> => {
  return array.reduce(
    (obj, item) => {
      obj[item[key]] = item;
      return obj;
    },
    {} as Record<string, T>
  );
};

export const objectToArray = <T extends Record<string, any>>(
  obj: Record<string, T>
): T[] => {
  return Object.values(obj);
};
