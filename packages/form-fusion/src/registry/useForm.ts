import { useRef } from 'react';
import { RegistryForm } from './Form';
import { FormInstance, Store } from '@sula-form/core';

export const useForm = <FieldsValue = Store>(form?: FormInstance<FieldsValue>): [FormInstance] => {
  const formRef = useRef<FormInstance>();
  
  if(!formRef.current) {
    if(form) {
      formRef.current = form;
    } else {
      formRef.current = new RegistryForm().getForm();
    }
  }

  return [formRef.current];
}