import React from 'react';
import { CreateForm } from 'sula';

export default class BasicDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <CreateForm
          initialValues={{
            gender: ['male'],
          }}
          fields={[
            {
              name: 'name',
              label: '姓名',
              field: 'input',
            },
            {
              name: 'gender',
              label: '性别',
              field: 'checkboxgroup',
              initialSource: [
                {
                  text: '男',
                  value: 'male',
                },
                {
                  text: '女',
                  value: 'female',
                },
              ],
            },
          ]}
          submit={{
            url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
            method: 'POST'
          }}
        />
      </div>
    );
  }
}
