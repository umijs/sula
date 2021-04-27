import React from 'react';
import { CreateForm } from 'sula';
import ModeSwitcher from '../components/modeSwitcher';

export default class BasicDemo extends React.Component {
  state = {
    mode: 'create',
  }

  componentDidMount() {}

  render() {
    const { mode } = this.state;
    return (
      <div>
        <ModeSwitcher value={mode} onChange={(mode) => {
          this.setState({mode});
        }}/>
        <CreateForm
          mode={mode}
          key={mode}
          initialValues={{
            gender: ['male'],
            nihao: 'cat',
          }}
          preserveInitialValues
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
          submitButtonProps={{
            icon: 'appstore',
          }}
          back={() => {
            console.log('back')
          }}
          submit={{
            url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
            method: 'POST'
          }}
        />
      </div>
    );
  }
}
