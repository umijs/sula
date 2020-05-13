import React from 'react';
import isNumber from 'lodash/isNumber';
import isFunction from 'lodash/isFunction';
import assign from 'lodash/assign';
import { Form, MediaQueries, FormProps } from '../form';
import { RequestConfig } from '../types/request';
import { ActionPlugin } from '../types/plugin';
import { toArray } from '../_util/common';
import LocaleReceiver from '../localereceiver';
import { Spin } from 'antd';

export interface CreateFormProps extends FormProps {
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

  state = {
    loading: false,
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
    const { loading } = this.state;

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
                  <Spin spinning={loading}>
                    <Form
                      {...formProps}
                      actionsRender={finalActionsRender}
                      actionsPosition={finalActionsPosition}
                      onRemoteValuesStart={() => {
                        this.setState({
                          loading: true,
                        });
                      }}
                      onRemoteValuesEnd={() => {
                        this.setState({
                          loading: false,
                        });
                      }}
                    />
                  </Spin>
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
