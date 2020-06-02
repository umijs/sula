import React from 'react';
import { Modal, Spin } from 'antd';
import assign from 'lodash/assign';
import LocaleReceiver from '../localereceiver';
import { STOP } from '../rope';
import { Form, FormAction, FieldGroup } from '../form';
import { renderActions } from '../template-create-form/CreateForm';

export default class ModalForm extends React.Component {
  state = {
    loading: false,
  }

  render() {
    const { loading } = this.state;

    const { modal, visible } = this.props;

    const { props = {} } = modal;

    // 存在 type 说明是插件场景
    const { type, title, width, ...formProps } = props;

    const { actionsRender, fields, container, submit, ...restFormProps } = formProps;

    return (
      <LocaleReceiver>
        {(locale) => {
          return (
            <Form {...restFormProps} onRemoteValuesStart={() => {
              this.setState({
                loading: true,
              })
            }} onRemoteValuesEnd={() => {
              this.setState({
                loading: false,
              })
            }} >
              <Modal
                title={title}
                width={width}
                visible={visible}
                onCancel={() => {
                  if (type) {
                    modal.close(STOP); // 终止行为链
                  } else {
                    modal.close();
                  }
                }}
                footer={visible ?
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
                  /> : null
                }
              >
                <Spin spinning={loading}>
                  <FieldGroup container={container} fields={fields} />
                </Spin>
              </Modal>
            </Form>
          );
        }}
      </LocaleReceiver>
    );
  }
}
