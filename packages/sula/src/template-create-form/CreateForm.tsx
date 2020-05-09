import React from 'react';
import isNumber from 'lodash/isNumber';
import isFunction from 'lodash/isFunction';
import assign from 'lodash/assign';
import Form, { MediaQueries } from '../form';
import { FormProps } from '../form/Form';
import { RequestConfig } from '../types/request';
import { ActionPlugin } from '../types/plugin';
import { toArray } from '../_util/common';
import LocaleReceiver from '../localereceiver';

export interface CreateFormProps extends FormProps {
  actionPosition: 'default' | 'center' | 'bottom';
  submit: RequestConfig;
  back?: ActionPlugin;
}

export default class CreateForm extends React.Component<CreateFormProps> {
  static defaultProps = {
    mode: 'create',
    fields: [],
    itemLayout: {
      cols: 1,
    },
  };

  getActionsPosition(cols: number) {
    // 多列
    if (cols > 1) {
      return 'center';
    } else {
      return 'default';
    }
  }

  render() {
    const { submit, back, actionsPosition, actionsRender, ...formProps } = this.props;
    const { mode, itemLayout } = formProps;

    return (
      <MediaQueries>
        {(matchedPoint) => {
          return (
            <LocaleReceiver>
              {(locale) => {
                const { cols = 1 } = itemLayout;
                const finalCols: number = isNumber(cols) ? cols : cols[matchedPoint];
                const finalActionsPosition = actionsPosition || this.getActionsPosition(finalCols);
                const finalActionsRender = renderActions(
                  {
                    submit,
                    back,
                    mode,
                    actionsRender,
                  },
                  locale,
                );

                return (
                  <Form
                    {...formProps}
                    actionsRender={finalActionsRender}
                    actionsPosition={finalActionsPosition}
                  />
                );
              }}
            </LocaleReceiver>
          );
        }}
      </MediaQueries>
    );
  }
}

export function renderActions(props, locale) {
  if (props.actionsRender) {
    return props.actionsRender;
  }

  const { submit, back = 'back', mode = 'create' } = props;
  const actionsRender = [];

  // 返回
  const backActionRender = {
    type: 'button',
    props: {
      children: mode === 'create' ? locale.cancelText : locale.backText,
    },
    action: back,
  };

  if (mode === 'view') {
    return [backActionRender];
  }

  // 提交
  const submitActionRender = {
    type: 'button',
    props: {
      type: 'primary',
      children: mode === 'create' ? locale.submitText : locale.updateText,
    },
    action: [
      {
        type: 'validateFields',
        resultPropName: '$fieldsValue',
      },
      ...transformSubmit(submit, back),
    ],
  };

  actionsRender.push(submitActionRender);
  actionsRender.push(backActionRender);

  return actionsRender;
}

function resultToParams(ctx) {
  return assign({}, ctx.params, ctx.result);
}

export function transformSubmit(submit, back) {
  if (isFunction(submit)) {
    return [submit, back];
  }

  const convertParams = toArray(submit.convertParams || []);
  convertParams.unshift(resultToParams);
  const submitAction = assign({}, submit, { convertParams });
  return [submitAction, back];
}
