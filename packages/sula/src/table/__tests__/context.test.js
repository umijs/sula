import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { Table } from '..';
import { delay, actWait, dataSource, updateWrapper } from '../../__tests__/common';

describe('use table context', () => {
  describe('context', () => {
    it('table source', async () => {
      let tableRef;
      let wrapper;

      await actWait(() => {
        wrapper = mount(
          <Table
            ref={(ref) => {
              tableRef = ref;
            }}
            initialPaging={{
              pagination: {
                pageSize: 15,
              },
            }}
            rowKey="id"
            disableClearSelectedRows
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

      expect(tableRef.getDataSource()).toEqual([]);
      tableRef.setDataSource(dataSource);
      expect(tableRef.getDataSource()).toEqual(dataSource);
      await updateWrapper(wrapper);
      expect(wrapper.find('.ant-table-row').length).toBe(15);
      tableRef.setPagination({ pageSize: 5 });
      await updateWrapper(wrapper);
      expect(wrapper.find('.ant-table-row').length).toBe(5);
      await actWait(() => {
        tableRef.resetTable();
      });
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('table controls', async () => {
      let tableRef;
      let curFilters;
      let curSorter;
      let wrapper;
      const fn = jest.fn();
      await actWait(() => {
        wrapper = mount(
          <Table
            ref={(ref) => {
              tableRef = ref;
            }}
            initialPaging={{
              sorter: {
                columnKey: 'age',
                order: 'ascend',
              },
            }}
            rowKey="id"
            remoteDataSource={{
              url: '/datasource.json',
              method: 'post',
              converter: ({ data }) => {
                const { filters, sorter, ...rest } = data;
                curFilters = filters;
                curSorter = sorter;
                return rest;
              },
            }}
            rowSelection={{
              onChange: fn,
            }}
            columns={[
              {
                key: 'id',
                title: 'Id',
              },
              {
                key: 'name',
                title: 'Name',
                filters: [{ text: 'Lily', value: 'lily1' }],
              },
              {
                key: 'age',
                title: 'Age',
                sorter: true,
              },
            ]}
          />,
        );
      });

      await delay(1000);
      expect(curSorter).toEqual({
        columnKey: 'age',
        order: 'ascend',
      });

      await actWait(() => {
        tableRef.setFilters({ id: 1, name: undefined });
        wrapper.update();
        tableRef.refreshTable();
      });
      expect(curFilters).toEqual({ id: 1, name: null });

      await actWait(() => {
        tableRef.setSorter({ order: 'ascend', columnKey: 'id' });
        tableRef.refreshTable();
      });
      expect(curSorter).toEqual({ order: 'ascend', columnKey: 'id' });

      expect(tableRef.getPaging()).toEqual({
        filters: { id: 1, name: null },
        pagination: { current: 1, pageSize: 10, total: 20 },
        sorter: { columnKey: 'id', order: 'ascend' },
      });

      await actWait(() => {
        tableRef.resetTable(true);
      });
      expect(curFilters).toEqual({ id: null, name: null });
      expect(curSorter).toEqual({ order: false, columnKey: 'id' });

      wrapper
        .find('input')
        .first()
        .simulate('change', { target: { checked: true } });
      expect(tableRef.getSelectedRowKeys()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

      await actWait(() => {
        tableRef.refreshTable();
      });
      expect(tableRef.getSelectedRowKeys()).toEqual([]);

      tableRef.resetTable(false);
      await delay(1000);
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('init filters', async () => {
      let curFilters;
      mount(
        <Table
          initialPaging={{
            filters: {
              name: 'lily1',
            },
          }}
          rowKey="id"
          remoteDataSource={{
            url: '/datasource.json',
            method: 'post',
            converter: ({ data }) => {
              const { filters, sorter, ...rest } = data;
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
              filters: [{ text: 'Lily', value: 'lily1' }],
            },
            {
              key: 'age',
              title: 'Age',
            },
          ]}
        />,
      );

      await actWait();
      expect(curFilters).toEqual({ name: 'lily1' });
    });

    it('row selections', async () => {
      let tableRef;
      const onChange = jest.fn();

      let wrapper;

      await act(async () => {
        wrapper = mount(
          <Table
            ref={(ref) => {
              tableRef = ref;
            }}
            rowKey="id"
            onChange={onChange}
            initialDataSource={dataSource.slice(0, 4)}
            rowSelection={{}}
            leftActionsRender={['rowselection']}
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

      const checkboxes = wrapper.find('input');

      checkboxes.first().simulate('change', { target: { checked: true } });
      expect(tableRef.getSelectedRowKeys()).toEqual([0, 1, 2, 3]);
      expect(tableRef.getSelectedRows()).toEqual([
        { age: 10, id: 0, name: 'lily0' },
        { age: 11, id: 1, name: 'lily1' },
        { age: 12, id: 2, name: 'lily2' },
        { age: 13, id: 3, name: 'lily3' },
      ]);

      checkboxes.at(1).simulate('change', { target: { checked: false } });
      checkboxes.at(2).simulate('change', { target: { checked: false } });

      expect(tableRef.getSelectedRowKeys()).toEqual([2, 3]);
      expect(tableRef.getSelectedRows()).toEqual([
        { age: 12, id: 2, name: 'lily2' },
        { age: 13, id: 3, name: 'lily3' },
      ]);

      wrapper.find('a').forEach((node) => {
        if (node.text() === 'Clear') {
          node.simulate('click');
        }
      });

      expect(tableRef.getSelectedRowKeys()).toEqual([]);

      expect(checkboxes.at(3).props().checked).toEqual(false);
      expect(checkboxes.at(4).props().checked).toEqual(false);
    });
  });

  describe('table onChange', () => {
    it('change', async () => {
      const onChange = jest.fn();
      let curSorter;

      let wrapper;
      await actWait(() => {
        wrapper = mount(
          <Table
            rowKey="id"
            remoteDataSource={{
              url: '/datasource.json',
              method: 'post',
              converter: ({ data }) => {
                const { filters, sorter, ...rest } = data;
                curSorter = sorter;
                return rest;
              },
            }}
            initialPaging={{
              pagination: {
                pageSize: 2,
              },
            }}
            onChange={onChange}
            columns={[
              {
                key: 'id',
                title: 'Id',
              },
              {
                key: 'name',
                title: 'Name',
                filters: [{ text: 'Lily', value: 'lily1' }],
              },
              {
                key: 'age',
                title: 'Age',
                sorter: true,
              },
            ]}
          />,
        );
      });

      wrapper.find('.ant-table-column-has-sorters').simulate('click');
      await delay(1000);
      expect(curSorter).toEqual({ columnKey: 'age', order: 'ascend' });
      expect(onChange).toHaveBeenCalledWith(
        { current: 1, pageSize: 2, total: 20 },
        { name: null },
        {
          column: { dataIndex: 'age', key: 'age', sorter: true, title: 'Age' },
          columnKey: 'age',
          field: 'age',
          order: 'ascend',
        },
        {
          currentDataSource: [
            { age: 10, id: 0, name: 'lily0' },
            { age: 11, id: 1, name: 'lily1' },
          ],
        },
      );
    });
  });
});
