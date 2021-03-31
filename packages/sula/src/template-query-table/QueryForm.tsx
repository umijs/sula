import React from 'react';
import { Form, FormInstance, FormProps } from '../form';
import QueryFields, { QueryFieldsProps } from './QueryFields';

export interface QueryFormProps
  extends Omit<FormProps, 'fields' | 'actionsPosition' | 'actionsRender'>,
    Omit<QueryFieldsProps, 'getFormInstance'> {}

const QueryForm: React.ForwardRefRenderFunction<FormInstance, QueryFormProps> = (props, ref) => {
  const {
    layout,
    itemLayout = {
      cols: 3,
    },
    fields,
    initialValues,
    visibleFieldsCount,
    actionsRender,
    hasBottomBorder,
    ...restProps
  } = props;
  const [form] = Form.useForm(restProps.form);

  React.useImperativeHandle(ref, () => form);

  return (
    <Form
      {...restProps}
      form={form}
      initialValues={initialValues}
      itemLayout={itemLayout}
      layout={layout}
    >
      <QueryFields
        fields={fields}
        visibleFieldsCount={visibleFieldsCount}
        getFormInstance={() => form}
        hasBottomBorder={hasBottomBorder}
        actionsRender={actionsRender}
      />
    </Form>
  );
};

export default React.forwardRef(QueryForm);
