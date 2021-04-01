import React from 'react';
import { Form } from 'sula';

export default class LayoutDemo extends React.Component {
  render() {
    return (
      <Form
        itemLayout={{ span: 8, gutter: 0 }}
        fields={[
          {
            name: 'input1',
            label: 'Input1',
            field: 'input',
          },
          {
            name: 'input2',
            label: 'Input2',
            field: 'input',
          },
          {
            name: 'input3',
            label: 'Input3',
            field: 'input',
          },
          {
            name: 'input4',
            label: 'Input4',
            field: 'input',
          },
          {
            name: 'input5',
            label: 'Input2',
            field: 'textarea',
            itemLayout: {
              span: 16,
              labelCol: {
                span: 4,
              },
              wrapperCol: {
                span: 20,
              }
            },
          },
        ]}
      />
    );
  }
}
