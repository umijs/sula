import React from 'react';
import { Modal, Spin, Drawer } from 'antd';
import assign from 'lodash/assign';
import isFunction from 'lodash/isFunction';
import LocaleReceiver from '../localereceiver';
import { STOP } from '../rope';
import { Form, FormAction, FieldGroup, FormProps } from '../form';
import { renderActions } from '../template-create-form/CreateForm';

export interface ModalFormProps extends FormProps {
  isDrawer?: boolean;
  visible: boolean;
  modal?: any;
  title: string;
  width?: number;
  preserveInitialValues?: boolean;
}

export default class ModalForm extends React.Component<ModalFormProps> {
  state = {
    loading: false,
  };

  render() {
    const { loading } = this.state;

    const { modal, visible, isDrawer } = this.props;

    const { props = {} } = modal;

    // 存在 type 说明是插件场景
    const { type, title, width = isDrawer ? 550 : undefined, props: modalProps = {}, preserveInitialValues, ...formProps } = props;

    const {
      actionsRender,
      fields,
      container,
      submit,
      submitButtonProps,
      backButtonProps,
      ctxGetter,
      ...restFormProps
    } = formProps;

    const ModalClass = isDrawer ? Drawer : Modal;

    const modalCtxGetter = () => {
      const modalCancel = () => {
        if (type) {
          modal.close(STOP);
        } else {
          modal.close();
        }
      };

      const modalOk = (ctx) => {
        if (type) {
          const { results, result } = ctx;
          const finalResults = assign({ $submit: result }, results);
          return modal.close(finalResults);
        } else {
          modal.close(ctx);
        }
      };

      return {
        // 插件模式且自定义renderActions 或者 非插件模式
        modal: {
          modalCancel,
          modalOk,
        },
      };
    };

    let finalCtxGetter;

    if (ctxGetter) {
      finalCtxGetter = {
        ...(isFunction(ctxGetter) ? { ctxGetter } : ctxGetter),
        modal: modalCtxGetter,
      };
    } else {
      finalCtxGetter = modalCtxGetter;
    }

    return (
      <LocaleReceiver>
        {(locale) => {
          return (
            <Form
              {...restFormProps}
              ctxGetter={finalCtxGetter}
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
              <ModalClass
                {...modalProps}
                title={title}
                width={width}
                visible={visible}
                {...{
                  [isDrawer ? 'onClose' : 'onCancel']: () => {
                    if (type) {
                      modal.close(STOP); // 终止行为链
                    } else {
                      modal.close();
                    }
                  },
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
                              submitBack: modalCtxGetter().modal.modalOk,
                              back: modalCtxGetter().modal.modalCancel,
                              preserveInitialValues,
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
              </ModalClass>
            </Form>
          );
        }}
      </LocaleReceiver>
    );
  }
}
