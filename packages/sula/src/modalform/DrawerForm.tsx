import React from 'react';
import { Drawer } from 'antd';
import assign from 'lodash/assign';
import LocaleReceiver from '../localereceiver';
import { STOP } from '../rope';
import Form, { FormAction, FieldGroup } from '../form';
import { renderActions } from '../template-create-form/CreateForm';

export default class DrawerForm extends React.Component {
  render() {
    const { modal, visible } = this.props;

    const { props = {} } = modal;

    // 存在 type 说明是插件场景
    const { type, title, width = 550, ...formProps } = props;

    const { actionsRender, fields, ...restFormProps } = formProps;

    return (
      <LocaleReceiver>
        {(locale) => {
          return (
            <Form {...restFormProps}>
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
                              back: (ctx) => {
                                return modal.close(ctx.result);
                              },
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
                <FieldGroup fields={fields} />
              </Drawer>
            </Form>
          );
        }}
      </LocaleReceiver>
    );
  }
}
