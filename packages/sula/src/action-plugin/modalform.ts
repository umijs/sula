import assign from 'lodash/assign';

export const modalform = (ctx, config) => {
  const modal = ctx.__modalGetter('modal');
  // ctxGetter 给到 sula-form
  return modal.show(assign({}, config, { ctxGetter: () => ctx }));
};

export const drawerform = (ctx, config) => {
  const modal = ctx.__modalGetter('drawer');
  return modal.show(assign({}, config, { ctxGetter: () => ctx }));
};
