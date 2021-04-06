import React from 'react';
import { Form } from 'sula';

export default class Editable2Demo extends React.Component {
  ref = React.createRef();
  state = {
    mode: 'create',
  };
  render() {
    const { mode } = this.state;
    return (
      <div>
        <button
          onClick={() => {
            this.setState({
              mode: 'create',
            });
          }}
        >
          create
        </button>
        <button
          onClick={() => {
            this.setState({
              mode: 'edit',
            });
          }}
        >
          edit
        </button>
        <button
          onClick={() => {
            this.setState({
              mode: 'view',
            });
          }}
        >
          view
        </button>
        <Form
          initialValues={
            mode === 'create'
              ? {}
              : {
                  school: '大学',
                  students: [
                    { province: 'zhejiang', city: 'hangzhou', address: 'abc胡同' },
                    { province: 'hubei', city: 'wuhan' },
                  ],
                }
          }
          mode={mode}
          key={mode}
          ref={this.ref}
          layout="vertical"
          fields={[
            {
              name: 'school',
              label: '学校',
              field: 'input',
            },
            {
              name: 'students',
              isList: true,
              label: '学生信息',
              field: {
                type: 'editable',
                props: {
                  xxx: 'yyy',
                  fields: [
                    {
                      width: 150,
                      name: 'province',
                      label: '省份',
                      initialSource: [
                        {
                          text: '浙江',
                          value: 'zhejiang',
                        },
                        {
                          text: '江苏',
                          value: 'jiangsu',
                        },
                        ,
                        {
                          text: '湖北',
                          value: 'hubei',
                        },
                      ],
                      field: {
                        type: 'select',
                        props: {
                          style: {
                            width: '100%',
                          },
                        },
                      },
                    },
                    {
                      width: 150,
                      name: 'city',
                      label: '城市',
                      field: 'select',
                      dependency: {
                        source: {
                          relates: ['province'],
                          defaultOutput: [],
                          type: (ctx) => {
                            console.log(ctx.name, '请求');
                            const value = ctx.values[0];
                            
                            let source;
                            if (value === 'zhejiang') {
                              source = [
                                { text: '杭州', value: 'hangzhou' },
                                { text: '宁波', value: 'ningbo' },
                              ];
                            } else if (value === 'jiangsu') {
                              source = [
                                { text: '南京', value: 'nanjing' },
                                { text: '苏州', value: 'suzhou' },
                              ];
                            } else if (value === 'hubei') {
                              source = [
                                { text: '武汉', value: 'wuhan' },
                                { text: '荆州', value: 'jiangzhou' },
                              ];
                            }

                            source && ctx.form.setFieldSource(ctx.name, source);
                          },
                        },
                      },
                    },
                    {
                      width: 150,
                      name: 'address',
                      label: '详细地址',
                      field: 'input',
                    },
                  ],
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
      </div>
    );
  }
}
