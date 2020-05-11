import React from 'react';
import Field from './Field';
import FieldGroup from './FieldGroup';
import FormAction from './FormAction';
import MediaQueries from './MediaQueries';
import Form, { FormProps as InternalFormProps, FormInstance as FormInstanceProps } from './Form';
import { FieldGroupProps as InternalFieldGroupProps } from './FieldGroup';
import { FieldProps as InternalFieldProps } from './Field';

const InternalForm = React.forwardRef<FormInstanceProps, InternalFormProps>(Form);

type InternalForm = typeof InternalForm;

interface RefForm extends InternalForm {
  Field: typeof Field;
  FieldGroup: typeof FieldGroup;
}

const RefForm: RefForm = InternalForm as RefForm;

RefForm.Field = Field;
RefForm.FieldGroup = FieldGroup;

export { Field, FieldGroup, FormAction, MediaQueries };

export default InternalForm;

export interface FormProps extends InternalFormProps {};
export interface FieldGroupProps extends InternalFieldGroupProps {};
export interface FieldProps extends InternalFieldProps {};
export interface FormInstance extends FormInstanceProps {};
