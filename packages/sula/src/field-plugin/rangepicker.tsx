import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';

export type SulaDatePickerProps = RangePickerProps & {
  valueFormat?: 'utc' | boolean;
};

export default class SulaTimePicker extends React.Component<SulaDatePickerProps> {
  static defaultProps = {
    format: 'YYYY-MM-DD HH:mm:ss',
  };
  onFormatChange = (time, timeString) => {
    const { valueFormat, onChange } = this.props;
    let finalTime = time || [];

    finalTime = finalTime.map((t, i) => {
      let finalT;
      if (valueFormat === 'utc') {
        finalT = t ? t.valueOf() : null;
      } else {
        finalT = timeString[i];
      }
      return finalT;
    })

    if (onChange) {
      onChange(finalTime, timeString);
    }
  };
  render() {
    const { valueFormat, value, ...restProps } = this.props;
    let finalValue = value;
    if (value) {
      finalValue = value.map(v => {
        if (valueFormat === true) {
          // dateString
          return moment(v, restProps.format);
        } else {
          return moment(v);
        }
      });
    }
    return (
      <DatePicker.RangePicker
        {...restProps}
        {...(valueFormat ? { onChange: this.onFormatChange } : {})}
        value={finalValue}
      />
    );
  }
}
