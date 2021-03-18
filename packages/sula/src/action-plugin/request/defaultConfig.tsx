import { notification, message as amessage } from 'antd';
import isUndefined from 'lodash/isUndefined';
import {
  BizResponse,
  ErrorMessageAdapter,
  BizRedirectHandler,
  BizDevErrorAdapter,
  BizErrorMessageAdapter,
  BizSuccessMessageAdapter,
  BizNotifyHandler,
  BizDataAdapter,
  BizExtendConfig,
  Message,
  NotifyMessages,
} from '../../types/request';

// 0. 网络错误 / 跨域 / 服务不存在 等，message 将被传递到 bizErrorMessageAdapter
const errorMessageAdapter: ErrorMessageAdapter = (error: Error) => {
  const message = error.message;
  return {
    success: false,
    code: 200,
    message,
  };
};

// 1. 业务重定向
const bizRedirectHandler: BizRedirectHandler = (response: BizResponse) => {
  const { data, code } = response;
  if (Number(code) === 302 && data && data.redirectUrl) {
    window.location.assign(data.redirectUrl);
  }
};

// 2. 开发级错误信息转换
const bizDevErrorAdapter: BizDevErrorAdapter = (response: BizResponse) => {
  const { code, success, message, description } = response;

  const opCode = Number(code);
  if (success == false && opCode >= 300 && opCode !== 302) {
    return {
      message: message || `${code}`,
      description: description || message,
    };
  }

  return null;
};

// 3. 用户级错误信息转换
const bizErrorMessageAdapter: BizErrorMessageAdapter = (response: BizResponse) => {
  const { code, success, message } = response;

  const opCode = Number(code);

  if (success === false && (opCode < 300 || opCode === 302)) {
    // 错误信息只使用后端提供的
    return message;
  }

  // 成功
  return null;
};

// 4. 成功信息转换
const bizSuccessMessageAdapter: BizSuccessMessageAdapter = (
  response: BizResponse,
  successMessage: Message,
) => {
  const { success, message } = response;

  // 禁止显示
  if (successMessage === false) {
    return null;
  }

  if (success !== false) {
    // 默认使用后端返回
    if (successMessage === true) {
      return message;
    } else {
      // 前端设置成功提示信息
      return successMessage;
    }
  }

  return null;
};

// 5. 消息通知
const bizNotifyHandler: BizNotifyHandler = (notifyMessages: NotifyMessages) => {
  const { successMessage, errorMessage, errorDesc } = notifyMessages;

  if (successMessage) {
    amessage.success(successMessage);
  } else if (errorMessage) {
    amessage.error(errorMessage);
  } else if (errorDesc) {
    notification.error({
      message: errorDesc.message,
      description: errorDesc.description,
    });
  }
};

// 6. 业务数据转换
const bizDataAdapter: BizDataAdapter = (response: BizResponse) => {
  if (response && !isUndefined(response.data)) {
    return response.data;
  }

  return response;
};

const extendConfig = {
  errorMessageAdapter,
  bizDataAdapter,
  bizDevErrorAdapter,
  bizErrorMessageAdapter,
  bizSuccessMessageAdapter,
  bizNotifyHandler,
  bizRedirectHandler,
};

export default extendConfig;
