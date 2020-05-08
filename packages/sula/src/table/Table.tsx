import React from 'react';
import { Table as ATable } from 'antd';
import {
  TableProps as ATableProps,
  ColumnProps as AColumnProps,
  ColumnProps,
} from 'antd/lib/table';
import { SortOrder } from 'antd/lib/table/interface';
import { PaginationConfig } from 'antd/lib/pagination';
import omit from 'lodash/omit';
import isUndefined from 'lodash/isUndefined';
import assign from 'lodash/assign';
import useTableContext, { HOOK_MARK } from './useTableContext';
import { triggerRenderPlugin } from '../rope/triggerPlugin';
import TableAction from './TableAction';
import ModalForm from '../modalform';
import { SulaConfigContext } from '../config-provider/context';

export interface TableProps extends ATableProps<Record<string, any>> {}

export interface Sorter {
  columnKey: string;
  order: SortOrder;
}

export interface Filters {
  [columnKey: string]: any[] | null;
}

export type Pagination = PaginationConfig;

export interface Paging {
  pagination?: Pagination;
  filters?: Filters;
  sorter?: Sorter;
}

export interface DataSourceResponse {
  list: Record<string, any>[];
  total: number;
  pageSize?: number;
}

export interface TableControlProps {
  dataSource: Record<string, any>[];
  selectedRowKeys?: string[];
  pagination?: PaginationConfig;
  filters?: Filters;
  sorter?: SortOrder;
}

// TODO
export type TableInstance = any;

const RefTable: React.FunctionComponent<TableProps> = (props, ref) => {
  const [context] = useTableContext();

  const mountRef = React.useRef<boolean>(false);

  const modalFormRef = React.useRef(null);
  const drawerFormRef = React.useRef(null);

  const {
    getCtx,
    saveTableProps,
    setControls,
    getControls,
    getInternalControls,
    onRowSelectionChange,
    onChange,
    saveModalFormRef,
    saveDrawerFormRef,
  } = context.getInternalHooks(HOOK_MARK);

  React.useImperativeHandle(ref, context.getTable);

  saveTableProps(props);

  if (!mountRef.current) {
    mountRef.current = true;

    saveModalFormRef(modalFormRef);
    saveDrawerFormRef(drawerFormRef);

    const tableControls: TableControlProps = parseTableControls(props);
    setControls(tableControls);
  }

  React.useEffect(() => {
    if (props.remoteDataSource && props.remoteDataSource.init !== false) {
      const table = context.getTable();
      table.refreshTable();
    }
  }, []);

  const tableProps = omit(props, [
    'remoteDataSource',
    'initialDataSource',
    'initialPaging',
    'initialSelectedRowKeys',
    'ctxGetter',
  ]);

  const configContext = React.useContext(SulaConfigContext);

  // =============== Table 级别 ===============

  const controls = getControls();

  tableProps.dataSource = controls.dataSource;
  tableProps.pagination = controls.pagination;

  const internalControls = getInternalControls();

  tableProps.loading = internalControls.loading;

  tableProps.onChange = onChange;

  if (tableProps.rowSelection) {
    tableProps.rowSelection = {
      ...tableProps.rowSelection,
      onChange: onRowSelectionChange,
      selectedRowKeys: controls.selectedRowKeys,
    };
  }

  if (props.actionsRender || props.leftActionsRender) {
    tableProps.title = (currentPageData) => {
      const ctx = getCtx({ dataSource: currentPageData, history: configContext.history });
      return (
        <TableAction
          leftActionsRender={props.leftActionsRender}
          actionsRender={props.actionsRender}
          ctx={ctx}
        />
      );
    };
  }

  // =============== Column 级别 ===============
  tableProps.columns = tableProps.columns.map((column, index) => {
    const { key, sorter, filters } = column;

    const newColumn = {} as ColumnProps<any>;

    if (!column.hasOwnProperty('dataIndex')) {
      newColumn.dataIndex = key;
    }

    const sorterColumnKey = controls && controls.sorter ? controls.sorter.columnKey : '';
    if (sorter && sorterColumnKey === key) {
      newColumn.sortOrder = controls.sorter.order;
    }

    if ((filters && filters.length) || column.filterRender) {
      newColumn.filteredValue = controls && controls.filters ? controls.filters[key] : undefined;
    }

    // TODO filterRender

    if (column.render) {
      newColumn.render = (text, record, index) => {
        const ctx = getCtx({
          text,
          record,
          index,
          history: configContext.history,
        });

        return triggerRenderPlugin(ctx, column.render);
      };
    }

    return assign({}, column, newColumn);
  });

  return (
    <React.Fragment>
      <ATable {...tableProps} />
      <ModalForm type="drawer" ref={drawerFormRef} />
      <ModalForm ref={modalFormRef} />
    </React.Fragment>
  );
};

const defaultPagination = {
  current: 1,
  pageSize: 10,
};

function parseTableControls(props: TableProps) {
  const selectedRowKeys = props.initialSelectedRowKeys;
  const dataSource = props.initialDataSource || [];
  if (props.initialPaging === false) {
    return {
      selectedRowKeys,
      dataSource,
    };
  }

  let pagination;
  if (isUndefined(props.initialPaging)) {
    pagination = assign({}, defaultPagination);
  } else if (props.initialPaging.pagination === false) {
    pagination = false;
  } else {
    pagination = assign({}, defaultPagination, props.initialPaging.pagination);
  }

  return assign({}, props.initialPaging, { pagination, selectedRowKeys, dataSource });
}

export default RefTable;
