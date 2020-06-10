import React from 'react';
import echarts from 'echarts';

export interface ChartContainerProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface ChartConfig {
  dom: HTMLDivElement | HTMLCanvasElement;
  theme?: object | string;
  opts?: {
    devicePixelRatio?: number;
    renderer?: string;
    width?: number | string;
    height?: number | string;
  };
}

export interface ChartsProps extends ChartContainerProps, ChartConfig {
  option: echarts.EChartOption;
}

export type ChartInstance = echarts.ECharts;
