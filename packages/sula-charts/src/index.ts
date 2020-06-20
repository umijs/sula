import React from 'react';

import Charts, { echarts } from './charts';
import { numeral } from './formatter';

const InternalCharts = React.forwardRef(Charts);

export default InternalCharts;

export { echarts, numeral };
