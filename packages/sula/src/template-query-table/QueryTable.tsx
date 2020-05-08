import React from 'react';
import isNumber from 'lodash/isNumber';
import assign from 'lodash/assign';
import Form, { MediaQueries } from '../form';
import { FormProps } from '../form/Form';
import { RequestConfig } from '../types/request';
import { RenderPlugin } from '../types/plugin';
import { FieldProps } from '../form/Field';
import { TableInstance, TableProps } from '../table/Table';
import { RecordType } from '../types/table';
import { FormInstance } from '../types/form';
import Table from '../table';
import QueryFields from './QueryFields';

export interface CreateFormProps extends FormProps {
  fields: FieldProps[];
  visibleFieldsCount?: number;
  actions?: RenderPlugin[];
  leftActions?: RenderPlugin[];

  remoteDataSource: RequestConfig;
  columns: any[];
  rowKey: (record: RecordType, index: number) => React.Key | React.Key;

  formProps?: FormProps;
  tableProps?: TableProps;
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

type Props = CreateFormProps & typeof defaultProps;

export default class CreateForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  private remoteDataSource: RequestConfig;

  private formRef = React.createRef<FormInstance>();
  private tableRef = React.createRef<TableInstance>();

  componentDidMount() {
    const { autoInit, initialValues } = this.props;
    if (autoInit) {
      this.tableRef.current.refreshTable(null, initialValues);
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

    this.remoteDataSource = assign(remoteDataSource, { init: false });

    return (
      <Table
        {...tableProps}
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
      <div>
        {this.renderForm()}
        {this.renderTable()}
      </div>
    );
  }
}
