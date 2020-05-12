import React from 'react';
import { CreateForm, request } from 'sula';

export default class BasicDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <CreateForm
          initialValues={{
            gender: 'female',
          }}
          fields={[
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
            {
              name: 'questionnaire',
              label: '调查问卷',
              field: {
                type: 'textarea',
                props: {
                  placeholder: 'why do you like football?',
                },
              },
              initialVisible: false,
              dependency: {
                visible: {
                  relates: ['gender'],
                  inputs: [['female']],
                  output: true,
                  defaultOutput: false,
                },
              },
            },
            {
              name: 'questionnaire2',
              label: '调查问卷2',
              field: {
                type: 'textarea',
                props: {
                  placeholder: 'why do you like football?',
                },
              },
              dependency: {
                value: {
                  relates: ['gender'],
                  type: (ctx) => {
                    if (ctx.values[0] === 'female') {
                      ctx.form.setFieldValue(ctx.name, ''); // 先清空
                      request({
                        url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
                        method: 'POST',
                      }).then((data) => {
                        if (data.hello === 'world') {
                          ctx.form.setFieldValue(ctx.name, '喜欢中国女足');
                        }
                      });
                    } else {
                      ctx.form.setFieldValue(ctx.name, '踢足球');
                    }
                  },
                },
              },
            },
          ]}
          submit={{
            url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
            method: 'POST',
          }}
        />
      </div>
    );
  }
}
