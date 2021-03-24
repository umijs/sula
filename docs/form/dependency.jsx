/**
 * title: Dependency
 * desc: | 
 *   支持四种关联关系：
 *   - source
 *   - value
 *   - visible
 *   - disabled
 * 
 *   可以通过 `type` 实现自定义关联，另外 `setFieldValue` 和 `setFieldsValue` 同样可以触发关联
 */

import React from 'react';
import { Form } from 'sula';
import { Button } from 'antd';


export default class DependencyDemo extends React.Component {
  formRef = React.createRef();

  componentDidMount() {}

  render() {
    return (
      <div>
        <Button
          onClick={() => {
            this.formRef.current.setFieldValue('input1', '95');
          }}
        >
          setFieldValue
        </Button>{' '}
        <Button
          type="primary"
          onClick={() => {
            this.formRef.current.setFieldsValue({
              input1: '9527',
              input2: 'input2',
              input3: 'input3',
            });
          }}
        >
          setFieldsValue
        </Button>{' '}
        <br />
        <Form
          ref={this.formRef}
          fields={[
            {
              name: 'input1',
              label: 'please input 95 then 9527',
              field: 'input',
            },
            {
              name: 'input2',
              label: 'input2',
              field: 'input',
              dependency: {
                value: {
                  relates: ['input1'],
                  inputs: [['95']],
                  output: '95',
                  defaultOutput: 'please input something',
                },
              },
            },
            {
              name: 'input3',
              label: 'input3',
              field: 'input',
              dependency: {
                value: {
                  relates: ['input1'],
                  type: (ctx) => {
                    if (ctx.values[0] === '9527') {
                      ctx.form.setFieldValue(ctx.name, '9527');
                    } 
                  },
                },
              },
            },
            {
              name: 'select1',
              label: 'Select1',
              field: 'select',
              dependency: {
                source: {
                  relates: ['input1'],
                  inputs: [['95']],
                  output: [
                    {
                      text: '苹果',
                      value: 'apple'
                    },
                    {
                      text: '桃子',
                      value: 'peach'
                    }
                  ],
                  defaultOutput: [],
                },
              },
            },
          ]}
        />
      </div>
    );
  }
}
