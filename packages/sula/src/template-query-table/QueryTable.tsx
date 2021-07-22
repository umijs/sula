import React from 'react';
import assign from 'lodash/assign';
import cx from 'classnames';
import { FormProps } from '../form';
import { RequestConfig } from '../types/request';
import { TableInstance, TableProps } from '../table/Table';
import { FormInstance } from '../types/form';
import { Table } from '../table';
import warning from '../_util/warning';
import './style/query-table.less';
import QueryForm from './QueryForm';
import LocaleReceiver from '../localereceiver';

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
  visibleFieldsCount?: number | true;

  formProps?: Omit<FormProps, FormPropsPicks>;
  tableProps?: Omit<TableProps, TablePropsPicks>;
  autoInit?: boolean;
}

const defaultProps = {
  formProps: {},
  tableProps: {},
  fields: [],
  columns: [],
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

  renderForm = (locale) => {
    const { formProps, layout, itemLayout, fields, initialValues, visibleFieldsCount } = this.props;
    const formActionsRender = formProps?.actionsRender ?? [
          {
            type: 'button',
            props: {
              type: 'primary',
              children: locale.queryText,
            },
            action: [
              { type: 'validateQueryFields', resultPropName: '$queryFieldsValue' },
              {
                type: 'refreshTable',
                args: [{ current: 1 }, '#{result}'],
              },
            ],
          },
          {
            type: 'button',
            props: {
              children: locale.resetText,
            },
            action: [
              'resetFields',
              {
                type: 'resetTable',
                args: [false],
              },
              {
                type: 'refreshTable',
                args: [{ current: 1 }, '#{form.getFieldsValue(true)}'],
              },
            ],
          },
        ];

    return (
      <QueryForm
        {...formProps}
        ctxGetter={() => {
          return {
            table: this.tableRef.current,
          };
        }}
        ref={this.formRef}
        hasBottomBorder={this.hasActionsRender()}
        layout={layout}
        itemLayout={itemLayout}
        fields={fields}
        initialValues={initialValues}
        visibleFieldsCount={visibleFieldsCount}
        actionsRender={formActionsRender}
      />
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
      <LocaleReceiver>
        {(locale) => {
          return (
            <React.Fragment>
              {this.props.fields && this.props.fields.length ? this.renderForm(locale) : null}
              {this.renderTable()}
            </React.Fragment>
          );
        }}
      </LocaleReceiver>
    );
  }
}
