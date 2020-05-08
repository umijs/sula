import React from 'react';
import moment from 'moment';
import { TimePicker } from 'antd';
import { TimePickerProps } from 'antd/lib/time-picker';

export interface SulaTimePickerProps extends TimePickerProps {
  valueFormat?: 'utc' | boolean;
}

export default class SulaTimePicker extends React.Component<SulaTimePickerProps> {
  static defaultProps = {
    format: 'HH:mm:ss',
  };
  onFormatChange = (time, timeString) => {
    const { valueFormat, onChange } = this.props;
    let finalTime;

    if (valueFormat === 'utc') {
      finalTime = time ? time.valueOf() : null;
    } else {
      finalTime = timeString;
    }

    if (onChange) {
      onChange(finalTime, timeString);
    }
  };
  render() {
    const { valueFormat, value, ...restProps } = this.props;
    let finalValue = value;
    if (value) {
      if (valueFormat === true) {
        // timeString
        finalValue = moment(value, restProps.format);
      } else {
        finalValue = moment(value);
      }
    }
    return (
      <TimePicker
        {...restProps}
        {...(valueFormat ? { onChange: this.onFormatChange } : {})}
        value={finalValue}
      />
    );
  }
}
