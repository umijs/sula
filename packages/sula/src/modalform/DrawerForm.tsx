import React from 'react';
import { Drawer, Spin } from 'antd';
import assign from 'lodash/assign';
import LocaleReceiver from '../localereceiver';
import { STOP } from '../rope';
import { Form, FormAction, FieldGroup } from '../form';
import { renderActions } from '../template-create-form/CreateForm';

export default class DrawerForm extends React.Component {
  state = {
    loading: false,
  };
  render() {
    const { modal, visible } = this.props;

    const { loading } = this.state;

    const { props = {} } = modal;

    // 存在 type 说明是插件场景
    const { type, title, width = 550, ...formProps } = props;

    const { actionsRender, fields, container, submit, submitButtonProps, backButtonProps, ...restFormProps } = formProps;

    return (
      <LocaleReceiver>
        {(locale) => {
          return (
            <Form
              {...restFormProps}
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
            >
              <Drawer
                title={title}
                width={width}
                visible={visible}
                onClose={() => {
                  if (type) {
                    modal.close(STOP); // 终止行为链
                  } else {
                    modal.close();
                  }
                }}
                footer={
                  visible ? (
                    <FormAction
                      actionsPosition="right"
                      actionsRender={
                        actionsRender ||
                        renderActions(
                          assign(
                            {
                              back: () => {
                                return modal.close(STOP);
                              },
                              submitBack: (ctx) => {
                                const {
                                  results,
                                  result,
                                } = ctx;
                                const finalResults = assign({'$submit': result}, results);
                                return modal.close(finalResults);
                              }
                            },
                            formProps,
                          ),
                          locale,
                        )
                      }
                    />
                  ) : null
                }
              >
                <Spin spinning={loading}>
                  <FieldGroup container={container} fields={fields} />
                </Spin>
              </Drawer>
            </Form>
          );
        }}
      </LocaleReceiver>
    );
  }
}
