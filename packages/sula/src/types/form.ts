export type Mode = 'create' | 'edit' | 'view';

export type FieldNameList = string[];
export type FieldNamePath = string | FieldNameList;

export type FieldSource = Array<{
  text: string;
  value: string;
  [key: string]: any;
}>;
