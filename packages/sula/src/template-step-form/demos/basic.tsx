import React from 'react';
import { StepForm } from '..';
import { submit, remoteValues } from '../../form/demos/common.jsx';
import { Button } from 'antd';
import ModeSwitcher from '../../form/demos/modeSwitcher.tsx';

const steps = [
  {
    title: 'Step1',
    // subTitle: 'sub',
    // description: '我需要好好简述下这个步骤',
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

export default class BaiscDemo extends React.Component {
  state = {
    direction: 'horizontal',
    mode: 'create',
  }
  render() {
    const { direction, mode} = this.state;
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
        <ModeSwitcher value={mode} onChange={(mode) => this.setState({ mode })} />{' '}
        <div style={{ background: 'rgb(241, 242, 246)', padding: 16, marginTop: 16 }}>
          <div style={{ background: '#fff', padding: 24 }}>
            <StepForm key={mode} mode={mode} direction={direction} steps={steps} remoteValues={remoteValues} submit={submit} result />
          </div>
        </div>
      </div>
    );
  }
}
