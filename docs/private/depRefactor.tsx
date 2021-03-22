import React from 'react';
import { Form } from 'sula';

export default () => {
  return (
    <Form
      fields={[
        {
          name: 'a',
          label: 'A',
          field: 'input',
        },
        {
          name: 'b',
          label: 'B',
          field: 'input',
          dependency: {
            visible: {
              relates: ['a'],
              inputs: [['1']],
              output: false,
              defaultOutput: true,
            },
          },
        },
        {
          name: 'c',
          label: 'C',
          field: 'input',
          dependency: {
            disabled: {
              relates: ['a'],
              inputs: [['1']],
              output: true,
              defaultOutput: false,
            },
          },
        },
      ]}
    />
  );
};
