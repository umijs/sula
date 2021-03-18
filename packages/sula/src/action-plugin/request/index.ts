import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import assign from 'lodash/assign';
import toLower from 'lodash/toLower';
import isArray from 'lodash/isArray';
import isArrayLikeObject from 'lodash/isArrayLikeObject';
import isFunction from 'lodash/isFunction';
import { RequestConfig, BizExtendConfig, BizResponse } from '../../types/request';
import extendConfig from './defaultConfig';
import { toArray } from '../../_util/common';
import { triggerPlugin } from '../../rope/triggerPlugin';
import { request as axiosRequest, dataResolver as axiosDataResolver } from './axiosImpl';

type ExtendConfigMatcher = (requestConfig: AxiosRequestConfig) => boolean;

let globalConfig = extendConfig;

const requestRegistry = {
  request: axiosRequest,
  dataResolver: axiosDataResolver,
};

const globalConfigMatchers = [] as [ExtendConfigMatcher, BizExtendConfig][];

const getMatchedConfig = (requestConfig: AxiosRequestConfig) => {
  if (!globalConfigMatchers.length) {
    return null;
  }

  for (let i = 0, len = globalConfigMatchers.length; i < len; i += 1) {
    const [matcher, extendConfig] = globalConfigMatchers[i];
    if (matcher(requestConfig)) {
      return extendConfig;
    }

    return null;
  }
};

// 不再使用fetch这个名字，防止和fetch冲突
export const request = <T = AxiosRequestConfig>(config: RequestConfig & T, ctx?: any) => {
  type FinalRequestConfig = RequestConfig & T;
  const {
    url,
    method = 'GET',
    params,
    convertParams,
    converter,

    successMessage,

    ...restConfig
  } = config;

  let requestOptions = {
    ...restConfig,
    url,
    method,
  } as FinalRequestConfig;

  const matchedConfig = getMatchedConfig(requestOptions);

  const curConf = assign({}, globalConfig, matchedConfig);

  const {
    errorMessageAdapter,
    bizRedirectHandler,
    bizDevErrorAdapter,
    bizErrorMessageAdapter,
    bizSuccessMessageAdapter,
    bizNotifyHandler,
    bizDataAdapter,
    bizParamsAdapter,
    bizRequestAdapter,
  } = curConf as BizExtendConfig<FinalRequestConfig>;

  let finalParams: RequestConfig['params'] = params || {};

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

  if (bizParamsAdapter) {
    finalParams = bizParamsAdapter(finalParams);
  }

  const lMethod = toLower(method);

  if (lMethod === 'get' || lMethod === 'delete') {
    requestOptions.params = finalParams;
  } else {
    requestOptions.data = finalParams;
  }

  if (bizRequestAdapter) {
    requestOptions = bizRequestAdapter(requestOptions);
  }

  return requestRegistry
    .request(requestOptions)
    .then(
      (raw: AxiosResponse) => {
        return requestRegistry.dataResolver(raw);
      },
      (error) => {
        return errorMessageAdapter(error);
      },
    )
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

request.use = (matcher: ExtendConfigMatcher | BizExtendConfig, extendConfig?: BizExtendConfig) => {
  if (isFunction(matcher)) {
    globalConfigMatchers.push([matcher, extendConfig as BizExtendConfig]);
  } else {
    globalConfig = assign({}, globalConfig, matcher as BizExtendConfig);
  }
};

const invariant = (raw: any) => raw;

request.impl = (requestFn: (options: any) => Promise<any>, dataResolverFn?: (raw: any) => any) => {
  const finalDataResolverFn = dataResolverFn || invariant;
  requestRegistry.request = requestFn;
  requestRegistry.dataResolver = finalDataResolverFn;
};
