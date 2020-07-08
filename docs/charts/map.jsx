import React from 'react';
import Charts, { echarts } from '@sula/charts';
import geoJson from './hangzhou.json';

const mapOptions = {
  tooltip: {
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

const ChartMap = () => {
  return <Charts option={mapOptions} style={{ height: 400 }} />
};

export default ChartMap;
