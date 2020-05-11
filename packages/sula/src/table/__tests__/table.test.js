import React from 'react';
import { Table } from '..';
import TableAction from '../TableAction';
import { mount } from 'enzyme';
import { dataSource, actWait } from '../../__tests__/common';

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
      expect(wrapper.html()).toMatchSnapshot();
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
      })
      await actWait();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('no paging', async () => {
      const wrapper = mount(
        <Table
          rowKey="id"
          remoteDataSource={{
            url: '/error.json',
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
      await actWait();
      expect(wrapper.html()).toMatchSnapshot();
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
});
