export type FieldSourceItem = {
  text?: string | number;
  label?: string | number;
  value: string | number;
  children?: FieldSource;
}

export type FieldSource = Array<string | number | FieldSourceItem>;