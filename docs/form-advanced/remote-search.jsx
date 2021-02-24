/**
 * title: 远程搜索
 */

import React from 'react';
import { Form } from 'sula';

export default class RemoteSearchDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <Form
          fields={[
            {
              name: 'product',
              label: '商品',
              field: {
                type: 'customremotesearch',
                props: {
                  placeholder: '请搜索商品',
                }
              },
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
