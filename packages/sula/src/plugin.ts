import sula from './core';
import { ConvertParamsImpl, ConverterImpl, DependencyImpl, ValidatorImpl } from './types/plugin';
import warning from './_util/warning';

export const registerPlugin = (pluginType: 'convertParams' | 'converter' | 'dependency' | 'validator', pluginName: string, pluginImpl: ConvertParamsImpl | ConverterImpl | DependencyImpl | ValidatorImpl) => {
  if(pluginType === 'convertParams') {
    sula.convertParamsType(pluginName, pluginImpl as ConvertParamsImpl);
    return;
  } else if(pluginType === 'converter') {
    sula.converterType(pluginName, pluginImpl as ConverterImpl);
    return;
  } else if(pluginType === 'dependency') {
    sula.dependencyType(pluginName, pluginImpl as DependencyImpl);
    return;
  } else if(pluginType === 'validator') {
    sula.validatorType(pluginName, pluginImpl as ValidatorImpl);
    return;
  }

  warning(false, 'registerPlugin', `unknown pluginType ${pluginType}`);
}