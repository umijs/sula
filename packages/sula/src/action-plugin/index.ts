import sula from '../core';
import {
  validateFields,
  validateGroupFields,
  validateQueryFields,
  resetFields,
} from './validateFields';
import { refreshTable, resetTable } from './refreshTable';
import { modalform, drawerform } from './modalform';
import { request } from './request';
import { back, forward, route } from './history';

function registerActionPlugin() {
  // =============== form ================
  sula.actionType('validateFields', validateFields);
  sula.actionType('validateGroupFields', validateGroupFields);
  sula.actionType('validateQueryFields', validateQueryFields);
  sula.actionType('resetFields', resetFields);

  // ================= table ==================
  sula.actionType('refreshTable', refreshTable);
  sula.actionType('resetTable', resetTable);

  sula.actionType('modalform', modalform);
  sula.actionType('drawerform', drawerform);

  // ================= request =============
  sula.actionType('request', (ctx, config) => {
    return request(config, ctx);
  });

  // ================= history =================
  sula.actionType('back', (ctx) => {
    return back(ctx);
  });

  sula.actionType('forward', (ctx) => {
    return forward(ctx);
  });

  sula.actionType('route', (ctx, config) => {
    return route(ctx, config);
  });
}

export { registerActionPlugin, request };
