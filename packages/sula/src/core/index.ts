import toLower from 'lodash/toLower';
import warning from '../_util/warning';
import {
  RegisterRenderPlugin,
  RegisterFieldPlugin,
  RegisterActionPlugin,
  PluginType,
  RegisterConverterPlugin,
  RegisterConvertParamsPlugin,
  RegisterDependencyPlugin,
  RegisterFilterPlugin,
  RegisterValidatorPlugin,
} from '../types/plugin';

export class PluginRegistry {
  public renderType: RegisterRenderPlugin = () => {};
  public filterType: RegisterFilterPlugin = () => {};
  public fieldType: RegisterFieldPlugin = () => {};
  public validatorType: RegisterValidatorPlugin = () => {};
  public actionType: RegisterActionPlugin = () => {};
  public converterType:  RegisterConverterPlugin = () => {};
  public convertParamsType:  RegisterConvertParamsPlugin = () => {};
  public dependencyType:  RegisterDependencyPlugin = () => {};

  public registerType = (name: PluginType) => {
    // @ts-ignore
    const types = (this[`__${name}Types`] = Object.create(null) as Record<string, T>);

    // 注册插件
    // @ts-ignore
    this[`${name}Type`] = (type: string, callback) => {
      // 大小写无关
      const finalType = toLower(type);

      warning(!(finalType in types), 'core', `${name} type ${type} already exists.`);

      types[finalType] = callback;
    };

    // 执行插件
    // @ts-ignore
    this[name] = (type: string, ctx: any, config: any) => {
      const finalType = toLower(type);

      warning(finalType in types, 'core', `Render type ${type} no exists.`);

      const callback = types[finalType];

      // @ts-ignore
      return callback && callback(ctx, config);
    };
  };
}

const sula = new PluginRegistry();

sula.registerType('render');
sula.registerType('field');
sula.registerType('action');
sula.registerType('converter');
sula.registerType('convertParams');
sula.registerType('dependency');
sula.registerType('validator');
sula.registerType('filter');

export default sula;
