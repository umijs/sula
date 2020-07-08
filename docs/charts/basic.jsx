import React from 'react';
import Charts from '@sula/charts';
import { Divider, Radio } from 'antd';

const ChartBasic = () => {
  const chartRef = React.useRef(null);

  const lineOptions = {
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  };

  const stepLineOptions = {
    title: {
      text: 'Step Line',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Step Start', 'Step Middle', 'Step End'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
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
        name: 'Step Start',
        type: 'line',
        step: 'start',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: 'Step Middle',
        type: 'line',
        step: 'middle',
        data: [220, 282, 201, 234, 290, 430, 410],
      },
      {
        name: 'Step End',
        type: 'line',
        step: 'end',
        data: [450, 432, 401, 454, 590, 530, 510],
      },
    ],
  };

  const [option, setOption] = React.useState(lineOptions);
  const [cur, setCur] = React.useState('line');

  return (
    <div>
      <Charts option={option} ref={chartRef} style={{ height: 360 }} />
      <Divider />
      <Radio.Group
        value={cur}
        onChange={(e) => {
          const type = e.target.value;
          chartRef.current.clear();
          if (type === 'line') {
            setOption(lineOptions);
          } else if (type === 'stepLine') {
            setOption(stepLineOptions);
          } else if(type === 'updateLine') {
            setOption({
              ...lineOptions,
              series: [
                {
                  data: lineOptions.series[0].data.map((val, index) => val + Math.random() * (1000 * (index % 2 ? -1 : 1))),
                  type: 'line',
                }
              ]
            })
          }

          setCur(type);
        }}
      >
        <Radio.Button value="line">Line</Radio.Button>
        <Radio.Button value="updateLine">Update Line</Radio.Button>
        <Radio.Button value="stepLine">Step Line</Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default ChartBasic;
