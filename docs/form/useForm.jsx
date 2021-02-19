import React from 'react';
import { Button } from 'antd';
import { Form, useForm } from 'sula';

const UseFormDemo = () => {
  const [form] = useForm();
  return (
    <div>
      <Button
        onClick={() => {
          form.validateFields().then((values) => {
            console.log('values: ', values);
          });
        }}
      >
        提交表单
      </Button>
      <Form
        initialValues={{ radiogroup: 'peach' }}
        form={form}
        fields={[
          { name: 'input', label: 'input', field: 'input' },
          {
            name: 'inputnumber',
            label: 'inputnumber',
            field: {
              type: 'inputnumber',
              props: {
                style: {
                  width: 300,
                },
              },
            },
          },
        ]}
      />
    </div>
  );
};

export default UseFormDemo;
