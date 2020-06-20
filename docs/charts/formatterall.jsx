import React from 'react';
import Charts, { echarts } from '@sula/charts';
import geoJson from './hangzhou.json';

const products = ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie'];
const years = ['2015', '2016', '2017'];
const datas = [
  [8921, 9221, 3422, 5513],
  [4530, 3926, 9121, 7682],
  [3721, 4333, 7290, 2887],
];

const ChartDataset = () => {
  // bar 是二维的
  const barOptions = {
    legend: {},
    tooltip: {
      formatter: ['$0,0.00'],
    },
    // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
    xAxis: { type: 'category', data: products },
    // 声明一个 Y 轴，数值轴。
    yAxis: {},
    // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
    series: [
      { name: years[0], type: 'bar', data: datas[0] },
      { name: years[1], type: 'bar', data: datas[1] },
      { name: years[2], type: 'bar', data: datas[2] },
    ],
  };

  // 饼图是一维的
  const pieOptions = {
    legend: {
      data: years,
    },
    tooltip: {
      formatter: ['0,0'],
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        data: datas[0].map((item, index) => {
          return {
            value: item,
            name: years[index],
          };
        }),
      },
    ],
  };

  // 线图是一维的
  const lineOptions = {
    legend: {},
    tooltip: {
      trigger: 'axis',
      formatter: ['0a', '0a', '0a'],
    },
    xAxis: { type: 'category', data: years },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: products[0],
        type: 'line',
        data: datas[0],
      },
      {
        name: products[1],
        type: 'line',
        data: datas[1],
      },
      {
        name: products[2],
        type: 'line',
        data: datas[2],
      },
    ],
  };

  // 雷达图
  const radarOptions = {
    tooltip: {
      formatter: [
        {
          type: '0,0',
          unit: '力量值',
        },
      ],
    },
    legend: {
      data: years,
    },
    radar: {
      indicator: products.map((item) => {
        return {
          name: item,
        };
      }),
    },
    series: [
      {
        type: 'radar',
        data: years.map((year, index) => {
          return {
            name: year,
            value: datas[index],
          };
        }),
      },
    ],
  };

  // 散点图
  const scatterOptions = {
    tooltip: {
      formatter: [
        {
          type: '0,0.00',
          title: '',
          unit: '秒',
        },
      ],
    },
    xAxis: {},
    yAxis: {},
    series: [
      {
        type: 'scatter',
        symbolSize: 20,
        data: [
          [10.0, 8.04],
          [8.0, 6.95],
          [13.0, 7.58],
          [9.0, 8.81],
          [11.0, 8.33],
          [14.0, 9.96],
          [6.0, 7.24],
          [4.0, 4.26],
          [12.0, 10.84],
          [7.0, 4.82],
          [5.0, 5.68],
        ],
      },
    ],
  };

  // 热力图
  const hours = [
    '12a',
    '1a',
    '2a',
    '3a',
    '4a',
    '5a',
    '6a',
    '7a',
    '8a',
    '9a',
    '10a',
    '11a',
    '12p',
    '1p',
    '2p',
    '3p',
    '4p',
    '5p',
    '6p',
    '7p',
    '8p',
    '9p',
    '10p',
    '11p',
  ];
  const days = ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

  let heatmapData = [
    [0, 0, 5],
    [0, 1, 1],
    [0, 2, 0],
    [0, 3, 0],
    [0, 4, 0],
    [0, 5, 0],
    [0, 6, 0],
    [0, 7, 0],
    [0, 8, 0],
    [0, 9, 0],
    [0, 10, 0],
    [0, 11, 2],
    [0, 12, 4],
    [0, 13, 1],
    [0, 14, 1],
    [0, 15, 3],
    [0, 16, 4],
    [0, 17, 6],
    [0, 18, 4],
    [0, 19, 4],
    [0, 20, 3],
    [0, 21, 3],
    [0, 22, 2],
    [0, 23, 5],
    [1, 0, 7],
    [1, 1, 0],
    [1, 2, 0],
    [1, 3, 0],
    [1, 4, 0],
    [1, 5, 0],
    [1, 6, 0],
    [1, 7, 0],
    [1, 8, 0],
    [1, 9, 0],
    [1, 10, 5],
    [1, 11, 2],
    [1, 12, 2],
    [1, 13, 6],
    [1, 14, 9],
    [1, 15, 11],
    [1, 16, 6],
    [1, 17, 7],
    [1, 18, 8],
    [1, 19, 12],
    [1, 20, 5],
    [1, 21, 5],
    [1, 22, 7],
    [1, 23, 2],
    [2, 0, 1],
    [2, 1, 1],
    [2, 2, 0],
    [2, 3, 0],
    [2, 4, 0],
    [2, 5, 0],
    [2, 6, 0],
    [2, 7, 0],
    [2, 8, 0],
    [2, 9, 0],
    [2, 10, 3],
    [2, 11, 2],
    [2, 12, 1],
    [2, 13, 9],
    [2, 14, 8],
    [2, 15, 10],
    [2, 16, 6],
    [2, 17, 5],
    [2, 18, 5],
    [2, 19, 5],
    [2, 20, 7],
    [2, 21, 4],
    [2, 22, 2],
    [2, 23, 4],
    [3, 0, 7],
    [3, 1, 3],
    [3, 2, 0],
    [3, 3, 0],
    [3, 4, 0],
    [3, 5, 0],
    [3, 6, 0],
    [3, 7, 0],
    [3, 8, 1],
    [3, 9, 0],
    [3, 10, 5],
    [3, 11, 4],
    [3, 12, 7],
    [3, 13, 14],
    [3, 14, 13],
    [3, 15, 12],
    [3, 16, 9],
    [3, 17, 5],
    [3, 18, 5],
    [3, 19, 10],
    [3, 20, 6],
    [3, 21, 4],
    [3, 22, 4],
    [3, 23, 1],
    [4, 0, 1],
    [4, 1, 3],
    [4, 2, 0],
    [4, 3, 0],
    [4, 4, 0],
    [4, 5, 1],
    [4, 6, 0],
    [4, 7, 0],
    [4, 8, 0],
    [4, 9, 2],
    [4, 10, 4],
    [4, 11, 4],
    [4, 12, 2],
    [4, 13, 4],
    [4, 14, 4],
    [4, 15, 14],
    [4, 16, 12],
    [4, 17, 1],
    [4, 18, 8],
    [4, 19, 5],
    [4, 20, 3],
    [4, 21, 7],
    [4, 22, 3],
    [4, 23, 0],
    [5, 0, 2],
    [5, 1, 1],
    [5, 2, 0],
    [5, 3, 3],
    [5, 4, 0],
    [5, 5, 0],
    [5, 6, 0],
    [5, 7, 0],
    [5, 8, 2],
    [5, 9, 0],
    [5, 10, 4],
    [5, 11, 1],
    [5, 12, 5],
    [5, 13, 10],
    [5, 14, 5],
    [5, 15, 7],
    [5, 16, 11],
    [5, 17, 6],
    [5, 18, 0],
    [5, 19, 5],
    [5, 20, 3],
    [5, 21, 4],
    [5, 22, 2],
    [5, 23, 0],
    [6, 0, 1],
    [6, 1, 0],
    [6, 2, 0],
    [6, 3, 0],
    [6, 4, 0],
    [6, 5, 0],
    [6, 6, 0],
    [6, 7, 0],
    [6, 8, 0],
    [6, 9, 0],
    [6, 10, 1],
    [6, 11, 0],
    [6, 12, 2],
    [6, 13, 1],
    [6, 14, 3],
    [6, 15, 4],
    [6, 16, 0],
    [6, 17, 0],
    [6, 18, 0],
    [6, 19, 0],
    [6, 20, 1],
    [6, 21, 2],
    [6, 22, 2],
    [6, 23, 6],
  ];

  heatmapData = heatmapData.map(function (item) {
    return [item[1], item[0], item[2] || '-'];
  });

  const heatmapOptions = {
    tooltip: {
      position: 'top',
      formatter: [
        {
          unit: 'hits',
        },
      ],
    },
    animation: false,
    grid: {
      height: '50%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
    },
    series: [
      {
        name: 'Punch Card',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const mapOptions = {
    tooltip: {
      formatter: [
        {
          unit: 'hits',
          label: (name) => `🎉  ${name}`,
        },
      ],
    },
    series: [
      {
        name: '区（市县）',
        type: 'map',
        map: 'hangzhou',
        zoom: 1.2,
        roam: 'move',
        data: [
          { name: '西湖区', value: 12 },
          { name: '下城区', value: 3 },
          { name: '上城区', value: 9 },
          { name: '余杭区', value: 10 },
          { name: '拱墅区', value: 7 },
          { name: '滨江区', value: 5 },
          { name: '江干区', value: 15 },
          { name: '萧山区', value: 6 },
          { name: '富阳区', value: 15 },
          { name: '临安区', value: 4 },
          { name: '建德市', value: 2 },
          { name: '桐庐县', value: 1 },
          { name: '淳安县', value: 1 },
        ],
      },
    ],
  };

  echarts.registerMap('hangzhou', geoJson);

  return (
    <div>
      <Charts option={barOptions} style={{ height: 360 }} />
      <Charts option={pieOptions} style={{ height: 360 }} />
      <Charts option={lineOptions} style={{ height: 360 }} />
      <Charts option={radarOptions} style={{ height: 360 }} />
      <Charts option={scatterOptions} style={{ height: 360 }} />
      <Charts option={heatmapOptions} style={{ height: 360 }} />
      <Charts option={mapOptions} style={{ height: 360 }} />
    </div>
  );
};

export default ChartDataset;
