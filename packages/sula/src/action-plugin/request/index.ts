import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import assign from 'lodash/assign';
import toLower from 'lodash/toLower';
import isArray from 'lodash/isArray';
import isArrayLikeObject from 'lodash/isArrayLikeObject';
import {
  BizGlobalExtendConfig,
  RequestConfig,
  BizExtendConfig,
  BizResponse,
} from '../../types/request';
import extendConfig from './defaultConfig';
import { toArray } from '../../_util/common';
import { triggerPlugin } from '../../rope/triggerPlugin';

const globalConfig = {} as BizGlobalExtendConfig;
const globalUrl = '@@global';

globalConfig[globalUrl] = extendConfig;

// 不再使用fetch这个名字，防止和fetch冲突
export const request = (config: RequestConfig, ctx?) => {
  const {
    url,
    method = 'GET',
    params,
    convertParams,
    converter,

    successMessage,

    ...restAxiosConfig
  } = config;

  const requestOptions = {
    ...restAxiosConfig,
    url,
    method,
  } as AxiosRequestConfig;

  const conf = globalConfig[globalUrl] || ({} as BizExtendConfig);

  const curConf = assign({}, conf, globalConfig[url]);

  const {
    bizRedirectHandler,
    bizDevErrorAdapter,
    bizErrorMessageAdapter,
    bizSuccessMessageAdapter,
    bizNotifyHandler,
    bizDataAdapter,
  } = curConf;

  let finalParams = params || {};

  if (convertParams) {
    finalParams = toArray(convertParams).reduce((fparams, convertP) => {
      fparams = triggerPlugin(
        'convertParams',
        assign({}, ctx, {
          params: fparams,
        }),
        convertP,
      );
      return fparams;
    }, finalParams);
  }

  const lMethod = toLower(method);

  if (lMethod === 'get' || lMethod === 'delete') {
    requestOptions.params = finalParams;
  } else {
    requestOptions.data = finalParams;
  }

  return axios(requestOptions)
    .then((raw: AxiosResponse) => {
      return raw && raw.data;
    })
    .then((res: BizResponse) => {
      return new Promise((resolve, reject) => {
        // 1. 重定向
        if (bizRedirectHandler) {
          bizRedirectHandler(res);
        }

        // 2. 开发级别信息转换
        const errorDesc = bizDevErrorAdapter ? bizDevErrorAdapter(res) : null;

        // 3. 用户级错误信息转换
        const errorMsg = bizErrorMessageAdapter ? bizErrorMessageAdapter(res) : null;

        // 4. 成功信息转换
        const successMsg = bizSuccessMessageAdapter
          ? bizSuccessMessageAdapter(res, successMessage)
          : null;

        // 5. 消息处理
        if (bizNotifyHandler) {
          bizNotifyHandler({
            errorDesc,
            errorMessage: errorMsg,
            successMessage: successMsg,
          });
        }

        // 生产环境只有 errorMsg 起作用
        if (errorDesc || errorMsg) {
          return reject(errorDesc || errorMsg);
        }

        // 6. 数据转换
        let data = bizDataAdapter ? bizDataAdapter(res) : res;

        if (converter) {
          data = toArray(converter).reduce((fData, converterD) => {
            fData = triggerPlugin(
              'converter',
              assign({}, ctx, {
                data: fData,
                response: res,
              }),
              converterD,
            );
            return fData;
          }, data);
        }

        resolve(data);
      });
    });
};

export const getFormDataParams = (formDataParams, params?) => {
  const formData = new FormData();
  Object.keys(formDataParams).forEach((name) => {
    const value = formDataParams[name];
    if (isArrayLikeObject(value)) {
      for (let i = 0, len = value.length; i < len; i += 1) {
        const v = value[i];
        formData.append(name, v && v.originFileObj ? v.originFileObj : v);
      }
    } else {
      formData.append(name, value && value.originFileObj ? value.originFileObj : value);
    }
  });

  if (params) {
    return mergeFormDataWithParams(formData, params);
  }

  return formData;
};

function mergeFormDataWithParams(formDataParams, params) {
  Object.keys(params).forEach((name) => {
    const value = params[name];
    if (isArray(value)) {
      value.forEach((v) => {
        formDataParams.append(name, v);
      });
    } else {
      formDataParams.append(name, value);
    }
  });
  return formDataParams;
}

request.defaults = axios.defaults;
