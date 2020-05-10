/**
 * title: 值收集
 * desc: |
 *   collect: false 则不参与值收集
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
              name: 'name',
              label: '姓名',
              field: 'input',
              collect: false,
            },
            {
              name: 'gender',
              label: '性别',
              field: 'checkboxgroup',
              initialSource: [
                {
                  text: '男',
                  value: 'male',
                },
                {
                  text: '女',
                  value: 'female',
                },
              ],
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
