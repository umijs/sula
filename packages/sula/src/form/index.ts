import React from 'react';
import Field from './Field';
import FormList from './FormList';
import FieldGroup from './FieldGroup';
import FormAction from './FormAction';
import MediaQueries from './MediaQueries';
import {
  default as FieldForm,
  FormProps as InternalFormProps,
  FormInstance as FormInstanceProps,
} from './Form';
import { FieldGroupProps as InternalFieldGroupProps } from './FieldGroup';
import { FieldProps as InternalFieldProps } from './Field';
import useFormContext from './useFormContext';

const InternalForm = React.forwardRef<FormInstanceProps, InternalFormProps>(FieldForm) as (
  props: React.PropsWithChildren<InternalFormProps> & { ref?: React.Ref<FormInstanceProps> },
) => React.ReactElement;

type InternalForm = typeof InternalForm;

const useForm = useFormContext;
interface RefForm extends InternalForm {
  Field: typeof Field;
  FieldGroup: typeof FieldGroup;
  FormList: typeof FormList;
  useForm: typeof useForm;
}

const RefForm: RefForm = InternalForm as RefForm;

RefForm.Field = Field;
RefForm.FieldGroup = FieldGroup;
RefForm.FormList = FormList;
RefForm.useForm = useForm;

const Form = RefForm;

export { Form, Field, FieldGroup, FormList, FormAction, MediaQueries, useForm };

export interface FormProps extends InternalFormProps {}
export interface FieldGroupProps extends InternalFieldGroupProps {}
export interface FieldProps extends InternalFieldProps {}
export interface FormInstance extends FormInstanceProps {}
