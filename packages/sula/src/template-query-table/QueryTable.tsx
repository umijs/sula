import React from 'react';
import assign from 'lodash/assign';
import cx from 'classnames';
import { Form, FormProps } from '../form';
import { RequestConfig } from '../types/request';
import { TableInstance, TableProps } from '../table/Table';
import { FormInstance } from '../types/form';
import { Table } from '../table';
import QueryFields from './QueryFields';
import warning from '../_util/warning';
import './style/query-table.less';

type FormPropsPicks = 'fields' | 'initialValues' | 'layout' | 'itemLayout';
type TablePropsPicks =
  | 'remoteDataSource'
  | 'actionsRender'
  | 'leftActionsRender'
  | 'rowKey'
  | 'columns'
  | 'rowSelection';

export interface QueryTableProps
  extends Pick<FormProps, FormPropsPicks>,
    Pick<TableProps, TablePropsPicks> {
  visibleFieldsCount?: number;

  formProps?: Omit<FormProps, FormPropsPicks>;
  tableProps?: Omit<TableProps, TablePropsPicks>;
  autoInit?: boolean;
}

const defaultProps = {
  formProps: {},
  tableProps: {},
  fields: [],
  columns: [],
  visibleFieldsCount: 5,
  itemLayout: {
    cols: 3,
  },
  autoInit: true,
};

const prefixCls = 'sula-template-query-table';

type Props = QueryTableProps & typeof defaultProps;

export default class QueryTable extends React.Component<Props> {
  static defaultProps = defaultProps;

  private remoteDataSource: RequestConfig;

  private formRef = React.createRef<FormInstance>();
  private tableRef = React.createRef<TableInstance>();

  componentDidMount() {
    const { autoInit, initialValues } = this.props;
    if (autoInit && this.remoteDataSource) {
      this.tableRef.current.refreshTable(null, initialValues, null, true);
    }
  }

  hasActionsRender = () => {
    const { actionsRender, leftActionsRender, rowSelection } = this.props;

    return (
      rowSelection ||
      (actionsRender && actionsRender.length) ||
      (leftActionsRender && leftActionsRender.length)
    );
  };

  renderForm = () => {
    const { formProps, layout, itemLayout, fields, initialValues, visibleFieldsCount } = this.props;

    return (
      <Form
        {...formProps}
        initialValues={initialValues}
        ref={this.formRef}
        itemLayout={itemLayout}
        layout={layout}
        ctxGetter={() => {
          return { table: this.tableRef.current };
        }}
      >
        <QueryFields
          fields={fields}
          visibleFieldsCount={visibleFieldsCount}
          itemLayout={itemLayout}
          layout={layout}
          getFormInstance={() => this.formRef.current}
          hasActionsRender={this.hasActionsRender()}
        />
      </Form>
    );
  };

  renderTable = () => {
    const {
      tableProps,
      columns,
      actionsRender,
      leftActionsRender,
      remoteDataSource,
      rowSelection,
      rowKey,
    } = this.props;

    if (!remoteDataSource) {
      warning(false, 'QueryTable', '`remoteDataSource` is required.');
    }

    this.remoteDataSource = assign(remoteDataSource, { init: false });

    return (
      <Table
        {...tableProps}
        className={cx(tableProps.className, `${prefixCls}`)}
        rowSelection={rowSelection}
        columns={columns}
        actionsRender={actionsRender}
        leftActionsRender={rowSelection ? ['rowselection'] : leftActionsRender}
        remoteDataSource={this.remoteDataSource}
        rowKey={rowKey}
        ref={this.tableRef}
      />
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.props.fields && this.props.fields.length ? this.renderForm() : null}
        {this.renderTable()}
      </React.Fragment>
    );
  }
}
