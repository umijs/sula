import React from 'react';
import { StepForm } from 'sula';
import { Button } from 'antd';

const steps = [
  {
    title: 'Step1',
    fields: [
      {
        name: 'input1',
        label: 'Input1',
        field: 'input',
      },
    ],
  },
  {
    title: 'Step2',
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
        <div style={{ background: '#fff', padding: 24 }}>
          <StepForm
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
