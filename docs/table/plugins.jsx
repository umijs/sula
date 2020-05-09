import React from 'react';
import { LikeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table } from 'sula';

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
          status: status[parseInt(Math.random() * 10) % 3].text,
          index,
        };
      }),
      total: 100,
    };
  },
};

const columns = [
  {
    title: 'No',
    key: 'index',
    render: {
      type: 'a',
      props: {
        children: '#{text}',
      }
    }
  },
  {
    title: 'Nation',
    key: 'nat',
    render: {
      type: 'tag',
      props: {
        children: '#{text}',
      }
    }
  },
  {
    title: 'PostCode',
    key: 'postcode',
    dataIndex: ['location', 'postcode'],
    render: {
      type: 'badge',
      props: {
        status: 'success',
        text: '#{text}',
      }
    }
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
    title: 'Gender',
    key: 'gender',
    render: {
      type: 'text',
      props: {
        strong: true,
        children: '#{record.gender}'
      }
    }
  },
  {
    title: 'Progress',
    key: 'progress',
    render: {
      type: 'progress',
      props: {
        percent: 80,
      }
    }
  },
  {
    title: 'Operation',
    key: 'operation',
    render: [
      {
        type: 'icon',
        props: {
          type: 'appstore', // 在global.js注册过
        },
      },
      {
        type: 'button',
        props: {
          size: 'small',
          children: 'Go'
        },
      },
    ],
  },
];


export default class BasicDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <Table
        columns={columns}
        remoteDataSource={remoteDataSource}
        rowKey="id"
        rowSelection={{}}
      />
    );
  }
}
