export const isNil = <T = any>(
  value: T | null | undefined
): value is null | undefined => {
  return value === null || value === undefined;
};

export const isNotNil = <T = any>(value: T | null | undefined): value is T => {
  return !isNil(value);
};
