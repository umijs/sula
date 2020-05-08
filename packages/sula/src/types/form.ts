import { FormInstance as AFormInstance, FormProps as AFormProps } from 'antd/lib/form';

export type FieldValue = any;
export type FieldSource = any;

export interface FormInstance extends AFormInstance {
  setFieldSource: (name: FieldNamePath, source: FieldSource) => void;
  setFieldValue: (name: FieldNamePath, value: FieldValue) => void;
  setFieldVisible: (name: FieldNamePath, visible: boolean) => void;
  setFieldDisabled: (name: FieldNamePath, disaabled: boolean) => void;
  validateGroupFields: (groupName: FieldNamePath) => void;
}

export type Mode = 'create' | 'edit' | 'view';

export type FormCtx = {
  form: FormInstance;
  mode: Mode;
  ctxGetter?: () => any;
  name?: FieldNamePath;
  [key: string]: any; // 例如
};

export type FieldNameList = string[];
export type FieldNamePath = string | FieldNameList;
