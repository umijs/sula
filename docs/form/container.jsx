import React from 'react';
import { Form } from 'sula';

export default class FieldContainer extends React.Component {
  render() {
    return (
      <Form
        container={{
          type: 'card',
          props: {
            title: '容器',
          },
        }}
        fields={[
          {
            label: '输入框1',
            name: 'input1',
            field: 'input',
          },
          {
            label: '输入框2',
            name: 'input2',
            field: 'input',
          },
          {
            container: {
              type: 'card',
              props: {
                title: '嵌套容器',
                type: 'inner',
              },
            },
            initialVisible: false,
            dependency: {
              visible: {
                relates: ['input1', 'input2'],
                inputs: [['95'], ['27']],
                output: true,
                defaultOutput: false,
              }
            },
            fields: [
              {
                label: '输入框3',
                name: 'input3',
                field: 'input',
              },
            ],
          },
        ]}
      />
    );
  }
}
