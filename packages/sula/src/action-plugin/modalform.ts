import assign from 'lodash/assign';
import { STOP } from '../rope';

export const modalform = (ctx, config) => {
  const modal = ctx.__modalGetter('modal');
  // ctxGetter 给到 sula-form
  return modal.show(assign({}, config, { ctxGetter: { table: () => ctx } }));
};

export const drawerform = (ctx, config) => {
  const modal = ctx.__modalGetter('drawer');
  return modal.show(assign({}, config, { ctxGetter: { table: () => ctx } }));
};

export const modalCancel = (ctx) => {
  return ctx.modal.modalCancel(STOP);
}

export const modalOk = (ctx) => {
  return ctx.modal.modalOk(ctx);
}
