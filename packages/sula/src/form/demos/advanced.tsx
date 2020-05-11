import React from 'react';
import { Form } from '..';
import { Button, Input } from 'antd';

export default class Advanced extends React.Component {
  render() {
    return (
      <Form
        onFinish={(values) => {
          console.log('Success:', values);
        }}
        container={{
          type: 'card',
          props: {
            title: 'Head',
          },
        }}
        fields={[
          {
            name: 'input1',
            label: 'input1',
            field: 'input',
          },
          {
            label: 'InputGroup1',
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
                    style: { width: '50%' },
                  },
                },
              },
              {
                name: 'province',
                noStyle: true,
                field: {
                  type: 'input',
                  props: {
                    style: { width: '50%' },
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
                htmlType: 'submit',
                type: 'primary',
                children: 'submit',
              },
            },
          },
        ]}
      ></Form>
    );
  }
}
