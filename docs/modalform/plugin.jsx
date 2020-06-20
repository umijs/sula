/**
 * title: 插件使用
 * desc: |
 *   ModalForm 大部分场景作为行为插件使用，另外还有 `modalOk` 与 `modalCancel` 两个行为插件可以与actionsRender配合使用
 */

import React from 'react';
import { Table } from 'sula';

export default class PluginDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <Table
        initialDataSource={[{ id: 0 }]}
        rowKey="id"
        columns={[
          {
            title: '操作',
            key: 'op',
            render: [
              {
                type: 'button',
                props: {
                  children: '弹窗',
                },
                action: [
                  {
                    type: 'drawerform',
                    title: '弹窗表单',
                    fields: [
                      {
                        name: 'input1',
                        label: 'Input1',
                        field: 'input',
                      },
                    ],
                    submitButtonProps: {
                      icon: 'appstore',
                    },
                    submit: {
                      url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
                      method: 'POST',
                    },
                  },
                  (ctx) => {
                    console.log(ctx.result);
                  },
                ],
              },
              {
                type: 'button',
                props: {
                  children: '自定义操作按钮',
                },
                action: [
                  {
                    type: 'modalform',
                    title: '弹窗表单',
                    fields: [
                      {
                        name: 'input1',
                        label: 'Input1',
                        field: 'input',
                      },
                    ],
                    actionsRender: [
                      {
                        type: 'button',
                        props: {
                          children: '自定义提交',
                          type: 'primary',
                        },
                        action: (ctx) => {
                          ctx.form.validateFields().then((values) => {
                            // 必须这样设置才能在后面的ctx.result.$sumbit拿到结果
                            ctx.result = values;
                            ctx.modal.modalOk(ctx);
                          });
                        },
                      },
                      {
                        type: 'button',
                        props: {
                          children: '自定义提交2',
                          type: 'primary',
                        },
                        action: ['validateFields', 'modalok'],
                      },
                      {
                        type: 'button',
                        props: {
                          children: '自定义返回',
                        },
                        action: (ctx) => {
                          ctx.modal.modalCancel();
                        },
                      },
                      {
                        type: 'button',
                        props: {
                          children: '自定义返回2',
                        },
                        action: 'modalcancel',
                      },
                    ],
                  },
                  (ctx) => {
                    // 打印弹窗给的结果
                    console.log(ctx.result);
                  },
                ],
              },
            ],
          },
        ]}
      />
    );
  }
}
