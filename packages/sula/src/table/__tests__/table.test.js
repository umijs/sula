import React from 'react';
import { Table } from '..';
import TableAction from '../TableAction';
import { mount } from 'enzyme';
import { delay, dataSource, actWait } from '../../__tests__/common';
import { registerFilterPlugins } from '../filter-plugin';

registerFilterPlugins();

describe('table', () => {
  describe('table snapshot', () => {
    it('basic table', () => {
      const wrapper = mount(
        <Table
          rowKey="id"
          initialDataSource={dataSource}
          columns={[
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
              render: () => <div>age</div>,
            },
          ]}
          rowSelection={{
            hideDefaultSelections: true,
          }}
          actionsRender={[
            {
              type: 'button',
              props: {
                children: 'right',
              },
            },
          ]}
          leftActionsRender={[
            {
              type: 'button',
              props: {
                children: 'left',
              },
            },
          ]}
        />,
      );
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('no pagination', async () => {
      let wrapper;
      await actWait(() => {
        wrapper = mount(
          <Table
            rowKey="id"
            remoteDataSource={{
              url: '/nopagination.json',
              method: 'post',
            }}
            initialPaging={{
              pagination: false,
            }}
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
            rowSelection={{}}
          />,
        );
      });
      await actWait();
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('no paging', async () => {
      let wrapper;
      await actWait(() => {
        wrapper = mount(
          <Table
            rowKey="id"
            remoteDataSource={{
              url: '/nopagination.json',
              method: 'post',
            }}
            initialPaging={false}
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
          />,
        );
      });

      await delay(1000);
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe('tableAction', () => {
    it('do not have actionsRender will return null', () => {
      const wrapper = mount(<TableAction />);
      expect(wrapper.find('.sula-table-action-left').children()).toEqual({});
      expect(wrapper.find('.sula-table-action-right').children()).toEqual({});
    });

    it('have ctx', () => {
      const fn = jest.fn();
      const wrapper = mount(
        <Table
          rowKey="id"
          initialDataSource={dataSource}
          columns={[
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
            },
          ]}
          actionsRender={[
            {
              type: 'button',
              props: {
                className: 'jest-test-btn',
                children: 'right',
              },
              action: fn,
            },
          ]}
          leftActionsRender={[
            {
              type: 'button',
              props: {
                children: 'left',
              },
            },
          ]}
        />,
      );

      wrapper.find('.jest-test-btn').last().simulate('click');
      const ctx = fn.mock.calls[0][0];
      expect(ctx.table).not.toBeNull();
      expect(ctx.dataSource).not.toBeNull();
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
      let wrapper;
      await actWait(() => {
        wrapper = mount(
          <Table
            rowKey="id"
            remoteDataSource={{
              url: '/datasource.json',
              method: 'post',
              converter: ({ data }) => {
                const { filters, ...rest } = data;
                curFilters = filters;
                return rest;
              },
            }}
            columns={[
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
            ]}
          />,
        );
      });

      await actWait();

      openFilters(wrapper);
      wrapper.find('button').forEach((node) => {
        if (node.text() === 'OK') {
          node.simulate('click');
        }
      });

      await actWait();
      expect(curFilters).toEqual({ name: ['a'] });

      openFilters(wrapper);
      wrapper.find('button').forEach((node) => {
        if (node.text() === 'Reset') {
          node.simulate('click');
        }
      });

      await actWait();
      expect(curFilters).toEqual({ name: null });

      openFilters(wrapper);

      wrapper.find('input').last().simulate('keydown', { keyCode: 13 });

      await actWait();
      expect(curFilters).toEqual({ name: ['a'] });
    });
  });
});
