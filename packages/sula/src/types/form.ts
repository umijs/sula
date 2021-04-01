export type Mode = 'create' | 'edit' | 'view';

export type FieldNameList = string[];
export type FieldNamePath = string | FieldNameList;

export type FieldSource = Array<{
  text: string;
  value: string | number | boolean;
  [key: string]: any;
}>;
