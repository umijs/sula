import numeral from 'numeral';
import omit from 'lodash/omit';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import warning from './_util/warning';
import { ChartOption, EChartOption, ChartTooltip } from './interface';

/**
 * var string = numeral(1000).format('0,0');
 * '1,000'
 */

export type NormalizedFormat = {
  type?: string;
  label?: string | ((name: string) => string);
  title?: string;
  unit?: string;
};

export type Format = string | NormalizedFormat;

type FormatterParam = any;

const typeValue = {
  line(param: FormatterParam, format: NormalizedFormat, isAxis: boolean) {
    const { marker, name, seriesName, value } = param;
    return `<div>${marker}${getFormatedLabel(
      isAxis ? seriesName : name,
      format,
    )}: ${getFormatedValue(value, format)}</div>`;
  },
  bar(param: FormatterParam, format: NormalizedFormat, isAxis: boolean) {
    const { marker, name, seriesName, value } = param;
    return `<div>${marker}${getFormatedLabel(
      isAxis ? seriesName : name,
      format,
    )}: ${getFormatedValue(value, format)}</div>`;
  },
  heatmap(param: FormatterParam, format: NormalizedFormat, isAxis: boolean) {
    const { marker, name, seriesName, value, dimensionNames } = param;
    return `<div>${marker}${getFormatedLabel(
      isAxis ? seriesName : name,
      format,
    )}: ${getFormatedValue(value[dimensionNames.length - 1], format)}</div>`;
  },
  radar(param: FormatterParam, format: NormalizedFormat, _: boolean, option: ChartOption) {
    const { indicator } = option.radar as { indicator: { name: string }[] };
    const { value } = param;

    return value
      .map((val: any, index: number) => {
        return `<div> ${getFormatedLabel(indicator[index].name, format)}: ${getFormatedValue(
          val,
          format,
        )}</div>`;
      })
      .join('');
  },
  scatter(param: FormatterParam, format: NormalizedFormat) {
    const { marker, value, dimensionNames } = param;
    return `<div>${marker}${getFormatedValue(value[dimensionNames.length - 1], format)}</div>`;
  },
  pie(param: FormatterParam, format: NormalizedFormat) {
    const { marker, value, name } = param;
    return `<div>${marker}${getFormatedLabel(name, format)}: ${getFormatedValue(
      value,
      format,
    )}</div>`;
  },
  map(param: FormatterParam, format: NormalizedFormat) {
    const { value, name } = param;
    return `<div>${getFormatedLabel(name, format)}: ${getFormatedValue(value, format)}</div>`;
  },
};

const typeTitle = {
  radar(param: FormatterParam) {
    return param.name;
  },
};

function getFormatedValue(value: any, format: NormalizedFormat) {
  const { type, unit } = format;
  return type ? numeral(value).format(type) : value + (unit || '');
}

function getFormatedLabel(name: string, format: NormalizedFormat) {
  const { label } = format;

  if (label) {
    if (isString(label)) {
      return label;
      // 可以加 markder
    } else if (isFunction(label)) {
      return label(name);
    }
  }

  return name;
}

const formatter = (option: ChartOption) => {
  const { tooltip } = option;

  if (!tooltip || !tooltip.formatter || !isArray(tooltip.formatter)) {
    return option;
  }

  const finalOption = omit(option, ['tooltip']) as EChartOption;
  const formatter = tooltip.formatter;
  const finalTooltip = omit(tooltip, ['formatter']) as ChartTooltip;
  finalTooltip.formatter = (params: FormatterParam) => {
    return tooltipFormatter(params, formatter, option);
  };

  finalOption.tooltip = finalTooltip;
  return finalOption;
};

function normalizeFormat(format: Format) {
  if (isString(format)) {
    return {
      type: format,
    };
  }
  return format;
}

function tooltipFormatter(params: FormatterParam, formatter: Format[], option: ChartOption) {
  const finalParams = isArray(params) ? params : [params];
  const finalFormates = formatter.map((format) => normalizeFormat(format)) as NormalizedFormat[];

  warning(
    finalParams.length === formatter.length,
    'the length of the series must be equal to the length of the formatter',
  );

  const firstFormat = finalFormates[0];
  let title = firstFormat.title;

  const isAxis = finalParams.length > 1;

  const values = finalParams.map((param, index) => {
    const { name, seriesName, seriesType } = param;

    if (isUndefined(title)) {
      // @ts-ignore
      title = typeTitle[seriesType] ? typeTitle[seriesType](param) : isAxis ? name : seriesName;
    }

    // @ts-ignore
    const typeValueFn = typeValue[seriesType];
    warning(typeValueFn, `formatter of ${seriesType} is not supported temporarily`);

    return typeValueFn(param, finalFormates[index], isAxis, option);
  });

  const labelValues = values.join('');

  if (title) {
    return `<div><div>${title}</div>${labelValues}</div>`;
  }

  return `<div>${labelValues}</div>`;
}

export default formatter;

export { numeral };
