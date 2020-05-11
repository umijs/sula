import React from 'react';
import { mount } from 'enzyme';
import '../../__tests__/common';
import { QueryTable } from '..';

const columns = [
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
  }
];

const remoteDataSource = {
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

const queryFields = Array(6)
  .fill(0)
  .map((_, index) => {
    return {
      name: `input${index}`,
      label: `Input${index}`,
      field: 'input',
    };
  });

const config = {
  columns,
  remoteDataSource,
  fields: queryFields,
  rowKey: 'id'
}

describe('query-table', () => {
  it('has rowSelection', () => {
    const wrapper = mount(
      <QueryTable
        { ...config }
        layout="horizontal"
        rowSelection={{ hideDefaultSelections: true }}
      />
    )

    expect(wrapper.render()).toMatchSnapshot();
  })
  it('basic has actionsRender', () => {
    const wrapper = mount(
      <QueryTable
        { ...config }
        layout="vertical"
        visibleFieldsCount={8}
        actionsRender={[
          {
            type: 'button',
            props: {
              children: 'right',
            },
          },
        ]}
      />
    )

    expect(wrapper.render()).toMatchSnapshot();
  })
  it('basic has leftActionsRender', () => {
    const wrapper = mount(
      <QueryTable
        { ...config }
        layout="vertical"
        autoInit={false}
        leftActionsRender={[
          {
            type: 'button',
            props: {
              children: 'left',
            },
          },
        ]}
      />
    )

    wrapper.find('a').at(0).simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.find('button').forEach(node => {
      if (node.text() === 'Query') {
        node.simulate('click');
      }
    })
    wrapper.find('button').forEach(node => {
      if (node.text() === 'Reset') {
        node.simulate('click');
      }
    })
  })
})