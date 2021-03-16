import * as React from 'react';
import { Form as NextForm, Input } from '@alifd/next';
import Form, { useForm } from '../index';

const FormItem = NextForm.Item;

const Demo = () => {
  const [form] = useForm();
  console.log('form: ', form);
  return (
    <Form form={form}>
      <FormItem label="用户名">
        <Input name="username" />
      </FormItem>
    </Form>
  );
};

export default Demo;
