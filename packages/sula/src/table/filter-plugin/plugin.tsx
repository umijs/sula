import sula from '../../core';

export function registerFilterPlugin<Context = unknown>(pluginName: string) {
  return function wrapFilter(filterClass: any) {
    sula.filterType(pluginName, (ctx: Context, config = {}) => {
      return new filterClass(ctx, config);
    });
  };
}
