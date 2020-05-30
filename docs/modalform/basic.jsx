/**
 * title: 基本使用
 * desc: |
 *   ModalForm 大部分是作为`行为插件`来使用的
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
          ref.current.show({
            title: '弹窗表单',
            fields: [
              {
                name: 'input1',
                label: 'Input1',
                field: 'input',
              },
            ],
            submit: {
              url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
              method: 'POST',
            },
          });
        }}
      >
        show
      </Button>
      <ModalForm type="drawer" ref={ref} />
    </div>
  );
};
