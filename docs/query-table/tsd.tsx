import React from 'react';
import { QueryTable, QueryTableProps } from 'sula';

const queryFields: QueryTableProps['fields'] = Array(10)
  .fill(0)
  .map((_, index) => {
    return {
      name: `input${index}`,
      label: `Input${index}`,
      field: 'input',
    };
  });

export const remoteDataSource: QueryTableProps['remoteDataSource'] = {
  url: 'https://randomuser.me/api',
  method: 'GET',
  convertParams({ params }) {
    return {
      results: params.pageSize,
      ...params,
    };
  },
  converter({ data }) {
    return {
      list: data.results.map((item: any, index: number) => {
        return {
          ...item,
          id: `${index}`,
          name: `${item.name.first} ${item.name.last}`,
          index,
        };
      }),
      total: 100,
    };
  },
};

export const columns: QueryTableProps['columns'] = [
  {
    title: '序号',
    key: 'index',
  },
  {
    title: '国家',
    key: 'nat',
  },
  {
    title: '名字',
    key: 'name',
    ellipsis: true,
    width: 200,
  },
  {
    title: '年龄',
    key: 'age',
    render: (ctx) => {
      return <span>{ctx.record.registered.age}</span>;
    },
  },
  {
    title: '操作',
    key: 'operation',
    render: [
      {
        confirm: '是否删除？',
        type: 'icon',
        props: {
          type: 'appstore',
        },
        action: [
          {
            type: 'request',
            url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
            method: 'POST',
            params: {
              id: '#{record.id}',
            },
            successMessage: '删除成功',
          },
          'refreshTable',
        ],
      },
    ],
  },
];

const actions: QueryTableProps['actionsRender'] = [
  {
    type: 'button',
    disabled: (ctx) => {
      const selectedRowKeys = ctx.table.getSelectedRowKeys();
      return !(selectedRowKeys && selectedRowKeys.length);
    },
    props: {
      type: 'primary',
      children: '批量注册',
    },
    action: [
      {
        type: 'modalform',
        title: '信息',
        resultPropName: 'modalform', // 加入results
        fields: [
          {
            name: 'name',
            label: '名称',
            field: 'input',
          },
        ],
        submit: {
          url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
          method: 'POST',
          convertParams: (ctx) => {
            const uuids = ctx.table.getSelectedRows().map((item) => item.login.uuid);
            return {
              ...ctx.params,
              uuids,
            };
          },
        },
      },
      (ctx) => {
        console.log('result', ctx.result);
        console.log('results', ctx.results);
      },
      'refreshTable',
    ],
  },
];

export default class BasicDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div style={{ background: 'rgb(241, 242, 246)', padding: 16, marginTop: 16 }}>
        <QueryTable
          layout="vertical"
          columns={columns}
          remoteDataSource={remoteDataSource}
          fields={queryFields}
          rowKey="id"
          actionsRender={actions}
          rowSelection={{}}
        />
      </div>
    );
  }
}
