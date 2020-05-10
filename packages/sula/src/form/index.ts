import React from 'react';
import Field from './Field';
import FieldGroup from './FieldGroup';
import FormAction from './FormAction';
import MediaQueries from './MediaQueries';
import Form, { FormProps as InternalFormProps } from './Form';
import { FormInstance } from 'antd/lib/form';

const InternalForm = React.forwardRef<FormInstance, InternalFormProps>(Form);

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

export { FormProps, FormInstance } from './Form';
export { FieldGroupProps } from './FieldGroup';
export { FieldProps } from './Field';
