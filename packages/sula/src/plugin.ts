import sula from './core';
import { ConvertParamsImpl, ConverterImpl, DependencyImpl } from './types/plugin';
import warning from './_util/warning';

export const registerPlugin = (pluginType: 'convertParams' | 'converter' | 'dependency', pluginName: string, pluginImpl: ConvertParamsImpl | ConverterImpl | DependencyImpl) => {
  if(pluginType === 'convertParams') {
    sula.convertParamsType(pluginName, pluginImpl as ConvertParamsImpl);
    return;
  } else if(pluginType === 'converter') {
    sula.converterType(pluginName, pluginImpl as ConverterImpl);
    return;
  } else if(pluginType === 'dependency') {
    sula.dependencyType(pluginName, pluginImpl as DependencyImpl);
    return;
  }

  warning(false, 'registerPlugin', `unknown pluginType ${pluginType}`);
}