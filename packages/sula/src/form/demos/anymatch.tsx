import React from 'react';
import { Form } from '..';
import { Button, Space } from 'antd';

export default class Api extends React.Component {
  formRef = React.createRef();

  render() {
    return (
      <div>
        <Form
          ref={this.formRef}
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
            },
            {
              name: 'input3',
              label: 'input3',
              field: 'input',
              initialVisible: false,
              dependency: {
                visible: {
                  relates: ['input1', 'input2'],
                  cases: [
                    {
                      inputs: ['*', ['a', 'b']],
                      ignores: [['', undefined]],
                      output: true,
                    },
                    {
                      inputs: [['show'], '*'],
                      output: true,
                    },
                  ],
                  defaultOutput: false,
                },
              },
            },
            {
              name: 'input4',
              label: 'input4',
              field: 'input',
              initialVisible: false,
              dependency: {
                visible: {
                  relates: ['input3'],
                  inputs: ['*'],
                  ignores: [['']],
                  output: true,
                  defaultOutput: false,
                },
              },
            },
          ]}
        ></Form>
        <Space>
          <Button
            onClick={() => {
              this.formRef.current.setFieldValue('input1', undefined);
            }}
          >
            clear input1 value
          </Button>
          <Button
            type="primary"
            onClick={() => {
              const values = this.formRef.current.getFieldsValue();
              console.log('values:', values);
            }}
          >
            get values
          </Button>
        </Space>
      </div>
    );
  }
}
