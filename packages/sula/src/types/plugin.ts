import { ColumnProps } from 'antd/lib/table';
import { Mode, FieldNamePath } from './form';
import { FormInstance } from '../form/Form';
import { TableInstance } from '../table/Table';

export type PluginType = 'render' | 'field' | 'action' | 'dependency' | 'converter' | 'convertParams' | 'filter';

// Form Context
type FormCtx = {
  form: FormInstance;
  mode: Mode;
  source: any;
};

type DependencyCtx = {
  values: any[];
  name: FieldNamePath;
  relates: FieldNamePath[];
}

// Table Context 
type TableCtx = {
  table: TableInstance;
  record?: Record<string, any>;
  text?: any;
  index?: number;
  dataSource?: Record<string, any>[];
}

type RenderCtx = Partial<FormCtx> & Partial<TableCtx>;

// Action Context
type ActionResultCtx = {
  result: any;
  results: Record<string, any>;
}

type ActionResultComboCtx = ActionResultCtx & Partial<RenderCtx>;

type ConvertParamsCtx = {
  params: Record<string, any>
}

type ConvertParamsComboCtx = ConvertParamsCtx & Partial<ActionResultComboCtx>;

type ConverterCtx = {
  data: Record<string, any>;
}

type ConverterComboCtx = ConverterCtx & Partial<ActionResultComboCtx>;

// 渲染插件
export type RenderPluginFunction<T = RenderCtx> = (ctx: T) => React.ReactElement;
export type RenderPlugin<T = RenderCtx> = {
  type: string | RenderPluginFunction;
  props: Record<string, any>;
  functionProps: Record<string, (ctx: T) => string>;
};

// field插件
export type FieldPlugin = RenderPlugin<FormCtx>;

// 行为插件
export type ActionPluginFunction = (ctx: ActionResultComboCtx) => Promise<any> | any | void;
export type ActionBeforeFunction = (ctx: ActionResultComboCtx) => Promise<boolean> | boolean | void;
export type ActionHookFunction = (ctx: ActionResultComboCtx) => void;
export type ActionPlugin = {
  type: string | ActionPluginFunction;
  before?: ActionBeforeFunction;
  error?: ActionHookFunction;
  final?: ActionHookFunction;
  finish?: ActionPlugin | ActionPlugin[];
  [key: string]: any;
};

// 注册插件
export type RenderImpl = (ctx: RenderCtx, config: RenderPlugin) => React.ReactElement
export type RegisterRenderPlugin = (
  pluginName: string,
  render: RenderImpl,
) => void;

export type FieldImpl = (ctx: FormCtx, config: FieldPlugin) => React.ReactElement;
export type RegisterFieldPlugin = (
  pluginName: string,
  field: FieldImpl,
) => void;

export type ActionImpl = (ctx: ActionResultComboCtx, config: ActionPlugin) => Promise<any> | any | void;
export type RegisterActionPlugin = (
  pluginName: string,
  action: ActionImpl,
) => void;

// 其他注册插件
// 数据转换
export type ConverterImpl = (ctx: ConverterComboCtx, config: ConverterPlugin) => any;
export type RegisterConverterPlugin = (
  pluginName: string,
  converter: ConverterImpl,
) => void;

// 参数转换
export type ConvertParamsImpl = (ctx: ConvertParamsComboCtx, config: ConvertParamsPlugin) => any;
export type RegisterConvertParamsPlugin = (
  pluginName: string,
  ConvertParams: ConvertParamsImpl,
) => void;

// 依赖转换
export type DependencyImpl = (ctx: FormCtx & DependencyCtx, config: any) => any;
export type RegisterDependencyPlugin = (
  pluginName: string,
  Dependency: DependencyImpl,
) => void;

// 过滤插件
export type FilterImpl = (ctx: TableCtx, config: any) => Pick<ColumnProps<any>, 'filterDropdown' | 'onFilterDropdownVisibleChange'>;
export type RegisterFilterPlugin = (plguinName: string, Filter: FilterImpl) => void;


// 触发插件

// ============ Other Plugins ==============
// 关联插件
export type DependencyPluginFunction = (ctx: FormCtx & DependencyCtx) => false | void;
export type DependencyPlugin = {
  type: string | DependencyPluginFunction;
};

// 请求参数转换插件
export type ConvertParamsPluginFunction = (ctx: ConvertParamsComboCtx) => any;
export type ConvertParamsPlugin = {
  type: string | ConvertParamsPluginFunction;
}

// 请求返回数据转换插件
export type ConverterPluginFunction = (ctx: ConverterComboCtx) => any;
export type ConverterPlugin = {
  type: string | ConverterPluginFunction;
}

// 过滤插件
export type FilterPlugin = {
  type: string;
}