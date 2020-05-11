import React from 'react';
import { Form } from '..';
import { Button } from 'antd';

export default class Api extends React.Component {
  formRef = React.createRef();

  render() {
    return (
      <div>
        <Button
          onClick={() => {
            this.formRef.current.setFieldValue('input1', 'hello sula');
          }}
        >
          setFieldValue
        </Button>{' '}
        <Button
          type="primary"
          onClick={() => {
            this.formRef.current.setFieldsValue({
              input1: 'input1',
              input2: 'input2',
              input3: 'input3',
            });
          }}
        >
          setFieldsValue
        </Button>{' '}
        <Button
          onClick={() => {
            this.formRef.current.validateFields().then((values) => {
              console.log('values: ', values);
            });
          }}
        >
          validateFields
        </Button>{' '}
        <Button
          type="primary"
          onClick={() => {
            this.formRef.current.setFieldDisabled('input1', true);
          }}
        >
          setFieldDisabled
        </Button>{' '}
        <Button
          onClick={() => {
            this.formRef.current.setFieldSource('select1', [
              {
                text: 'Apple 🍎',
                value: 'apple',
              },
            ]);
          }}
        >
          setFieldSource
        </Button>{' '}
        <br />
        <br />
        <Form
          remoteValues={{
            url: 'https://randomuser.me/api/',
            method: 'GET',
            converter({ data }) {
              return {
                input1: 'fake 1'
              }
            },
          }}
          ref={this.formRef}
          itemLayout={{
            cols: 3, // 不写就是1列
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
              rules: [{
                required: true,
              }]
            },
            {
              name: 'select1',
              label: 'select1',
              field: 'select',
              initialSource: [
                {
                  text: 'A',
                  value: 'a',
                },
              ],
            },
            {
              name: 'select2',
              label: 'select2',
              field: 'select',
              remoteSource: {
                url: 'https://randomuser.me/api',
                method: 'GET',
                params: {
                  results: 5,
                },
                converter({ data }) {
                  return data.results.map((item) => {
                    const { name, email, phone } = item;
                    return {
                      text: `${name.title} ${name.first} ${name.last}`,
                      value: `${email}-${phone}`,
                    };
                  });
                },
              },
            },
          ]}
        ></Form>
      </div>
    );
  }
}
