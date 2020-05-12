/**
 * title: 值收集
 * desc: |
 *   collect: false 则不参与值收集，可以使用它关联另一个组件而不需要获取它的值
 */

import React from 'react';
import { Form } from 'sula';

export default class ValueCollectDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <Form
          fields={[
            {
              name: 'category',
              label: '分类',
              field: 'select',
              initialSource: [
                {
                  text: '水果',
                  value: 'fruites',
                },
                {
                  text: '蔬菜',
                  value: 'vegetables',
                },
              ],
              collect: false,
            },
            {
              name: 'order',
              label: '菜单',
              field: 'select',
              dependency: {
                source: {
                  relates: ['category'],
                  type: (ctx) => {
                    if(ctx.values[0] === 'fruites') {
                      ctx.form.setFieldSource(ctx.name, [{text: '苹果 🍎', value: 'apple'}]);
                    } else {
                      ctx.form.setFieldSource(ctx.name, [{text: '西红柿 🍅', value: 'tomato'}]);
                    }
                  }
                }
              }
            },
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
