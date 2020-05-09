import React from 'react';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import assign from 'lodash/assign';
import Icon from './Icon';
import { toArrayActions, triggerRenderPlugin } from '../../rope/triggerPlugin';
import PubSub from '../../_util/pubsub';
import { STOP } from '../../rope';
import InnerLoadingIcon from './InnerLoadingIcon';

interface LoadingIconHandler {
  showLoading: () => void;
  hideLoading: () => void;
  isLoading: () => boolean;
}

export interface IconProps {
  autoLoading?: boolean;
}

const RefLoadingIcon: React.RefForwardingComponent<LoadingIconHandler, IconProps> = (
  props,
  ref,
) => {
  const [loading, setLoading] = React.useState(false);

  React.useImperativeHandle(ref, () => {
    return {
      showLoading: () => setLoading(true),
      hideLoading: () => setLoading(false),
      isLoading: () => loading,
    };
  });

  // span 接受鼠标事件
  // tooltip 的问题暂时这样处理
  return (
    <span>
      <InnerLoadingIcon
        {...props}
        style={assign({}, props.style, { display: loading ? '' : 'none' })}
      />
      <Icon {...props} style={assign({}, props.style, { display: loading ? 'none' : '' })} />
    </span>
  );
};

const LoadingIcon = React.forwardRef(RefLoadingIcon);

const LoadingIconManager = (props) => {
  const iconRef = React.useRef<LoadingIconHandler>(null);

  const { ctx, config, autoLoading = true, ...restProps } = props;

  if (!config || !config.action) {
    return <Icon {...restProps} />;
  }

  const showLoadingAction = () => iconRef.current.showLoading();
  const hideLoadingAction = () => {
    // 例如和modal搭配，modal销毁时，iconRef.current会变为null
    if (iconRef.current) {
      iconRef.current.hideLoading();
    }
  };

  React.useEffect(() => {
    // 行为链中断
    const unsub = PubSub.sub(STOP, () => {
      hideLoadingAction();
    });
    return () => {
      unsub();
    };
  }, []);

  let finalCtx = ctx;
  let finalActions;
  if (autoLoading) {
    finalActions = [];
    toArrayActions(config.action, finalActions);
    let lastAction = finalActions[finalActions.length - 1];

    if (isFunction(lastAction) || isString(lastAction)) {
      const originalLastAction = lastAction;
      lastAction = {
        type: originalLastAction,
        final: hideLoadingAction,
      };
    } else if (lastAction.final) {
      const originalFinal = lastAction.final;
      lastAction = assign({}, lastAction, {
        final: (...args) => {
          hideLoadingAction();
          originalFinal(...args);
        },
      });
    } else {
      lastAction = assign({}, lastAction, { final: hideLoadingAction });
    }

    finalActions.unshift(showLoadingAction);
    finalActions[finalActions.length - 1] = lastAction;
  } else {
    finalActions = config.action;
    finalCtx = assign({}, ctx, {
      icon: {
        showLoading: showLoadingAction,
        hideLoading: hideLoadingAction,
      },
    });
  }
  const elem = triggerRenderPlugin(
    finalCtx,
    assign({}, config, {
      type: () => <LoadingIcon {...restProps} ref={iconRef} />,
      action: finalActions,
    }),
  );

  return elem;
};

export default LoadingIconManager;
