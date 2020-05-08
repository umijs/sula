import assignWith from 'lodash/assignWith';
import isUndefined from 'lodash/isUndefined';
import isArray from 'lodash/isArray';

function withDefined(dest: any, src: any) {
  return isUndefined(src) ? dest : src;
}

export function assignWithDefined(...args: Record<string, any>[]) {
  return assignWith(...args, withDefined);
}

export function toArray<T>(value?: T | T[] | null): T[] {
  if (value === undefined || value === null) {
    return [];
  }

  // @ts-ignore
  return isArray(value) ? value : [value];
}


