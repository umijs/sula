import React from 'react';
import { CreateForm } from 'sula';

export default class BasicDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <CreateForm
          initialValues={{
            gender: 'male',
          }}
          fields={[
            {
              name: 'name',
              label: '姓名',
              field: 'input',
              rules: [
                {
                  required: true,
                },
              ],
            },
            {
              name: 'gender',
              label: '性别',
              field: 'radiogroup',
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
          actionsRender={[
            {
              type: 'button',
              props: {
                children: 'Custom',
              },
              action: [
                'validateFields',
                {
                  url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
                  method: 'POST',
                },
                () => console.log('Finished!!!')
              ],
            },
          ]}
        />
      </div>
    );
  }
}
