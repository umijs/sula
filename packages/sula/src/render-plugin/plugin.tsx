import React from 'react';
import pick from 'lodash/pick';
import assign from 'lodash/assign';
import sula from '../core';
import { RenderPlugin } from '../types/plugin';

export function registerRenderPlugin<Context = unknown>(pluginName: string, extraPropsName?: string[]) {
  return function wrapComponent(
    Component: React.ComponentClass<any> | React.FunctionComponent<any> | 'div',
    needCtxAndConfig?: boolean,
  ) {
    sula.renderType(pluginName, (ctx: Context, config = {} as RenderPlugin) => {
      const props = config.props || {};
      let extraProps;
      if (extraPropsName && extraPropsName.length) {
        extraProps = pick(config, extraPropsName);
      }

      if (needCtxAndConfig) {
        extraProps = extraProps ? extraProps : {};
        extraProps.ctx = ctx;
        extraProps.config = config;
      }

      return React.createElement(Component, extraProps ? assign(extraProps, props) : props);
    });
  };
}
