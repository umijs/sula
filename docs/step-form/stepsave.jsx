import React from 'react';
import { StepForm } from 'sula';
import { Button } from 'antd';

const steps = [
  {
    title: 'Step1',
    subTitle: 'step1 的子标题',
    description: 'step1 的简单描述',
    fields: [
      {
        name: 'input1',
        label: 'Input1',
        field: 'input',
        rules: [
          {
            required: true,
          },
        ],
      },
    ],
  },
  {
    title: 'Step2',
    subTitle: 'step2 的子标题',
    description: 'step2 的简单描述',
    fields: [
      {
        name: 'input2',
        label: 'Input2',
        field: 'input',
      },
    ],
  },
  {
    title: 'Step3',
    subTitle: 'step3 的子标题',
    description: 'step3 的简单描述',
    fields: [
      {
        name: 'input3',
        label: 'Input3',
        field: 'input',
        rules: [
          {
            required: true,
          },
        ],
      },
    ],
  },
];

const initialValues = { input1: '我是初始表单数据' };

export default class BasicDemo extends React.Component {
  state = {
    direction: 'horizontal',
    mode: 'create',
  };

  componentDidMount() {}

  render() {
    const { direction, mode } = this.state;
    return (
      <div>
        <Button
          type="primary"
          onClick={() => {
            this.setState({ direction: 'horizontal' });
          }}
        >
          horizontal
        </Button>
        <Button
          style={{ marginRight: 24 }}
          onClick={() => {
            this.setState({ direction: 'vertical' });
          }}
        >
          vertical
        </Button>

        <Button
          onClick={() => {
            this.setState({ mode: 'create' });
          }}
        >
          create
        </Button>
        <Button
          onClick={() => {
            this.setState({ mode: 'edit' });
          }}
        >
          edit
        </Button>
        <Button
          onClick={() => {
            this.setState({ mode: 'view' });
          }}
        >
          view
        </Button>
        <div style={{ background: 'rgb(241, 242, 246)', padding: 16, marginTop: 16 }}>
          <StepForm
            mode={mode}
            initialValues={mode === 'create' ? {} : initialValues}
            key={mode}
            stepsStyle={{ padding: '0 64px' }}
            direction={direction}
            steps={steps}
            submit={{
              url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
              method: 'POST',
              params: {
                tag: '__sula-submit-test__',
              },
            }}
            save={{
              url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
              method: 'POST',
              params: {
                tag: '__sula-save-test__',
              },
              successMessage: '暂存成功',
            }}
            result
          />
        </div>
      </div>
    );
  }
}
