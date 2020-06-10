import React from 'react';
import echarts from 'echarts';
import elementResizeEvent from 'element-resize-event';
import assign from 'lodash.assign';
import { ChartsProps, ChartInstance } from './interface';
import useChartContext from './useChartContext';
import { setCanvas } from './utils';
import { sulaChartsTheme } from './theme';

const Charts: React.FC<ChartsProps> = (props, ref) => {
  const { className, style, opts, theme = sulaChartsTheme, option } = props;

  /** 保存 echarts 挂载的dom */
  const canvasRef = React.useRef<HTMLDivElement>(null);

  /** 保存 echarts 实例 */
  const chartRef = React.useRef<ChartInstance>(null);

  const [context] = useChartContext(chartRef);

  React.useEffect(() => {
    setCanvas(canvasRef.current);

    chartRef.current = echarts.init(canvasRef.current as HTMLDivElement, theme, opts);

    elementResizeEvent(canvasRef.current, () => {
      (chartRef.current as ChartInstance).resize();
    });
    /** unmount resize event listener, destroy chart */
    return () => {
      try {
        elementResizeEvent.unbind(canvasRef.current);
        (chartRef.current as ChartInstance).dispose();
      } catch (_) {}
    };
  }, []);

  React.useEffect(() => {
    /** 对echarts option进行浅比较，避免不必要渲染 */
    if (chartRef.current) {
      chartRef.current.setOption(option);
    }
  }, [option]);

  React.useImperativeHandle(ref, context.getChart);

  const finalStyle = assign({}, { width: '100%' }, style);

  return <div className={className} style={finalStyle} ref={canvasRef} />;
};

export default Charts;
