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
      },
    ],
  },
];

export default class BasicDemo extends React.Component {
  state = {
    direction: 'horizontal',
  };

  componentDidMount() {}

  render() {
    const { direction } = this.state;
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
          onClick={() => {
            this.setState({ direction: 'vertical' });
          }}
        >
          vertical
        </Button>{' '}
        <div style={{ background: 'rgb(241, 242, 246)', padding: 16, marginTop: 16 }}>
          <StepForm
            stepsStyle={{width: 1180, marginLeft: 'auto', marginRight: 'auto'}}
            direction={direction}
            steps={steps}
            submit={{
              url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
              method: 'POST',
            }}
            result
          />
        </div>
      </div>
    );
  }
}
