import React from 'react';
import { QueryTable } from '..';
import { columns, remoteDataSource } from '../../table/demos/common';

export default () => {
  const queryFields = Array(10)
    .fill(0)
    .map((_, index) => {
      return {
        name: `input${index}`,
        label: `Input${index}`,
        field: 'input',
      };
    });

  return (
    <div style={{ background: 'rgb(241, 242, 246)', padding: 16, marginTop: 16 }}>
      <QueryTable
        layout="vertical"
        columns={columns}
        remoteDataSource={remoteDataSource}
        fields={queryFields}
        rowKey="id"
      />
    </div>
  );
};
