import React from 'react';
import CreateForm from '../';
import { remoteSource, remoteValues, submit } from '../../form/demos/common';

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
  render() {
    return (
      <div>
        <CreateForm
          fields={fields}
          itemLayout={{ cols: { xl: 3, lg: 1 } }}
          submit={submit}
          // back={() => {
          //   console.log('history goBack');
          // }}
        />
      </div>
    );
  }
}
