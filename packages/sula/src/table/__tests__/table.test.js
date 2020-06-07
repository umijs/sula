import React from 'react';
import { act } from 'react-dom/test-utils';
import { Table } from '..';
import TableAction from '../TableAction';
import { mount } from 'enzyme';
import { delay, dataSource } from '../../__tests__/common';
import { registerFilterPlugins } from '../filter-plugin';

registerFilterPlugins();

function tableMount(props) {
  return mount(
    <Table
      rowKey="id"
      columns={[
        {
          key: 'id',
          title: 'Id',
        },
        {
          key: 'name',
          title: 'Name',
        },
        {
          key: 'age',
          title: 'Age',
        },
      ]}
      {...props}
    />,
  );
}

describe('table', () => {
  describe('init table', () => {
    it('table render && table action', () => {
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      const fn3 = jest.fn();
      const wrapper = tableMount({
        initialDataSource: dataSource,
        rowSelection: {},
        actionsRender: [
          {
            type: 'button',
            props: {
              children: 'right',
              className: 'action-test-btn-1',
            },
            action: fn1,
          },
        ],
        leftActionsRender: [
          {
            type: 'button',
            props: {
              children: 'left',
              className: 'action-test-btn-2',
            },
            action: [fn2, fn3],
          },
        ],
      });

      wrapper.find('.action-test-btn-1').first().simulate('click');
      expect(fn1.mock.calls[0][0].table).not.toBeNull();

      wrapper.find('.action-test-btn-2').first().simulate('click');
      expect(fn2.mock.calls[0][0].table).not.toBeNull();
      expect(fn3.mock.calls[0][0].table).not.toBeNull();
    });

    it('table remoteDataSource', async () => {
      const wrapper = tableMount({
        remoteDataSource: {
          url: '/datasource.json',
          method: 'post',
        },
        initialPaging: {
          pagination: {
            pageSize: 15,
          },
        },
      });
      await act(async () => {
        await delay(1000);
      });
      wrapper.update();
      expect(wrapper.find('.ant-table-row').length).toBe(15);
    });

    it('no pagination', async () => {
      const wrapper = tableMount({
        remoteDataSource: {
          url: '/nopagination.json',
          method: 'post',
        },
        initialPaging: {
          pagination: false,
        },
      });
      await act(async () => {
        await delay(1000);
      });
      wrapper.update();
      expect(wrapper.find('.ant-table-row').length).toBe(20);
    });

    it('no paging', async () => {
      const wrapper = tableMount({
        remoteDataSource: {
          url: '/nopagination.json',
          method: 'post',
        },
        initialPaging: false,
      });

      await act(async () => {
        await delay(1000);
      });

      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe('table columns parse', () => {
    it('render ctx', () => {
      const renderFn = jest.fn(() => <div>age</div>);
      tableMount({
        initialDataSource: dataSource,
        columns: [
          {
            key: 'id',
            title: 'Id',
          },
          {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
          },
          {
            key: 'age',
            title: 'Age',
            render: renderFn,
          },
        ],
      });

      const { table, index, record, text } = renderFn.mock.calls[0][0];
      expect(table).not.toBeNull();
      expect(index).not.toBeNull();
      expect(record).not.toBeNull();
      expect(text).not.toBeNull();
    });

    it('sorter', () => {
      const wrapper = tableMount({
        initialDataSource: dataSource,
        initialPaging: {
          sorter: {
            columnKey: 'age',
            order: 'ascend',
          },
        },
        columns: [
          {
            key: 'id',
            title: 'Id',
          },
          {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
          },
          {
            key: 'age',
            title: 'Age',
            sorter: true,
          },
        ],
      });

      // antd table里面的columns
      expect(wrapper.find('Table').first().props().columns).toEqual([
        { dataIndex: 'id', key: 'id', title: 'Id' },
        { dataIndex: 'name', key: 'name', title: 'Name' },
        { dataIndex: 'age', key: 'age', sortOrder: 'ascend', sorter: true, title: 'Age' },
      ]);
    });

    it('filter', () => {
      const wrapper = tableMount({
        initialDataSource: dataSource,
        initialPaging: {
          filters: {
            name: 'lily',
          },
        },
        columns: [
          {
            key: 'name',
            title: 'Name',
            filters: [
              {
                text: 'lily',
                value: 'lily',
              },
              {
                text: 'lucy',
                value: 'lucy',
              },
            ],
          },
        ],
      });

      // antd table里面的columns
      expect(wrapper.find('Table').first().props().columns[0]).toEqual({
        dataIndex: 'name',
        filteredValue: 'lily',
        filters: [
          { text: 'lily', value: 'lily' },
          { text: 'lucy', value: 'lucy' },
        ],
        key: 'name',
        title: 'Name',
      });
    });
  });

  describe('table filterRender', () => {
    it('filterRender', async () => {
      function openFilters(wrapper) {
        wrapper.find('.ant-table-filter-trigger').first().simulate('click');
        wrapper
          .find('input')
          .last()
          .simulate('change', { target: { value: 'a' } });
      }

      let curFilters;
      const wrapper = tableMount({
        remoteDataSource: {
          url: '/datasource.json',
          method: 'post',
          converter: ({ data }) => {
            const { filters, ...rest } = data;
            curFilters = filters;
            return rest;
          },
        },
        columns: [
          {
            key: 'id',
            title: 'Id',
          },
          {
            key: 'name',
            title: 'Name',
            filterRender: 'search',
          },
          {
            key: 'age',
            title: 'Age',
          },
        ],
      });

      openFilters(wrapper);
      wrapper.find('button').forEach((node) => {
        if (node.text() === 'OK') {
          node.simulate('click');
        }
      });

      await act(async () => {
        await delay(1000);
      });
      expect(curFilters).toEqual({ name: 'a' });

      openFilters(wrapper);
      wrapper.find('button').forEach((node) => {
        if (node.text() === 'Reset') {
          node.simulate('click');
        }
      });
      await act(async () => {
        await delay(1000);
      });
      expect(curFilters).toEqual({ name: null });

      openFilters(wrapper);

      wrapper.find('input').last().simulate('keydown', { keyCode: 13 });
      await act(async () => {
        await delay(1000);
      });
      expect(curFilters).toEqual({ name: 'a' });
    });
  });

  describe('table actions', () => {
    it('do not have actionsRender will return null', () => {
      const wrapper = mount(<TableAction />);
      expect(wrapper.find('.sula-table-action-left').children().length).toBeFalsy();
      expect(wrapper.find('.sula-table-action-right').children().length).toBeFalsy();
    });
  });
});
