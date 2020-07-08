/**
 * title: |
 *   trigger: item 格式化
 * desc: |
 *   基于 [numeral](http://numeraljs.com/) 格式化
 */

import React from 'react';
import Charts, { numeral } from '@sula/charts';

const FormatterBasic = () => {
  const chartRef = React.useRef(null);

  const lineOptions = {
    tooltip: {
      formatter: [
        '0a',
      ]
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => {
          return numeral(value).format('0a');
        }
      }
    },
    series: [
      {
        name: '人数',
        data: [820, 2732, 1901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  };

  return <Charts option={lineOptions} ref={chartRef} style={{ height: 360 }} />;
};

export default FormatterBasic;
