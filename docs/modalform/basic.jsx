/**
 * title: 基本使用
 * desc: |
 *   ModalForm 可以单独作为组件使用
 *   - type: `modal | drawer`
 */

import React from 'react';
import { Button } from 'antd';
import { ModalForm } from 'sula';

export default () => {
  const ref = React.useRef(null);
  return (
    <div>
      <Button
        onClick={() => {
          ref.current
            .show({
              title: '弹窗表单',
              fields: [
                {
                  name: 'input1',
                  label: 'Input1',
                  field: 'input',
                },
              ],
              initialValues: {
                nihao: 'cat',
                input1: '未知'
              },
              preserveInitialValues: true,
              submitButtonProps: {
                icon: 'appstore',
              },
              submit: {
                url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
                method: 'POST',
              },
            })
            .then((result) => {
              console.log('result', result);
            });
        }}
      >
        抽屉表单
      </Button>
      <Button
        onClick={() => {
          ref.current
            .show({
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
                      ctx.modal.modalOk(values);
                    });
                  },
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
              ],
            })
            .then((result) => {
              console.log('result', result);
            });
        }}
      >
        自定义操作按钮
      </Button>
      <ModalForm type="drawer" ref={ref} />
    </div>
  );
};
