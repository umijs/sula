import React from 'react';
import { CreateForm, request } from 'sula';

export default class BasicDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <CreateForm
          mode="edit"
          initialValues={{
            gender: 'male',
          }}
          remoteValues={() => {
            return request({
              url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
              method: 'POST',
            }).then((data) => {
              return {
                name: data.hello,
                gender: 'female'
              };
            });
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
          submit={(ctx) => {
            const { result } = ctx;
            return request({
              url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
              method: 'POST',
              params: result,
            });
          }}
        />
      </div>
    );
  }
}
