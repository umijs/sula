import React from 'react';
import { Form } from 'sula';


export default class ValidatorDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <Form
        fields={[
          {
            name: 'input1',
            label: 'Input1',
            field: {
              type: 'input',
            },
            rules: [{
              required: true,
              message: 'input1 必填'
            }]
          },
          {
            name: 'input2',
            label: 'Input2',
            field: {
              type: 'input',
            },
            rules: [{ // 自定义校验
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