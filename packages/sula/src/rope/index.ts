import omit from 'lodash/omit';
import assign from 'lodash/assign';
import isFunction from 'lodash/isFunction';
import { ActionBeforeFunction, ActionHookFunction, ActionPlugin } from '../types/plugin';
import { isPromise } from '../_util/is';
import actionLogger from '../_util/action-logger';
import PubSub from '../_util/pubsub';

type RopeProto = {
  trigger: (ctx: any, config: any) => Promise<any> | any;
  [key: string]: any;
};

type StackItem = {
  before?: ActionBeforeFunction;
  error?: ActionHookFunction;
  final?: ActionHookFunction;
  resultPropName?: string;
  trigger: (ctx: any, next: (payload: any) => void) => any;
  handle: (ctx: any, next: (payload: any) => void) => any;
  actionType: any;
};

export const STOP = '@@sula_action_stop';
export const ERROR = '@@sula_action_error';
export const FINISH = '@@sula_action_finish';

export type RopeActionResult = typeof STOP | typeof ERROR | typeof FINISH;

export const rejectSTOP = () => Promise.reject(STOP);

export default class Rope {
  proto: RopeProto;

  constructor(proto: RopeProto) {
    this.proto = proto;
  }

  stack: StackItem[] = [];

  public proxy = () => {
    // ropeContainer 触发，已经 getCtx 过
    return (ctx) => {
      const results = {} as Record<string, any>;
      let finalCtx = ctx;
      let stackIndex = 0;
      const next = (result) => {
        const prevStackItem = this.stack[stackIndex];
        if (prevStackItem.resultPropName) {
          results[prevStackItem.resultPropName] = result;
        }
        stackIndex += 1;
        const curStackItem = this.stack[stackIndex];
        if (!curStackItem) {
          return;
        }

        assign(finalCtx, { results, result });
        if (curStackItem.trigger) {
          curStackItem.trigger(finalCtx, next);
        }
      };

      const curStackItem = this.stack[stackIndex];
      if (curStackItem && curStackItem.trigger) {
        curStackItem.trigger(finalCtx, next);
      }
    };
  };

  /**
   * action 已经 normalize
   */
  public use = (action: ActionPlugin & StackItem) => {
    let actionConfig: ActionPlugin;

    const stackItem = {} as StackItem;
    stackItem.before = action.before;
    stackItem.error = action.error;
    stackItem.final = action.final;
    stackItem.resultPropName = action.resultPropName;
    stackItem.actionType = isFunction(action.type) ? action.type.name : action.type;

    actionConfig = omit(action, ['before', 'error', 'final', 'resultPropName']) as ActionPlugin;

    stackItem.trigger = (ctx, next) => {
      actionLogger('action', stackItem.actionType);
      if (!stackItem.before) {
        stackItem.handle(ctx, next);
      } else {
        this.handleBeforeResult(stackItem.before, ctx, (beforeExecuteResult) => {
          if (beforeExecuteResult.type === FINISH) {
            actionLogger('beforePass');
            stackItem.handle(ctx, next);
          } else {
            PubSub.pub(STOP);
            actionLogger('beforeStop');
          }
        });
      }
    };
    /**
     * ctx会在中间件中添加新属性
     */
    stackItem.handle = (ctx, next) => {
      this.handleResult(ctx, actionConfig, (executeResult) => {
        if (executeResult.type === FINISH) {
          actionLogger('actionSuccess', executeResult.payload);
          next(executeResult.payload);
        } else if (executeResult.type === STOP) {
          PubSub.pub(STOP);
          actionLogger('actionError', executeResult.payload);
          if (stackItem.error) {
            stackItem.error(ctx);
          }
        }
        if (stackItem.final) {
          stackItem.final(ctx);
        }
      });
    };

    this.stack.push(stackItem);

    return this;
  };

  private handleResult = (ctx, actionConfig, dispatch): void => {
    // 不直接使用triggerActionPlugin，解耦
    const executeResult = this.proto.trigger(ctx, actionConfig);
    if (isPromise(executeResult)) {
      executeResult.then(
        (result) => {
          dispatch({
            type: FINISH,
            payload: result,
          });
        },
        (error) => {
          dispatch({
            type: STOP,
            payload: error,
          });
        },
      );
    } else {
      dispatch({
        type: FINISH,
        payload: executeResult,
      });
    }
  };

  private handleBeforeResult = (beforeHook, ctx, dispatch) => {
    const beforeResult = beforeHook(ctx);
    if (isPromise(beforeResult)) {
      beforeResult.then(
        (result) => {
          dispatch({
            type: FINISH,
            payload: result,
          });
        },
        () => {
          dispatch({
            type: STOP,
          });
        },
      );
    } else {
      if (beforeResult === false) {
        dispatch({
          type: STOP,
        });
      } else {
        dispatch({
          type: FINISH,
        });
      }
    }
  };
}
