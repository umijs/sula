import React from 'react';
import RefTable from './Table';

const Table = React.forwardRef(RefTable);

export default Table;

import { TableProps as Props, TableInstance as TableInstanceProps } from './Table';

export interface TableProps extends Props {}
export interface TableInstance extends TableInstanceProps {}
