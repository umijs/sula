import { FieldSource, RecursivePartial } from '@sula/shared';
import { FieldValue, NameKey, NamePath, Store } from "./Form";


export interface FormInstance<FieldsValue = Store> {
  getFieldsValue(nameList?: NamePath[]): FieldsValue;
  setFieldsValue(fieldsValue: RecursivePartial<FieldsValue>): void;
  
  validateFields(nameList?: NamePath[]) : Promise<FieldsValue>;
  validateFieldGroup(groupName: NamePath) : Promise<FieldsValue>;
}

/** NameKey */
export interface InternalFormInstance<FieldsValue = Store> extends FormInstance<FieldsValue> {
  getFieldValue(namePath: NameKey): FieldValue;
  getFieldSource(namePath: NameKey): FieldSource;
  getFieldDisabled(namePath: NameKey): boolean;
  getFieldVisible(namePath: NameKey): boolean;

  setFieldValue(namePath: NameKey, fieldValue: FieldValue): void;
  setFieldSource(namePath: NameKey, fieldSource: FieldSource): void;
  setFieldDisabled(namePath: NameKey, fieldDisabled: boolean): void;
  setFieldVisible(namePath: NameKey, fieldVisible: boolean): void;
}