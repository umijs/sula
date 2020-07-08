import React from 'react';
import echarts from 'echarts';
import { Format } from './formatter';

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

export type ChartTooltip = Omit<echarts.EChartOption.Tooltip, 'formatter'> & {
  formatter?: string | Function | Format[];
};
export type ChartOption = Omit<echarts.EChartOption, 'tooltip'> & { tooltip?: ChartTooltip };

export type EChartOption = echarts.EChartOption;

export interface ChartsProps extends ChartContainerProps, ChartConfig {
  option: ChartOption;
}

export type ChartInstance = echarts.ECharts;

export type ChartRef = { current: ChartInstance };

export type Echarts = typeof echarts;
