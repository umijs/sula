import React from 'react';
import { Form } from '..';
import { Button } from 'antd';

export default class Basic extends React.Component {
  render() {
    return (
      <Form
        itemLayout={{
          cols: {
            xxl: 4,
            xl: 3,
            lg: 2,
            md: 2,
            sm: 1,
            xs: 1,
          },
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
            name: 'input2',
            label: 'input2',
            field: 'input',
          },
          {
            name: 'input3',
            label: 'input3',
            field: 'input',
          },
          {
            label: 'text',
            render: {
              type: 'text',
              props: {
                type: 'danger',
                children: 'i am text',
              },
            },
          },
          {
            label: 'inline',
            render: () => {
              return <Button>hello</Button>;
            },
          },
        ]}
      ></Form>
    );
  }
}
