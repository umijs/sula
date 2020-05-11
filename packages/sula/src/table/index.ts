import React from 'react';
import RefTable from './Table';

export const Table = React.forwardRef(RefTable);

import { TableProps as Props, TableInstance as TableInstanceProps } from './Table';

export interface TableProps extends Props {}
export interface TableInstance extends TableInstanceProps {}
