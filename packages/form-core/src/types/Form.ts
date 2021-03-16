// rc-field-form interface.ts
export type InternalNamePath = (string | number)[];
export type NamePath = string | number | InternalNamePath[];
export type NameList = NamePath[];

export type NameKey = NamePath;
export type NameKeyList = NameList;

export type FieldValue = any;

export type Store = {
  [name: string]: FieldValue;
}

