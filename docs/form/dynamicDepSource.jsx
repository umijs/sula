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
          {
            name: 'something',
            label: '一些信息',
            isList: true,
            type: 'dynamicdepfieldcomp',
            props: {
              fields: [
                {
                  name: 'q',
                  rules: [{ required: true, message: 'type something' }],
                  field: 'input',
                },
                {
                  name: 'fruilt',
                  label: '水果',
                  field: {
                    type: 'select',
                    props: {
                      placeholder: '请输入',
                      style: {
                        width: 200,
                      }
                    },
                  },
                  remoteSource: {
                    init: false,
                    url: 'https://run.mocky.io/v3/a435a830-a2b3-49ce-bc6b-40298ba57bcb',
                    method: 'GET',
                    converter: ({ data }) => {
                      return data.map((item) => {
                        return {
                          text: item.text,
                          value: item.value,
                        };
                      });
                    },
                  },
                  dependency: {
                    source: {
                      relates: ['q'],
                      defaultOutput: [],
                    },
                  },
                },
                {
                  name: 'goods',
                  label: '货物',
                  initialValue: 'oil',
                  initialSource: [{
                    text: '石油',
                    value: 'oil',
                  }, {
                    text: '煤',
                    value: 'coal',
                  }],
                  field: {
                    type: 'select',
                    props: {
                      placeholder: '请输入',
                      style: {
                        width: 200,
                      }
                    },
                  },
                }
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
