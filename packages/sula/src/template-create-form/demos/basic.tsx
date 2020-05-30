import React from 'react';
import { CreateForm } from '../';
import { remoteValues, submit } from '../../form/demos/common';
import ModeSwitcher from '../../form/demos/modeSwitcher';

const fields = Array(10)
  .fill(0)
  .map((_, index) => {
    return {
      name: 'input' + index,
      label: 'Input' + index,
      field: 'input',
    };
  });

export default class BasicDemo extends React.Component {
  state = {
    mode: 'create',
  };
  render() {
    const { mode } = this.state;
    return (
      <div>
        <ModeSwitcher value={mode} onChange={(mode) => this.setState({ mode })} />
        <CreateForm
          mode={mode}
          key={mode}
          remoteValues={remoteValues}
          fields={fields}
          itemLayout={{ cols: { xl: 3, lg: 1 } }}
          submit={submit}
          actionsPosition="bottom"
        />
      </div>
    );
  }
}
