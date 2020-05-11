import React from 'react';
import Field from './Field';
import FieldGroup from './FieldGroup';
import FormAction from './FormAction';
import MediaQueries from './MediaQueries';
import { default as InternalForm, FormProps as InternalFormProps, FormInstance as FormInstanceProps } from './Form';
import { FieldGroupProps as InternalFieldGroupProps } from './FieldGroup';
import { FieldProps as InternalFieldProps } from './Field';

export const Form = React.forwardRef<FormInstanceProps, InternalFormProps>(InternalForm);

type InternalForm = typeof InternalForm;

interface RefForm extends InternalForm {
  Field: typeof Field;
  FieldGroup: typeof FieldGroup;
}

const RefForm: RefForm = InternalForm as RefForm;

RefForm.Field = Field;
RefForm.FieldGroup = FieldGroup;

export { Field, FieldGroup, FormAction, MediaQueries };

export interface FormProps extends InternalFormProps {};
export interface FieldGroupProps extends InternalFieldGroupProps {};
export interface FieldProps extends InternalFieldProps {};
export interface FormInstance extends FormInstanceProps {};
