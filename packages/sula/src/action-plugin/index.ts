import sula from '../core';
import {
  validateFields,
  validateGroupFields,
  validateQueryFields,
  resetFields,
  getFieldsValue,
} from './validateFields';
import { refreshTable, resetTable } from './refreshTable';
import { modalform, drawerform, modalOk, modalCancel } from './modalform';
import { request } from './request';
import { back, forward, route } from './history';
import { assignResult } from './lang';
import { ActionImpl } from '../types/plugin';

function registerActionPlugin(pluginName: string, actionPlugin: ActionImpl) {
  sula.actionType(pluginName, actionPlugin);
}

function registerActionPlugins() {
  // =============== form ================
  registerActionPlugin('validateFields', validateFields);
  registerActionPlugin('validateGroupFields', validateGroupFields);
  registerActionPlugin('validateQueryFields', validateQueryFields);
  registerActionPlugin('resetFields', resetFields);
  registerActionPlugin('getFieldsValue', getFieldsValue);

  // ================= table ==================
  registerActionPlugin('refreshTable', refreshTable);
  registerActionPlugin('resetTable', resetTable);

  registerActionPlugin('modalform', modalform);
  registerActionPlugin('drawerform', drawerform);
  registerActionPlugin('modalOk', modalOk);
  registerActionPlugin('modalCancel', modalCancel);

  // ================= request =============
  registerActionPlugin('request', (ctx, config) => {
    return request(config, ctx);
  });

  // ================= history =================
  registerActionPlugin('back', (ctx) => {
    return back(ctx);
  });

  registerActionPlugin('forward', (ctx) => {
    return forward(ctx);
  });

  registerActionPlugin('route', (ctx, config) => {
    return route(ctx, config);
  });

  // ================= lang =====================
  registerActionPlugin('assign', assignResult);
}

export { request, registerActionPlugins, registerActionPlugin };
