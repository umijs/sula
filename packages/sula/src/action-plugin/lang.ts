import assign from 'lodash/assign';

export const assignResult = (ctx, config) => {
  if(!config.args || !config.args.length) {
    return ctx.result;
  }

  return config.args.reduce((memo, arg) => {
    return assign(memo, arg, ctx.result);
  }, {});
};