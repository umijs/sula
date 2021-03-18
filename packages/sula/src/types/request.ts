import { AxiosRequestConfig } from 'axios';
import { ConvertParamsPlugin, ConverterPlugin } from './plugin';

export interface BizResponse {
  code: number; // biz 响应状态码
  data: any; // 业务数据
  success: boolean;
  message: string;
  description: string; // 错误详细信息 for 开发排查问题等
}

// 开发机生效
export interface DevErrorDesc {
  message: string;
  description: string;
}

export type Message = boolean | string | undefined; // 默认是false代表不出成功提示，true代表使用后端返回message，string代表自定义提示信息

export interface NotifyMessages {
  successMessage: string | null | undefined;
  errorMessage: string | null | undefined;
  errorDesc: DevErrorDesc | null | undefined;
}

// 0. 网络错误 / 跨域 / 服务不存在 / 服务器错误 错误信息转换
export type ErrorMessageAdapter = (
  error: Error,
) => { success: false; code: number; message: string };

// 1. 业务重定向
export type BizRedirectHandler = (response: BizResponse) => void;

// 2. 开发级错误转换
export type BizDevErrorAdapter = (response: BizResponse) => DevErrorDesc | null | undefined;

// 3. 用户级错误（邮箱已注册等）
export type BizErrorMessageAdapter = (response: BizResponse) => string | null | undefined;

// 4. 成功信息提示
export type BizSuccessMessageAdapter = (
  response: BizResponse,
  successMessage: Message,
) => string | null | undefined;

// 5. 消息通知
export type BizNotifyHandler = (notifyMessages: NotifyMessages) => void;

// 6. 业务数据获取
export type BizDataAdapter = (response: BizResponse) => any;

// 7. 参数转换
export type BizParamsAdapter = (params: Record<string, any>) => Record<string, any>;

// 8. axios 转换
export type BizRequestAdapter<T> = (requestConfig: T) => T;

export type BizExtendConfig<T = unknown> = {
  errorMessageAdapter: ErrorMessageAdapter
  bizRedirectHandler: BizRedirectHandler;
  bizDevErrorAdapter: BizDevErrorAdapter;
  bizErrorMessageAdapter: BizErrorMessageAdapter;
  bizSuccessMessageAdapter: BizSuccessMessageAdapter;
  bizNotifyHandler: BizNotifyHandler;
  bizDataAdapter: BizDataAdapter;
  bizParamsAdapter?: BizParamsAdapter;
  bizRequestAdapter?: BizRequestAdapter<T>;
};

export interface RequestConfig {
  init?: boolean; // 默认是true，该参数并不为plugin-request使用
  successMessage?: Message; // 默认是false
  convertParams?: ConvertParamsPlugin | ConvertParamsPlugin[];
  converter?: ConverterPlugin | ConverterPlugin[];
  url: string;

  method?: AxiosRequestConfig['method'];
  params?: AxiosRequestConfig['params'];
  data?: AxiosRequestConfig['data'];
}
