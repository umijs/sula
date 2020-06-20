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
export declare type ChartTooltip = Omit<echarts.EChartOption.Tooltip, 'formatter'> & {
    formatter?: string | Function | Format[];
};
export declare type ChartOption = Omit<echarts.EChartOption, 'tooltip'> & {
    tooltip?: ChartTooltip;
};
export declare type EChartOption = echarts.EChartOption;
export interface ChartsProps extends ChartContainerProps, ChartConfig {
    option: ChartOption;
}
export declare type ChartInstance = echarts.ECharts;
export declare type ChartRef = {
    current: ChartInstance;
};
export declare type Echarts = typeof echarts;
