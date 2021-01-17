import React from 'react';
import { Form } from 'sula';

const initialSource = [
  {
    text: '苹果 🍎',
    value: 'apple',
  },
  {
    text: '桃子 🍑',
    value: 'peach',
  },
];

const cascaderSource = [
  {
    value: 'fruits',
    text: '水果',
    children: initialSource,
  },
];

export default class DynamicDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <Form
        layout="vertical"
        initialValues={{ radiogroup: 'peach' }}
        onFinish={(values) => {
          console.log('Success:', values);
        }}
        fields={[
          { name: 'input', label: 'input', field: 'input' },
          {
            name: 'users',
            isList: true,
            type: 'dynamicfieldcomp',
            props: {
              fields: [
                {
                  name: 'first',
                  rules: [{ required: true, message: 'Missing first name' }],
                  field: 'input',
                },
                {
                  name: 'last',
                  rules: [{ required: true, message: 'Missing last name' }],
                  field: 'input',
                },
              ],
            },
          },
          {
            label: ' ',
            colon: false,
            render: {
              type: 'button',
              props: {
                htmlType: 'submit',
                type: 'primary',
                children: 'submit',
              },
            },
          },
        ]}
      />
    );
  }
}
