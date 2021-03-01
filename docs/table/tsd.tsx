import React from 'react';
import { LikeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, TableProps } from 'sula';

const status = [
  {
    text: 'Finish',
    value: 'finish',
  },
  {
    text: 'Processing',
    value: 'processing',
  },
  {
    text: 'Failed',
    value: 'failed',
  },
];

const columns: TableProps['columns'] = [
  {
    title: 'No',
    key: 'index',
    width: 110,
  },
  {
    title: 'Nation',
    key: 'nat',
  },
  {
    title: 'Status',
    key: 'status',
    render: {
      type: 'tag',
      funcProps: {
        color: ({ text }) => {
          if (text === 'Finish') {
            return 'green';
          } else if (text === 'Failed') {
            return 'red';
          }
          return 'blue';
        },
      },
      props: {
        children: '#{text}',
      },
    },
  },
  {
    title: 'Icons',
    key: 'icons',
    render: [
      {
        type: 'icon',
        props: {
          type: 'appstore', // 在global.js注册过
        },
      },
      {
        type: 'icon',
        props: {
          type: 'like',
          iconMapper: {
            like: LikeOutlined, // 优先级高于全局，默认为outlined
          },
        },
      },
      {
        type: 'icon',
        props: {
          text: 'action',
          type: 'edit',
          iconMapper: {
            edit: EditOutlined,
          },
        },
        action(ctx) {
          console.log('action', ctx);
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(1);
            }, 2000);
          });
        },
      },
      {
        type: 'icon',
        confirm: 'Confirm to delete?',
        props: {
          text: 'Delete',
          type: 'delete',
          iconMapper: {
            delete: DeleteOutlined,
          },
        },
        action: [
          {
            type: 'request',
            url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed', // 只有request可以省略type
            method: 'POST',
            successMessage: 'successfully deleted',
          },
          'refreshTable',
        ],
      },
    ],
  },
];

const actionsRender = [
  {
    type: 'button',
    props: {
      type: 'danger',
      children: 'Delete',
      icon: {
        type: 'delete',
        iconMapper: {
          delete: DeleteOutlined,
        },
      },
    },
    action: [
      {
        type: 'request',
        url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed', // 只有request可以省略type
        method: 'POST',
      },
      'refreshTable',
    ],
  },
  {
    type: 'button',
    props: {
      children: 'New',
    },
    action: {
      type: 'route',
      path: '/form',
      query: {
        name: 'sula',
      },
    },
  },
];

export default class BasicDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <Table
        actionsRender={actionsRender}
        columns={columns}
        remoteDataSource={{
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
                  status: status[parseInt(((Math.random() * 10) as unknown) as string) % 3].text,
                  index,
                };
              }),
              total: 100,
            };
          },
        }}
        rowKey="id"
        initialSelectedRowKeys={['0', '2']}
        rowSelection={{}}
      />
    );
  }
}
