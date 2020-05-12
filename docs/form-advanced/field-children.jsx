/**
 * title: children 与 childrenContainer 的组合
 * desc: |
 *   实现 input.group 的场景
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
              label: 'Nation',
              childrenContainer: {
                type: 'inputgroup',
                props: {
                  compact: true,
                },
              },
              children: [
                {
                  name: 'country',
                  noStyle: true,
                  field: {
                    type: 'input',
                    props: {
                      placeholder: 'country',
                      style: { width: '40%' },
                    },
                  },
                },
                {
                  name: 'province',
                  noStyle: true,
                  field: {
                    type: 'input',
                    props: {
                      placeholder: 'province',
                      style: { width: '60%' },
                    },
                  },
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
