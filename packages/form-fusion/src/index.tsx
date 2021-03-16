import { FormInstance, Store } from '@sula-form/core';
import * as React from 'react';
import FieldForm, { FormProps } from './Form';
import { useForm } from './registry/useForm';

const InternalForm = React.forwardRef<FormInstance, FormProps>(FieldForm) as <FieldsValue = Store>(
  props: React.PropsWithChildren<FormProps<FieldsValue>> & {
    ref?: React.Ref<FormInstance<FieldsValue>>;
  },
) => React.ReactElement;

type InternalForm = typeof InternalForm;

interface RefForm extends InternalForm {
  useForm: typeof useForm;
}

const RefForm: RefForm = InternalForm as RefForm;

RefForm.useForm = useForm;

export { FormInstance, useForm, FormProps };

export default RefForm;
