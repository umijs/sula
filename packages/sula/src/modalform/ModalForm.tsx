import React from 'react';
import { Modal } from 'antd';
import assign from 'lodash/assign';
import LocaleReceiver from '../localereceiver';
import { STOP } from '../rope';
import { Form, FormAction, FieldGroup } from '../form';
import { renderActions } from '../template-create-form/CreateForm';

export default class ModalForm extends React.Component {
  render() {
    const { modal, visible } = this.props;

    const { props = {} } = modal;

    // 存在 type 说明是插件场景
    const { type, title, width, ...formProps } = props;

    const { actionsRender, fields, container, ...restFormProps } = formProps;

    return (
      <LocaleReceiver>
        {(locale) => {
          return (
            <Form {...restFormProps}>
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
                          },
                          formProps,
                        ),
                        locale,
                      )
                    }
                  /> : null
                }
              >
                <FieldGroup container={container} fields={fields} />
              </Modal>
            </Form>
          );
        }}
      </LocaleReceiver>
    );
  }
}
