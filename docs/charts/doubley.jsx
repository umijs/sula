import React from 'react';
import Charts from '@sula/charts';

const ChartsDoubleY = () => {
  const lineOptions = {
    dataset: {
      // 提供一份数据。
      source: [
        ['product', '2015', 'count'],
        ['Matcha Latte', 43.3, 1],
        ['Milk Tea', 83.1, 2],
        ['Cheese Cocoa', 86.4, 7],
        ['Walnut Brownie', 72.4, 5],
      ],
    },
    legend: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        animation: false,
        label: {
          backgroundColor: '#505765',
        },
      },
    },
    // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
    xAxis: { type: 'category' },
    // 声明一个 Y 轴，数值轴。
    yAxis: [
      {
        name: 'rainfall (millmeter)',
      },
      {
        name: '(count)',
      },
    ],
    // 声明多个 line 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
    series: [{ type: 'line' }, { type: 'line', yAxisIndex: 1 }],
  };

  return <Charts option={lineOptions} style={{ height: 360 }} />;
};

export default ChartsDoubleY;
