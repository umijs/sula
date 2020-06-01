import React from 'react';
import { Form } from 'sula';


export default class ValidatorDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <Form
        fields={[
          {
            name: 'input',
            label: 'Input',
            field: {
              type: 'input',
            },
            rules: [{
              validator(ctx) {
                return new Promise((resolve, reject) => {
                  if(ctx.value === 'sula') {
                    resolve();
                  } else {
                    reject(new Error('请输入sula'));
                  }
                })
              }
            }]
          }
        ]}
      />
    )
  }
}