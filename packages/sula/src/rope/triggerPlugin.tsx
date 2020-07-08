import React from 'react';
import assign from 'lodash/assign';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import toLower from 'lodash/toLower';
import { Space } from 'antd';
import { LazyPluginCtx, LazyPluginCtxGetter, PluginCtx } from '../types/ctx';
import {
  RenderPlugin,
  ActionPlugin,
  FieldPlugin,
  PluginType,
  ValidatorPlugin,
  ConvertParamsPlugin,
  ConverterPlugin,
  DependencyPlugin,
} from '../types/plugin';
import transformConfig, { SkipOptions } from '../_util/transformConfig';
import sula from '../core';
import { toArray } from '../_util/common';
import Rope from '.';
import RopeContainer from './RopeContainer';

export const getLazyCtx = (ctx: LazyPluginCtx) => {
  if (!ctx) {
    return null;
  }

  return Object.keys(ctx).reduce((memo, key) => {
    if (key === 'ctxGetter') {
      const ctxGetter = ctx[key] as LazyPluginCtxGetter;
      return assign(
        isFunction(ctxGetter)
          ? ctxGetter()
          : Object.keys(ctxGetter).reduce((ctxMemo, ctxKey) => {
              const curCtxGetter = ctxGetter[ctxKey] as LazyPluginCtxGetter;
              assign(ctxMemo, isFunction(curCtxGetter) ? curCtxGetter() : {});
              return ctxMemo;
            }, {}),
        memo,
      );
    }
    memo[key] = ctx[key];
    return memo;
  }, {} as PluginCtx);
};

/**
 * 1. lazyCtx -> ctx
 * 2. 方法 config.type 执行
 * 3. 配置属性转换
 * 4. 如果是render插件则做funcProps与props的合并
 * 5. 触发插件
 */
export const triggerPlugin = (
  name: PluginType,
  ctx: PluginCtx | null,
  config:
    | RenderPlugin
    | ActionPlugin
    | ValidatorPlugin
    | ConvertParamsPlugin
    | ConverterPlugin
    | DependencyPlugin,
  skipOptions?: SkipOptions,
  isRender?: boolean,
) => {
  // 1. normalize config
  const normalizedConfig = normalizeConfig(config);

  if (isFunction(normalizedConfig.type)) {
    return normalizedConfig.type(ctx);
  }

  // 2. render config transform
  let transedConfig = transformConfig(normalizedConfig, ctx, skipOptions);

  if (isRender) {
    const funcProps = transedConfig.funcProps;
    if (funcProps) {
      transedConfig.props = assign({}, transedConfig.props, funcProps);
    }
  }

  // TODO
  return sula[name](transedConfig.type, ctx, transedConfig);
};

/**
 * 表单插件
 * - skipFuncObjKeys
 *   - props
 * - skipSelector
 */
export const triggerFieldPlugin = (
  lazyCtx: LazyPluginCtx | PluginCtx,
  config: FieldPlugin,
  valuePropName?: string,
) => {
  const skipSelector = (curKey: string | number, parentKey: string | number) =>
    parentKey === 'props' && curKey === valuePropName;

  return triggerPlugin(
    'field',
    getLazyCtx(lazyCtx),
    config,
    {
      skipSelector,
      skipFuncObjKeys: ['props'],
    },
    true,
  );
};

export const triggerRenderPlugin = (
  lazyCtx: LazyPluginCtx | PluginCtx,
  config: RenderPlugin | RenderPlugin[],
): React.ReactFragment | null => {
  const ctx = getLazyCtx(lazyCtx) as PluginCtx;
  //过滤掉不显示的
  const arrayConf = toArray(config).filter((iterConf) => {
    const visible = transformConfig(iterConf.visible, ctx);
    return visible != false;
  });

  if (arrayConf.length === 0) {
    return null;
  } else if (arrayConf.length === 1) {
    // 不能传 finalCtx，要传 lazyCtx
    return triggerSingleRenderPlugin(lazyCtx, arrayConf[0]);
  }

  return (
    <Space>
      {arrayConf.map((conf, index) => {
        const actionNode = triggerSingleRenderPlugin(lazyCtx, conf);
        return React.cloneElement(actionNode, { key: index });
      })}
    </Space>
  );
};

/**
 * 针对单个，渲染插件可携带action
 * scope: private
 */
export const triggerSingleRenderPlugin = (lazyCtx: LazyPluginCtx, config: RenderPlugin) => {
  const skipOptions = {
    skipFuncObjKeys: ['props'],
    skipKeys: ['action'],
  };
  const normalizedRenderConfig = normalizeConfig(config) as RenderPlugin;

  const isTwiceTrigger =
    normalizedRenderConfig.type === 'button' ||
    normalizedRenderConfig.type === 'link' ||
    normalizedRenderConfig.type === 'icon';

  const renderNode = triggerPlugin(
    'render',
    isTwiceTrigger ? lazyCtx : getLazyCtx(lazyCtx),
    normalizedRenderConfig as RenderPlugin,
    skipOptions,
    true,
  );
  const actionsConfig = normalizedRenderConfig.action;
  // button, icon 会触发两次triggerRenderPlugin，第一次不绑定action
  if (!actionsConfig || isTwiceTrigger) {
    return renderNode;
  }

  // 绑定rope-container
  const rope = new Rope({
    trigger: (ctx, config) => {
      // 这里config的 before, error, final 已经被剔除了
      return triggerActionPlugin(ctx, config);
    },
  });

  const arrayActionsConfig = [] as ActionPlugin[];
  toArrayActions(actionsConfig, arrayActionsConfig);

  const trigger = arrayActionsConfig
    .reduce((memo, actionConfig) => {
      const normalizedActionConfig = normalizeConfig(actionConfig, 'request');
      memo.use(normalizedActionConfig);
      return memo;
    }, rope)
    .proxy();

  const { disabled, confirm, tooltip } = normalizedRenderConfig;

  return (
    <RopeContainer
      disabled={disabled}
      confirm={confirm}
      tooltip={tooltip}
      trigger={() => {
        const ctx = getLazyCtx(lazyCtx);
        trigger(ctx);
      }}
    >
      {renderNode}
    </RopeContainer>
  );
};

/**
 * 行为插件
 */
const formPluginsName = ['submit', 'back', 'actionsRender', 'fields', 'container', 'remoteValues'];
const actionSkipKeysMap: Record<string, string[]> = {
  request: ['convertParams', 'converter'],
  modalform: formPluginsName,
  drawerform: formPluginsName,
};
export const triggerActionPlugin = (lazyCtx: LazyPluginCtx, config: ActionPlugin) => {
  // submit, remoteValues省略request
  const normalizedConfig = normalizeConfig(config, 'request') as ActionPlugin;
  let finalSkipOptions;

  if (isString(normalizedConfig.type)) {
    const pluginName = toLower(normalizedConfig.type);
    finalSkipOptions = {
      skipKeys: actionSkipKeysMap[pluginName],
    };
  }

  return triggerPlugin('action', getLazyCtx(lazyCtx), normalizedConfig, finalSkipOptions);
};

/**
 * 归一化actions
 */
export function toArrayActions(actions, actionsChain) {
  const arrayAction = toArray(actions);
  arrayAction.forEach((action) => {
    getNextAction(action, actionsChain);
  });
}

function getNextAction(action, actionsChain) {
  if (isArray(action)) {
    toArrayActions(action, actionsChain);
  } else if (action.finish) {
    const { finish: nextAction, ...restAction } = action;
    actionsChain.push(restAction);
    toArrayActions(nextAction, actionsChain);
  } else {
    actionsChain.push(action);
  }
}
/**
 * 归一化配置
 */

export function normalizeConfig(config: string | Function | Record<string, any>, type?: string) {
  if (isString(config) || isFunction(config)) {
    return {
      type: config,
    };
  } else if (type) {
    return assign({ type }, config);
  }

  return config;
}
