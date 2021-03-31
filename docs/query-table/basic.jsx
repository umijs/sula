import React from 'react';
import { QueryTable } from 'sula';

const queryFields = Array(10)
  .fill(0)
  .map((_, index) => {
    return {
      name: `input${index}`,
      label: `Input${index}`,
      field: 'input',
    };
  });

export const remoteDataSource = {
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
      list: data.results.map((item, index) => {
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

export const columns = [
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

const actions = [
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
            }

          }
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
  state = {
  }

  componentDidMount() {}

  changevisibleFieldsCount = (v) => {
    this.setState({visibleFieldsCount: v});
  }

  render() {
    const {visibleFieldsCount } = this.state;
    return (
      <div>
        <button onClick={() => this.changevisibleFieldsCount(4)}>4</button>
        <button onClick={() => this.changevisibleFieldsCount(3)}>3</button>
        <button onClick={() => this.changevisibleFieldsCount(true)}>无</button>
        <div style={{ background: 'rgb(241, 242, 246)', padding: 16, marginTop: 16 }}>
          <QueryTable
            key={visibleFieldsCount || 'all'}
            visibleFieldsCount={visibleFieldsCount}
            layout="vertical"
            columns={columns}
            remoteDataSource={remoteDataSource}
            fields={queryFields}
            rowKey="id"
            actionsRender={actions}
            rowSelection={{}}
          />
        </div>
      </div>
    );
  }
}
