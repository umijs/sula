import React from 'react';
import { Button } from 'antd';
import { Form, Field, FieldGroup } from '..';

export default class Basic extends React.Component {
  formRef = React.createRef();

  render() {
    return (
      <div>
        <Form ref={this.formRef}>
          <Field name="input" label="input" field="input" />
          <FieldGroup
            name="group1"
            initialVisible={false}
            fields={[
              {
                name: 'input1',
                label: 'input1',
                field: 'input',
              },
            ]}
            dependency={{
              visible: {
                relates: [['input']],
                inputs: [['show']],
                output: true,
                defaultOutput: false,
              },
            }}
          />
          <FieldGroup
            name="group2"
            container={{ type: 'card', props: { title: 'Head' } }}
            dependency={{
              visible: {
                relates: [['input']],
                inputs: [['show']],
                output: false,
                defaultOutput: true,
              },
            }}
          >
            <Field name="input2" label="input2" field="input" />
          </FieldGroup>
        </Form>
        <Button
          type="primary"
          onClick={() => {
            this.formRef.current.setFieldVisible('group1', true);
            this.formRef.current.setFieldVisible('group2', true);
          }}
        >
          show all
        </Button>
      </div>
    );
  }
}
