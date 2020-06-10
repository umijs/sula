import React from 'react';
import Charts from '@sula/charts';

const ChartFormatter = () => {
  const dataset =  {
    // 提供一份数据。
    source: [
      ['product', '2015', '2016', '2017', '2018', '2019'],
      ['Matcha Latte', 43.3, 85.8, 93.7, 77.2, 56.7],
      ['Milk Tea', 83.1, 73.4, 55.1, 87.1, 29],
      ['Cheese Cocoa', 86.4, 65.2, 82.5, 93, 40],
    ],
  };
  // bar 是二位的
  const barOptions = {
    dataset,
    legend: {},
    tooltip: {
    },
    // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
    xAxis: { type: 'category' },
    // 声明一个 Y 轴，数值轴。
    yAxis: {},
    // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
  };


  return <div>
    <Charts option={barOptions} style={{ height: 360 }} />
  </div>;
};

export default ChartDataset;
