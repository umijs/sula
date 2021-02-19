import React from 'react';
import { Button } from 'antd';
import { Form, Field, FormAction, FieldGroup, FormInstance } from 'sula';

export default class CreateRefDemo extends React.Component {
  formRef = React.createRef<FormInstance>();
  
  render() {
    return (
      <Form ref={this.formRef}>
        <FieldGroup>
          <Field field="input" name="name" label="姓名" />
          <Field field="inputnumber" name="ages" label="年龄" />
        </FieldGroup>
        <FormAction>
          <Button
            onClick={() => {
              this.formRef.current!.validateFields().then((values) => {
                console.log('values: ', values);
              });
            }}
          >
            提交
          </Button>
        </FormAction>
      </Form>
    );
  }
};
