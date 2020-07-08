import React from 'react';
import Charts from '@sula/charts';

const FormatterBasic = () => {
  const chartRef = React.useRef(null);

  const lineOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: [
        { type: '0,0', unit: '人' },
        { type: '0,0', unit: '人' },
      ],
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '男',
        data: [820, 2732, 1901, 934, 1290, 1330, 1320],
        type: 'line',
      },
      {
        name: '女',
        data: [1020, 1932, 1001, 834, 1880, 1630, 720],
        type: 'line',
      },
    ],
  };

  return <Charts option={lineOptions} ref={chartRef} style={{ height: 360 }} />;
};

export default FormatterBasic;
