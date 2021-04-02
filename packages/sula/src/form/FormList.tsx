import React from 'react';
import { Form as AForm, Row, Col } from 'antd';
import { FormListProps as AFormListProps } from 'antd/lib/form';
import FieldGroup, { FieldGroupProps } from './FieldGroup';
import FieldGroupContext, { FieldGroupContextProps } from './FieldGroupContext';
import { needWrapCols } from './utils/layoutUtil';

const FormItem = AForm.Item;

export type FormListProps = Omit<
  FieldGroupProps,
  'fields' | 'actionsPosition' | 'actionsRender' | 'children'
> &
  AFormListProps & { label?: string | React.ReactNode };

export default class FormList extends React.Component<FormListProps> {
  static contextType = FieldGroupContext;

  context: FieldGroupContextProps = null!;

  formListLayout = (formList: React.ReactElement) => {
    const { label } = this.props;
    const { itemLayout } = this.context;

    const { offset, span, labelCol, wrapperCol } = itemLayout;

    let formListElem = (
      <FormItem labelCol={labelCol} wrapperCol={wrapperCol} label={label}>
        {formList}
      </FormItem>
    );

    if (needWrapCols(span!) || offset) {
      formListElem = (
        <Col span={span} offset={offset}>
          {formListElem}
        </Col>
      );
    }

    return formListElem;
  };

  render() {
    const {
      name,
      layout,
      itemLayout,
      initialVisible,
      dependency,
      container,
      ...aFormListProps
    } = this.props;
    return this.formListLayout(
      <FieldGroup
        name={name}
        layout={layout}
        itemLayout={itemLayout}
        initialVisible={initialVisible}
        dependency={dependency}
        container={container}
        isList
      >
        <AForm.List {...aFormListProps} name={name} />
      </FieldGroup>,
    );
  }
}
