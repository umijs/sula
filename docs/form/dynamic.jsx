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

export default class DynamicDemo extends React.Component {
  ref = React.createRef();

  componentDidMount() {}

  render() {
    return (
      <Form
        ref={this.ref}
        layout="vertical"
        initialValues={{ radiogroup: 'peach' }}
        onFinish={(values) => {
          console.log('Success:', values);
        }}
        fields={[
          { name: 'input', label: '姓名', field: 'input' },
          {
            name: 'users',
            label: '动态信息',
            isList: true,
            field: {
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
          {
            colon: false,
            render: {
              type: 'button',
              props: {
                onClick: () => {
                  this.ref.current.validateFields().then((values) => {
                    console.log('表单值: ', values);
                  });
                },
                children: 'api提交',
              },
            },
          },
        ]}
      />
    );
  }
}
