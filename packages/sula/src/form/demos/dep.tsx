import React from 'react';
import { Form } from '..';
import { Button } from 'antd';

export default class Api extends React.Component {
  formRef = React.createRef();

  render() {
    return (
      <div>
        <Button
          onClick={() => {
            this.formRef.current.setFieldValue('input1', 'hello sula');
          }}
        >
          setFieldValue
        </Button>{' '}
        <Button
          type="primary"
          onClick={() => {
            this.formRef.current.setFieldsValue({
              input1: 'input1',
              input2: 'input2',
              input3: 'input3',
            });
          }}
        >
          setFieldsValue
        </Button>{' '}
        <Button
          onClick={() => {
            this.formRef.current.validateFields().then((values) => {
              console.log('values: ', values);
            });
          }}
        >
          validateFields
        </Button>{' '}
        <Button
          type="primary"
          onClick={() => {
            this.formRef.current.setFieldDisabled('input1', true);
          }}
        >
          setFieldDisabled
        </Button>{' '}
        <Button
          onClick={() => {
            this.formRef.current.setFieldSource('select1', [
              {
                text: 'Apple 🍎',
                value: 'apple',
              },
            ]);
          }}
        >
          setFieldSource
        </Button>{' '}
        <br />
        <br />
        <Form
          ref={this.formRef}
          itemLayout={{
            cols: 3, // 不写就是1列
          }}
          fields={[
            {
              name: 'input1',
              label: 'input1',
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
                  defaultOutput: '输入点什么试试',
                }
              }
            },
            {
              name: 'input3',
              label: 'input3',
              field: 'input',
              dependency: {
                value: {
                  relates: ['input1'],
                  type: (ctx) => {
                    if(ctx.values[0] === '95') {
                      ctx.form.setFieldValue(ctx.name, '9527')
                    }
                  }
                }
              }
            },
            {
              name: 'select1',
              label: 'select1',
              field: 'select',
              initialSource: [
                {
                  text: 'A',
                  value: 'a',
                },
              ],
            },
          ]}
        ></Form>
      </div>
    );
  }
}
