import { rejectSTOP } from '../rope';

// TODO: FormCtx

export const validateFields = (ctx, config) => {
  const validateFn = ctx.form.validateFields;

  return validateFn.apply(ctx.form, config.args).then((values) => values, rejectSTOP);
};

export const validateGroupFields = (ctx, config) => {
  const validateFn = ctx.form.validateGroupFields;

  return validateFn.apply(ctx.form, config.args).then((values) => values, rejectSTOP);
};

/**
 * 使用场景：搜索列表
 */
export const validateQueryFields = (ctx) => {
  return ctx.form.validateFields(true);
};

/**
 * 使用场景：搜索列表
 */
export const resetFields = (ctx) => {
  return ctx.form.resetFields();
};

export const getFieldsValue = (ctx) => {
  return ctx.form.getFieldsValue();
};
