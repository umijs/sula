import React from 'react';
import InternalTable from './Table';

import { TableProps as Props, TableInstance as TableInstanceProps } from './Table';

export const Table = React.forwardRef<TableInstanceProps, Props>(InternalTable) as (
  props: Props & { ref?: React.Ref<TableInstanceProps> },
) => React.ReactElement;

export interface TableProps extends Props {}
export interface TableInstance extends TableInstanceProps {}
