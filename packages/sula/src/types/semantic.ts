export const tuple = (...args: string[]) => args;

const normalSizes = tuple('small', 'default', 'large');

const normalTypes = tuple(
  'default',
  'success',
  'warning',
  'error',
  'danger', // alias of error
);

export type NormalSizes = typeof normalSizes[number];
export type NormalTypes = typeof normalTypes[number];
