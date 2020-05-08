export type PluginType = 'render' | 'field' | 'action' | 'dependency' | 'converter' | 'convertParams';

export type Ctx = any;

// 渲染插件
export type RenderPluginFunction = (ctx: Ctx) => React.ReactElement;
export type RenderPlugin = {
  type: string | RenderPluginFunction;
  props: Record<string, any>;
  functionProps: Record<string, (ctx: Ctx) => string>;
};

// field插件
export type FieldPlugin = RenderPlugin;

// 行为插件
export type ActionPluginFunction = (ctx: Ctx) => Promise<any> | any | void;
export type ActionBeforeFunction = (ctx: Ctx) => Promise<boolean> | boolean | void;
export type ActionHookFunction = (ctx: Ctx) => void;
export type ActionPlugin = {
  type: string | ActionPluginFunction;
  before?: ActionBeforeFunction;
  error?: ActionHookFunction;
  final?: ActionHookFunction;
  finish?: ActionPlugin | ActionPlugin[];
  [key: string]: any;
};

// 注册插件
export type RenderImpl = (ctx: Ctx, config: RenderPlugin) => React.ReactElement
export type RegisterRenderPlugin = (
  pluginName: string,
  render: RenderImpl,
) => void;

export type FieldImpl = (ctx: Ctx, config: FieldPlugin) => React.ReactElement;
export type RegisterFieldPlugin = (
  pluginName: string,
  field: FieldImpl,
) => void;

export type ActionImpl = (ctx: Ctx, config: ActionPlugin) => Promise<any> | any | void;
export type RegisterActionPlugin = (
  pluginName: string,
  action: ActionImpl,
) => void;

// 其他注册插件
// 数据转换
export type ConverterImpl = (ctx: Ctx, config: ConverterPlugin) => any;
export type RegisterConverterPlugin = (
  pluginName: string,
  converter: ConverterImpl,
) => void;

// 参数转换
export type ConvertParamsImpl = (ctx: Ctx, config: ConvertParamsPlugin) => any;
export type RegisterConvertParamsPlugin = (
  pluginName: string,
  ConvertParams: ConvertParamsImpl,
) => void;

// 依赖转换
export type DependencyImpl = (ctx: Ctx) => any;
export type RegisterDependencyPlugin = (
  pluginName: string,
  Dependency: DependencyImpl,
) => void;


// 触发插件

// ============ Other Plugins ==============
// 关联插件
export type DependencyPluginFunction = (ctx: Ctx) => void;
export type DependencyPlugin = {
  type: string | DependencyPluginFunction;
};

// 请求参数转换插件
export type ConvertParamsPluginFunction = (ctx: Ctx) => any;
export type ConvertParamsPlugin = {
  type: string | ConvertParamsPluginFunction;
}

// 请求返回数据转换插件
export type ConverterPluginFunction = (ctx: Ctx) => any;
export type ConverterPlugin = {
  type: string | ConverterPluginFunction;
}