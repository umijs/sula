import React from 'react';
import { submit } from '../../form/demos/common';
import { AppstoreOutlined, EditOutlined, LikeOutlined } from '@ant-design/icons';

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
    width: 110,
  },
  {
    title: '国家',
    key: 'nat',
    width: 110,
  },
  {
    title: '名字',
    key: 'name',
    copyable: true,
    ellipsis: true,
    width: 200,
  },
  {
    title: '年龄',
    key: 'age',
    width: 110,
    render: ctx => {
      return <span>{ctx.record.registered.age}</span>;
    },
  },
  {
    title: '操作',
    key: 'operator',
    render: [
      {
        type: 'button',
        props: {
          size: 'small',
          type: 'link',
          children: 'link',
          style: {padding: 0}
        },
        action: [{
          type: 'route',
          path: '/sula-table',
        }]
      },
      {
        type: 'icon',
        props: {
          type: 'edit',
          iconMapper: {
            edit: {
              outlined: EditOutlined,
            },
          },
        },
        tooltip: '创建表单',
        action: [
          {
            type: 'drawerform',
            title: '抽屉弹窗',
            fields: [
              {
                name: 'input',
                label: 'Input',
                field: 'input',
              },
            ],
            submit,
          },
        ],
      },
      {
        type: 'button',
        tooltip: '修改灰度比例',
        props: {
          children: 'c',
        },
        action: [
          {
            type: 'modalform',
            title: '弹窗',
            fields: [
              {
                name: 'input',
                label: 'Input',
                field: 'input',
              },
            ],
            submit,
          },
        ],
      },
      {
        type: 'icon',
        props: {
          text: '旋转',
          type: 'appstore',
          iconMapper: {
            appstore: {
              outlined: AppstoreOutlined,
            },
          },
        },
        tooltip: '修改灰度比例',
        action: [
          {
            type: 'modalform',
            title: '弹窗',
            fields: [
              {
                name: 'input',
                label: 'Input',
                field: 'input',
              },
            ],
            submit,
          },
        ],
      },
      {
        type: 'icon',
        props: {
          type: 'like',
          iconMapper: {
            like: {
              outlined: LikeOutlined,
            },
          },
        },
        tooltip: '请求',
        action: [
          {
            type: 'request',
            url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
            method: 'GET',
          },
        ],
      },
      {
        type: 'button',
        props: {
          children: '删除',
        },
        tooltip: '删除',
        confirm: '确定要删除吗?',
        action: [
          ctx => {
            console.log(ctx);
          },
          () => {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve();
              }, 2000);
            });
          },
        ],
      },
      {
        type: 'button',
        props: {
          children: '请求',
        },
        confirm: '确定要请求吗?',
        action: {
          type: 'request',
          url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
          method: 'GET',
          finish: () => {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve();
              }, 2000);
            });
          },
        },
      },
    ],
  },
];
