import { isValidElement } from 'react';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import isBoolean from 'lodash/isBoolean';
import isRegExp from 'lodash/isRegExp';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import assign from 'lodash/assign';
import moment from 'moment';
import template from './template';
import { assignWithDefined } from './common';

export type SkipOptions = {
  skipFuncObjKeys?: string[]; // 通过该对象下的方法转换，例如渲染插件的props
  skipKeys?: string[]; // 完全跳过，一般用在插件扩展点例如，action、convertParams、converter上
  skipSelector?: (key: string, parentKey: string) => boolean; // field插件的props.value要跳过，否则引用就变了
};

export type TransObj = Record<string, any>;

export type TransParams = TransObj | null;

export const defaultSkipOptions: SkipOptions = {
  skipFuncObjKeys: [],
  skipKeys: [],
  skipSelector: () => false,
};

export type InnerSkipOptions = SkipOptions & { __skipFunc?: boolean; parentKey?: string | number };

export default function transformConfig(
  obj: TransObj | string | number | boolean | React.ReactElement,
  params: TransParams,
  skipOptions?: SkipOptions,
) {
  if (!params) {
    return obj;
  }

  const ctx = isFunction(params) ? params() : params;

  return innerTransformConfig(obj, ctx, assignWithDefined({}, defaultSkipOptions, skipOptions), '');
}

function innerTransformConfig(
  obj: TransObj | string | number | boolean | React.ReactElement,
  ctx: TransObj,
  skipOptions?: InnerSkipOptions,
  parentKey: string | number,
) {
  const { skipFuncObjKeys, skipKeys, skipSelector, __skipFunc } = skipOptions as InnerSkipOptions;

  if (
    obj === '' ||
    obj === undefined ||
    obj === null ||
    isNumber(obj) ||
    isBoolean(obj) ||
    isRegExp(obj) ||
    isValidElement(obj) ||
    obj instanceof FormData ||
    moment.isMoment(obj)
  ) {
    return obj;
  }

  if (isFunction(obj)) {
    if (__skipFunc) {
      return obj;
    }

    return obj(ctx);
  }

  // 如果ctx为空不再转换
  if (!ctx) return obj;

  if (isString(obj)) return template(obj, ctx);

  if (isArray(obj)) {
    return obj.reduce((memo, item) => {
      memo.push(transformConfig(item, ctx, skipOptions));
      return memo;
    }, []);
  }

  if (isObject(obj)) {
    return Object.keys(obj).reduce((memo, key) => {
      let isSkip;
      let isSkipFuncObj;

      // 只针对第一层
      if (!parentKey) {
        isSkip = skipKeys.indexOf(key) > -1;

        isSkip = isSkip || (skipSelector && skipSelector(key, parentKey) === true);

        isSkipFuncObj = skipFuncObjKeys.indexOf(key) > -1;
      }

      if (isSkip) {
        memo[key] = obj[key];
      } else if (isSkipFuncObj) {
        memo[key] = transformConfig(
          obj[key],
          ctx,
          assign({}, skipOptions, { __skipFunc: true }),
          key,
        );
      } else {
        memo[key] = transformConfig(obj[key], ctx, skipOptions, key);
      }

      return memo;
    }, {});
  }

  return obj;
}
