import { TableProps } from 'antd/lib/table'

export type RecordType = any;

export interface TableInstance {};



export type TableCtx = {
  table: TableInstance;
  text: any;
  record?: RecordType;
  recordIndex?: number;
  pageData?: RecordType[];
}
