import React from 'react';
import Form, { Field, FieldGroup } from '..';

export default class Basic extends React.Component {
  render() {
    return (
      <div>
      <Form>
        <FieldGroup
          container={{ type: 'card', props: { title: 'Head' } }}
          fields={[
            {
              name: 'input1',
              label: 'input1',
              field: 'input',
            },
          ]}
        />
      </Form>
      <Form>
        <FieldGroup
          container={{ type: 'card', props: { title: 'Head' } }}
        >
          <Field name="input2" label="input2" field="input" />
        </FieldGroup>
      </Form>
      </div>
    );
  }
}
