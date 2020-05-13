import React from 'react';
import assign from 'lodash/assign';
import sula from '../core';
import { FieldPlugin } from '../types/plugin';

export function registerFieldPlugin<Context = unknown>(pluginName: string) {
  return function wrapComponent(
    Component: React.ComponentClass | React.FunctionComponent,
    hasSource?: boolean,
    hasCtx?: boolean,
  ) {
    sula.fieldType(pluginName, (ctx: Context, config = {} as FieldPlugin) => {
      const { mode, source, disabled } = ctx;
      const props = config.props || {};
      const extraProps = { disabled } as any;
      if (mode === 'view') {
        extraProps.disabled = true;
      }

      if (hasSource) {
        extraProps.source = source;
      }

      if(hasCtx) {
        extraProps.ctx = ctx;
      }

      return React.createElement(Component, assign(extraProps, props));
    });
  };
}
