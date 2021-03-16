import * as React from 'react';
import { Form as NextForm } from '@alifd/next';
import { FormProps as NextFormProps } from '@alifd/next/types/form';
import { FormInstance, Store } from '@sula-form/core';
import { useForm } from './registry/useForm';
import { HOOK_MARK } from './registry/Form';
import { InternalFormInstance } from './types';

export interface FormProps<FieldsValue = Store>
  extends Omit<NextFormProps, 'field' | 'value' | 'form'> {
  initialValues?: FieldsValue;
  form?: FormInstance<FieldsValue>;
}

const Form: React.ForwardRefRenderFunction<FormInstance, FormProps> = (props: FormProps, ref) => {
  const { form, initialValues, ...formProps } = props;

  const mountRef = React.useRef<boolean>(false);

  const [formInstance] = useForm(form);

  const { createForm, getInnerForm } = (formInstance as InternalFormInstance).getInternalHooks(
    HOOK_MARK,
  );

  const field = getInnerForm();

  if (!mountRef.current) {
    createForm({
      values: initialValues,
    });
    mountRef.current = true;
  }

  React.useImperativeHandle(ref, () => formInstance);

  return <NextForm field={field} {...formProps}></NextForm>;
};

export default Form;