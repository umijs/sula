import React from 'react';
import { QueryTable } from '..';
import { columns, remoteDataSource } from '../../table/demos/common';

export default () => {
  const queryFields = Array(3)
    .fill(0)
    .map((_, index) => {
      return {
        name: `input${index}`,
        label: `Input${index}`,
        field: 'input',
      };
    });

  const actions = [
    {
      type: 'button',
      props: {
        children: '一般',
      },
    },
    {
      type: 'button',
      props: {
        children: '刷新',
        type: 'primary',
      },
      disabled: (ctx) => {
        const { length } = ctx.table.getSelectedRows() || [];
        return !length;
      },
      action: 'refreshtable',
    },
  ];

  return (
    <div style={{ background: 'rgb(241, 242, 246)', padding: 16, marginTop: 16 }}>
      <QueryTable
        layout="vertical"
        columns={columns}
        remoteDataSource={remoteDataSource}
        fields={queryFields}
        actionsRender={actions}
        rowKey="id"
        rowSelection={{}}
      />
    </div>
  );
};
