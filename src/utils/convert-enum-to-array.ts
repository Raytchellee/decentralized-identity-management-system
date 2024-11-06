export function convertEnumToArray<T>(enumValue: Record<string, T>): T[] {
  const values: T[] = [];

  for (const key in enumValue) {
    if (Object.prototype.hasOwnProperty.call(enumValue, key)) {
      values.push(enumValue[key]);
    }
  }

  return values;
}
