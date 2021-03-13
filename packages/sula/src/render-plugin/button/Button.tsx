import React from 'react';
import { ButtonProps as AButtonProps } from 'antd/lib/button';
import { Button as AButton } from 'antd';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import assign from 'lodash/assign';
import Icon from '../icon';
import { toArrayActions, triggerRenderPlugin } from '../../rope/triggerPlugin';
import PubSub from '../../_util/pubsub';
import { STOP } from '../../rope';

interface LoadingButtonHandler {
  showLoading: () => void;
  hideLoading: () => void;
  isLoading: () => boolean;
}

export interface ButtonProps extends AButtonProps {
  icon?: React.ReactNode | string;
  autoLoading?: boolean;
}

const RefLoadingButton: React.ForwardRefRenderFunction<LoadingButtonHandler, ButtonProps> = (
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

  let finalIcon = isString(props.icon) ? { type: props.icon } : props.icon;
  if (finalIcon) {
    finalIcon = <Icon {...finalIcon} />;
  }

  return <AButton {...props} loading={loading} icon={finalIcon} />;
};

export const LoadingButton = React.forwardRef(RefLoadingButton);

export const LoadingButtonManager: React.FunctionComponent = (props) => {
  const btnRef = React.useRef<LoadingButtonHandler>(null);

  const { ctx, config, autoLoading = true, ...restProps } = props;

  if (!config || !config.action) {
    return <AButton {...restProps} />;
  }

  const showLoadingAction = () => btnRef.current.showLoading();
  const hideLoadingAction = () => {
    // 例如和modal搭配，modal销毁时，btnRef.current会变为null
    if (btnRef.current) {
      btnRef.current.hideLoading();
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
      button: {
        showLoading: showLoadingAction,
        hideLoading: hideLoadingAction,
      },
    });
  }
  const elem = triggerRenderPlugin(
    finalCtx,
    assign({}, config, {
      type: () => <LoadingButton {...restProps} ref={btnRef} />,
      action: finalActions,
    }),
  );

  return elem;
};

export const LoadingLinkManager = (props) => {
  return (
    <LoadingButtonManager {...props} type="link" style={assign({}, props.style, { padding: 0 })} />
  );
};
