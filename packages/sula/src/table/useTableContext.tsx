import React from 'react';
import assign from 'lodash/assign';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import isUndefined from 'lodash/isUndefined';
import isFunction from 'lodash/isFunction';
import { TableControlProps, TableProps, Filters, Pagination, Sorter, TableInstance } from './Table';
import { PaginationConfig } from 'antd/lib/pagination';
import { assignWithDefined } from '../_util/common';
import { triggerActionPlugin } from '../rope/triggerPlugin';
import ModalForm from '../modalform';

export const HOOK_MARK = 'SULA_TABLE_INTERNAL_HOOKS';

export interface InternalControlProps {
  loading: boolean;
}

class ContextStore {
  private forceRootUpdate: () => void;

  private controls: TableControlProps;

  private tableProps: TableProps;

  /**
   * loading  // 额外控制的字段
   */
  private internalControls = {} as InternalControlProps;

  private records = {};

  private modalFormRef: React.RefObject<typeof ModalForm>;
  private drawerFormRef: React.RefObject<typeof ModalForm>;

  constructor(forceRootUpdate) {
    this.forceRootUpdate = forceRootUpdate;
  }

  public getContext = () => {
    return {
      getTable: this.getTable,
      getInternalHooks: this.getInternalHooks,
    };
  };

  // =============== 对外API =================
  private getTable = () => {
    return {
      setDataSource: this.setDataSource,
      getDataSource: this.getDataSource,

      setPagination: this.setPagination,
      setFilters: this.setFilters,
      setSorter: this.setSorter,

      getSelectedRowKeys: this.getSelectedRowKeys,
      clearRowSelection: this.clearRowSelection,

      getSelectedRows: this.getSelectedRows,

      getPaging: this.getPaging,

      refreshTable: this.refreshTable,
      resetTable: this.resetTable,
    };
  };

  public refreshTable = (
    pagination?: Pagination,
    filters?: Filters,
    sorter?: Sorter,
    internal?: boolean = false,
  ) => {
    if (!this.tableProps.remoteDataSource) {
      return;
    }

    /** 不能通过refreshTable去改变pagination的有无分页 */
    if (this.controls.pagination) {
      this.setPagination(pagination);
    }
    this.setFilters(filters);
    this.setSorter(sorter);

    this.showLoading();

    return this.requestDataSource()
      .then((data) => {
        if (!this.controls.pagination) {
          this.setDataSource(data);
        } else {
          const { list, pageSize, total } = data;
          this.setPagination({ pageSize, total });
          this.setDataSource(list);
        }

        /**
         * 内部（onChange）触发不清空 selectedRowKeys
         */
        if (!internal && this.controls.selectedRowKeys && this.controls.selectedRowKeys.length) {
          if (this.tableProps.disableClearSelectedRows !== true) {
            this.clearRowSelection();
          }
        }
        this.hideLoading();
      })
      .catch(() => {
        this.hideLoading();
      });
  };

  /**
   * 默认刷新
   */
  public resetTable = (isRefresh?: boolean) => {
    if (this.controls.pagination) {
      this.setPagination({ current: 1 });
    }

    if (this.controls.filters) {
      const resetFilters = {} as Filters;
      Object.keys(this.controls.filters).forEach((columnKey: string) => {
        resetFilters[columnKey] = null;
      });

      this.setFilters(resetFilters);
    }

    if (this.controls.sorter && this.controls.sorter.columnKey) {
      this.setSorter({
        columnKey: this.controls.sorter.columnKey,
        order: false,
      });
    }

    if (isRefresh !== false) {
      return this.refreshTable();
    }
  };

  public setDataSource = (dataSource: any[]) => {
    this.controls.dataSource = dataSource;
    this.forceRootUpdate();
  };

  private setPagination = (pagination: PaginationConfig) => {
    if (pagination) {
      this.controls.pagination = assignWithDefined(this.controls.pagination, pagination);
      this.forceRootUpdate();
    }
  };

  /**
   * 例如: {a: undefined, b: [1], c: null}
   * a 会被 antd table忽略
   * b 会修改掉过滤信息
   * c 会清空该列的过滤信息
   */
  private setFilters = (filters: Filters) => {
    if (filters) {
      if (!this.controls.filters) {
        this.controls.filters = {};
      }
      Object.keys(filters).forEach((columnKey) => {
        const filterValue = filters[columnKey];
        if (!isUndefined(filterValue)) {
          // undefined会被忽略
          this.controls.filters[columnKey] = filterValue;
        } else {
          // undefined 设置为 null
          this.controls.filters[columnKey] = null;
        }
      });
      this.forceRootUpdate();
    }
  };

  private setSorter = (sorter) => {
    if (sorter) {
      this.controls.sorter = sorter;
      this.forceRootUpdate();
    }
  };

  private clearRowSelection = () => {
    this.setSelectedRowKeys([]);
    this.records.selectedRows = [];
  };

  private getPaging = () => {
    return pick(this.controls, ['pagination', 'filters', 'sorter']);
  };

  private getDataSource = () => {
    return this.controls.dataSource;
  };

  private getSelectedRowKeys = (): string[] | undefined => {
    return this.controls.selectedRowKeys;
  };

  private getSelectedRows = () => {
    return this.records.selectedRows;
  };

  // ================== 内部使用 ====================

  private getInternalHooks = (key) => {
    if (key === HOOK_MARK) {
      return {
        setControls: this.setControls,
        getControls: this.getControls,
        getCtx: this.getCtx,

        saveTableProps: this.saveTableProps,

        getInternalControls: this.getInternalControls,

        showLoading: this.showLoading,
        hideLoading: this.hideLoading,

        onChange: this.onChange,
        onRowSelectionChange: this.onRowSelectionChange,

        saveModalFormRef: (modalFormRef) => {
          this.modalFormRef = modalFormRef;
        },

        saveDrawerFormRef: (drawerFormRef) => {
          this.drawerFormRef = drawerFormRef;
        },
      };
    }
  };

  // ===================== Internal APIS =========================
  private getCtx = (extraCtx = {}) => {
    const table = this.getTable();

    const finalCtx = assign(extraCtx, {
      table,
      // 内部使用
      __modalGetter: (type: 'modal' | 'drawer') => {
        return type === 'modal' ? this.modalFormRef.current : this.drawerFormRef.current;
      },
    });
    const { ctxGetter } = this.tableProps;

    if (ctxGetter) {
      finalCtx.ctxGetter = ctxGetter;
    }
    return finalCtx;
  };

  private onRowSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setSelectedRowKeys(selectedRowKeys);

    this.records.selectedRows = selectedRows;

    if (this.tableProps.rowSelection && this.tableProps.rowSelection.onChange) {
      this.tableProps.rowSelection.onChange(selectedRowKeys, selectedRows);
    }
  };

  private onChange = (pagination: Pagination, filters: Filters, sorter: Sorter, currentData) => {
    this.refreshTable(pagination, filters, sorter, true);
    if (this.tableProps.onChange) {
      this.tableProps.onChange(pagination, filters, sorter, currentData);
    }
  };

  private saveTableProps = (tableProps) => {
    this.tableProps = tableProps;
  };

  // 内部受控设置
  private showLoading = () => {
    if (!this.internalControls.loading) {
      this.internalControls.loading = true;
      this.forceRootUpdate();
    }
  };

  private hideLoading = () => {
    if (this.internalControls.loading) {
      this.internalControls.loading = false;
      this.forceRootUpdate();
    }
  };

  private setControls = (tableControls: TableControlProps) => {
    this.controls = tableControls;
  };

  private getControls = () => {
    return this.controls;
  };

  private getInternalControls = () => {
    return this.internalControls;
  };

  // ==================== Helper ====================
  private setSelectedRowKeys(selectedRowKeys) {
    this.controls.selectedRowKeys = selectedRowKeys;
    this.forceRootUpdate();
  }

  private requestDataSource() {
    const { pagination, filters, sorter } = this.getControls();
    const finalSorter = omit(sorter, ['column', 'field']);
    const params = pagination
      ? {
          pageSize: pagination.pageSize,
          current: pagination.current,
          filters,
          sorter: finalSorter,
        }
      : {
          filters,
          sorter: finalSorter,
        };

    return triggerActionPlugin(
      this.getCtx(),
      isFunction(this.tableProps.remoteDataSource)
        ? this.tableProps.remoteDataSource
        : assign({}, this.tableProps.remoteDataSource, {
            params: assign({}, this.tableProps.remoteDataSource!.params, params),
          }),
    );
  }
}

export default function useTableContext() {
  const tableRef = React.useRef<{
    getTable: () => TableInstance;
    getInternalHooks: (key: string) => any;
  }>(null);
  const [, forceUpdate] = React.useState();

  if (!tableRef.current) {
    const forceReRender = () => {
      forceUpdate({});
    };

    const tableStore = new ContextStore(forceReRender);
    tableRef.current = tableStore.getContext();
  }

  return [tableRef.current];
}
