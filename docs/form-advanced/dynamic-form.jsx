/**
 * title: 动态渲染表单
 * desc: |
 *   确保 name 是不同是的
 */

import React from 'react';
import { Form } from 'sula';
import { Button } from 'antd';

export default class ValueCollectDemo extends React.Component {
  state = {
    templates: [],
  }

  componentDidMount() {}

  render() {
    const { templates } = this.state;
    return (
      <div>
        <Button onClick={() => {
          this.setState({
            templates: [{
              name: 'peach',
              label: '桃子',
              field: 'input'
            }, {
              name: 'apple',
              label: '苹果',
              field: 'input'
            }]
          })
        }}>模板1</Button>
        <Button onClick={() => {
          this.setState({
            templates: [{
              name: 'vegetable',
              label: '蔬菜',
              field: 'select',
              initialSource: [{
                text: '土豆',
                value: 'potato',
              }]
            }]
          })
        }}>模板2</Button>
        <Form
          fields={[
            ...templates,
            {
              label: ' ',
              colon: false,
              render: {
                type: 'button',
                props: {
                  type: 'primary',
                  children: 'submit',
                },
                action({form}) {
                  form.validateFields().then(values => {
                    console.log('values', values);
                  })
                }
              },
            },
          ]}
        />
      </div>
    );
  }
}
