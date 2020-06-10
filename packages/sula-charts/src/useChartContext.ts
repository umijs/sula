import React from 'react';
import debounce from 'lodash/debounce';
import isUndefined from 'lodash/isUndefined';
import { ChartRef } from './interface';

const ECHARTS_APIS = [
  'setOption',
  'getOption',
  'clear',
  'showLoading',
  'hideLoading',
  'on',
  'off',
  'getWidth',
  'getHeight',
  'dispose',
  'isDisposed',
  'getDataURL',
];

class ContextStore {
  chartRef: ChartRef;

  constructor(chartRef: ChartRef) {
    this.chartRef = chartRef;
  }

  public getContext = () => ({
    getChart: this.getChart,
  });

  private getChart = () => {
    const chart = {
      resize: this.resize,
    } as Record<string, Function>;

    ECHARTS_APIS.forEach((key) => {
      // @ts-ignore
      chart[key] = (...args) => this.chartRef.current[key](...args);
    });

    return chart;
  };

  // ================ 实例API ===================

  // ============ 覆写 ===============
  private resize = (delay?: number) => {
    if (!isUndefined(delay)) {
      debounce(() => {
        this.chartRef.current.resize();
      }, delay);
    }
    return this.chartRef.current.resize;
  };
}

export default function useChartContext(chartRef: ChartRef) {
  const contextRef = React.useRef(null);

  if (!contextRef.current) {
    const contextStore = new ContextStore(chartRef);
    contextRef.current = contextStore.getContext();
  }

  return [contextRef.current];
}
