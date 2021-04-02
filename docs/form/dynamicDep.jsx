import React from 'react';
import { Form } from 'sula';

export default class DynamicDepDemo extends React.Component {
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
              type: 'dynamicdepfieldcomp',
              props: {
                fields: [
                  {
                    name: 'first',
                    // rules: [{ required: true, message: 'Missing first name' }],
                    field: 'input',
                  },
                  {
                    name: 'last',
                    // rules: [{ required: true, message: 'Missing last name' }],
                    field: 'input',
                    dependency: {
                      value: {
                        relates: ['first'],
                        inputs: [['95']],
                        output: '98',
                        defaultOutput: 'please type 95',
                      },
                    },
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
                  console.log('getFieldsValue', this.ref.current.getFieldsValue());
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
