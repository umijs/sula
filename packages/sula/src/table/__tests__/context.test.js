import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { Table } from '..';
import { delay, dataSource } from '../../__tests__/common';

function tableMount(props = {}) {
  let tableRef;
  const wrapper = mount(
    <Table
      ref={(ref) => {
        tableRef = ref;
      }}
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
  return { wrapper, tableRef };
}

describe('use table context', () => {
  it('table date source', () => {
    const { wrapper, tableRef } = tableMount();

    expect(tableRef.getDataSource()).toEqual([]);

    act(() => {
      tableRef.setDataSource(dataSource);
    });
    wrapper.update();
    expect(tableRef.getDataSource()).toEqual(dataSource);
    expect(wrapper.find('.ant-table-row').length).toBe(10);
  });

  it('table Paging', () => {
    const { wrapper, tableRef } = tableMount({
      initialDataSource: dataSource,
    });
    act(() => {
      tableRef.setPagination({ pageSize: 15 });
    });
    wrapper.update();
    expect(wrapper.find('.ant-table-row').length).toBe(15);
  });

  it('table selection', () => {
    const onChange = jest.fn();
    const { wrapper, tableRef } = tableMount({
      rowSelection: {
        onChange,
      },
      initialDataSource: dataSource.slice(0, 4),
      leftActionsRender: ['rowselection'],
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
    expect(tableRef.getSelectedRows()).toEqual([]);
    expect(checkboxes.at(3).props().checked).toEqual(false);
    expect(checkboxes.at(4).props().checked).toEqual(false);

    expect(onChange).toHaveBeenCalled();
  });

  describe('table controls', () => {
    it('initialSelectedRowKeys', () => {
      const { wrapper, tableRef } = tableMount({
        initialDataSource: dataSource,
        initialPaging: false, // controls中只有dataSource和selectrowkeys
        initialSelectedRowKeys: [0],
      });
      expect(tableRef.getSelectedRowKeys()).toEqual([0]);
      expect(tableRef.getPaging()).toEqual({});
    });

    it('sorter', async () => {
      let curSorter;
      let tableRef;
      act(() => {
        const { tableRef: _tableRef } = tableMount({
          remoteDataSource: {
            url: '/datasource.json',
            method: 'post',
            converter: ({ data }) => {
              const { filters, sorter, ...rest } = data;
              curSorter = sorter;
              return rest;
            },
          },
        });
        tableRef = _tableRef;
      });

      await act(async () => {
        await delay(1000);
      });
      expect(tableRef.getDataSource().length).toBeTruthy();

      await act(async () => {
        tableRef.setSorter({ order: 'ascend', columnKey: 'id' });
        tableRef.refreshTable();
        await delay(1000);
      });
      expect(curSorter).toEqual({ columnKey: 'id', order: 'ascend' });
    });

    it('filter', async () => {
      let curFilters;
      let wrapper;
      let tableRef;
      act(() => {
        const { wrapper: _wrapper, tableRef: _tableRef } = tableMount({
          remoteDataSource: {
            url: '/datasource.json',
            method: 'post',
            converter: ({ data }) => {
              const { filters, sorter, ...rest } = data;
              curFilters = filters;
              return rest;
            },
          },
        });
        tableRef = _tableRef;
      });

      await act(async () => {
        await delay(1000);
      });
      expect(tableRef.getDataSource().length).toBeTruthy();

      await act(async () => {
        tableRef.setFilters({ id: 1, name: 'lily' });
        tableRef.refreshTable();
        await delay(1000);
      });
      expect(curFilters).toEqual({ id: 1, name: 'lily' });

      await act(async () => {
        tableRef.setFilters({ id: 1, name: undefined });
        tableRef.refreshTable();
        await delay(1000);
      });
      expect(curFilters).toEqual({ id: 1, name: null });
    });
  });

  describe('refresh table', () => {
    it('not have remoteDateSource', () => {
      const { tableRef } = tableMount();
      expect(tableRef.refreshTable()).toEqual(undefined);
    });

    it('refresh table with params', async () => {
      let tableRef;
      act(() => {
        const { wrapper: _wrapper, tableRef: _tableRef } = tableMount({
          remoteDataSource: {
            url: '/datasource.json',
            method: 'post',
            converter: ({ data }) => {
              const { filters, sorter, ...rest } = data;
              return rest;
            },
          },
        });
        tableRef = _tableRef;
      });
      await act(async () => {
        tableRef.refreshTable(
          {
            current: 2,
          },
          { id: 1, name: 'lily' },
          { columnKey: 'id', order: 'ascend' },
        );
        await delay(1000);
      });

      expect(tableRef.getPaging()).toEqual({
        filters: { id: 1, name: 'lily' },
        pagination: { current: 2, pageSize: 10, total: 20 },
        sorter: { columnKey: 'id', order: 'ascend' },
      });
    });

    it('refresh table with selectedrowkeys', async () => {
      let wrapper;
      let tableRef;
      act(() => {
        const { wrapper: _wrapper, tableRef: _tableRef } = tableMount({
          remoteDataSource: {
            url: '/datasource.json',
            method: 'post',
          },
          rowSelection: {},
        });
        tableRef = _tableRef;
        wrapper = _wrapper;
      });

      await act(async () => {
        await delay(1000);
      });

      const checkboxes = wrapper.find('input');
      checkboxes.first().simulate('change', { target: { checked: true } });

      expect(tableRef.getSelectedRowKeys().length).toBeTruthy();

      await act(async () => {
        tableRef.refreshTable(
          {
            current: 2,
          },
          { id: 1, name: 'lily' },
          { columnKey: 'id', order: 'ascend' },
        );
        await delay(1000);
      });

      expect(tableRef.getPaging()).toEqual({
        filters: { id: 1, name: 'lily' },
        pagination: { current: 2, pageSize: 10, total: 20 },
        sorter: { columnKey: 'id', order: 'ascend' },
      });

      expect(tableRef.getSelectedRowKeys().length).toBeFalsy();
    });

    it('nopagination refresh table', async () => {
      let wrapper;
      let tableRef;
      act(() => {
        const { wrapper: _wrapper, tableRef: _tableRef } = tableMount({
          remoteDataSource: {
            url: '/nopagination.json',
            method: 'post',
          },
          initialPaging: {
            pagination: false,
          },
        });
        tableRef = _tableRef;
        wrapper = _wrapper;
      });

      await act(async () => {
        await delay(1000);
      });
      expect(tableRef.getPaging()).toEqual({ pagination: false }); // table parse

      await act(async () => {
        tableRef.refreshTable();
        await delay(1000);
      });

      expect(tableRef.getPaging()).toEqual({ pagination: false });
      expect(wrapper.find('Spin').props().spinning).toEqual(false);
    });

    it('refresh table error', async () => {
      let wrapper;
      let tableRef;
      act(() => {
        const { wrapper: _wrapper, tableRef: _tableRef } = tableMount({
          remoteDataSource: {
            url: '/error.json',
            method: 'post',
          },
        });
        tableRef = _tableRef;
        wrapper = _wrapper;
      });

      await act(async () => {
        await delay(1000);
        tableRef.refreshTable();
        await delay(1000);
      });

      expect(wrapper.find('Spin').props().spinning).toEqual(false);
    });
  });

  describe('reset table', () => {
    it('reset table table', async () => {
      let requestTimes = 0;
      let wrapper;
      let tableRef;
      act(() => {
        const { wrapper: _wrapper, tableRef: _tableRef } = tableMount({
          remoteDataSource: {
            url: '/datasource.json',
            method: 'post',
            converter: ({ data }) => {
              const { filters, sorter, ...rest } = data;
              requestTimes += 1;
              return rest;
            },
          },
          initialPaging: {
            pagination: {
              current: 2,
            },
            sorter: {
              columnKey: 'age',
              order: 'ascend',
            },
            filters: {
              id: 1,
              name: 'lily',
            },
          },
        });
        tableRef = _tableRef;
        wrapper = _wrapper;
      });

      await act(async () => {
        await delay(1000);
      });

      expect(tableRef.getPaging()).toEqual({
        filters: { id: 1, name: 'lily' },
        pagination: { current: 2, pageSize: 10, total: 20 },
        sorter: { columnKey: 'age', order: 'ascend' },
      });

      await act(async () => {
        tableRef.resetTable();
        await delay(1000);
      });
      expect(tableRef.getPaging()).toEqual({
        filters: { id: null, name: null },
        pagination: { current: 1, pageSize: 10, total: 20 },
        sorter: { columnKey: 'age', order: false },
      });

      expect(requestTimes).toEqual(2);
    });

    it('not refresh table', async () => {
      let requestTimes = 0;
      let wrapper;
      let tableRef;
      act(() => {
        const { wrapper: _wrapper, tableRef: _tableRef } = tableMount({
          remoteDataSource: {
            url: '/datasource.json',
            method: 'post',
            converter: ({ data }) => {
              const { filters, sorter, ...rest } = data;
              requestTimes += 1;
              return rest;
            },
          },
        });
        tableRef = _tableRef;
        wrapper = _wrapper;
      });

      await act(async () => {
        await delay(1000);
      });

      await act(async () => {
        tableRef.resetTable(false);
        await delay(1000);
      });

      expect(requestTimes).toEqual(1);
    });
  });

  describe('table onChange', () => {
    it('onchange will refresh table', async () => {
      let requestTimes = 0;
      let wrapper;
      let curSorter;
      const onChange = jest.fn();
      act(() => {
        const { wrapper: _wrapper } = tableMount({
          onChange,
          remoteDataSource: {
            url: '/datasource.json',
            method: 'post',
            converter: ({ data }) => {
              const { filters, sorter, ...rest } = data;
              requestTimes += 1;
              curSorter = sorter;
              return rest;
            },
          },
          initialPaging: {
            pagination: {
              pageSize: 2, // 减少代码量
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
              filters: [{ text: 'Lily', value: 'lily1' }],
            },
            {
              key: 'age',
              title: 'Age',
              sorter: true,
            },
          ],
        });
        wrapper = _wrapper;
      });

      await act(async () => {
        await delay(1000);
      });
      await act(async () => {
        wrapper.find('.ant-table-column-has-sorters').simulate('click');
        await delay(1000);
      });
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
      expect(requestTimes).toEqual(2);
    });
  });
});
