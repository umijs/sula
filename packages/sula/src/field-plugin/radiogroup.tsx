import React from 'react';
import { Radio } from 'antd';

const RadioGroup = Radio.Group;

export default class SulaRadioGroup extends React.Component {
  render() {
    const { source = [], ...restProps } = this.props;
    return (
      <RadioGroup {...restProps}>
        {source.map((item) => {
          return <Radio value={item.value}>{item.text}</Radio>;
        })}
      </RadioGroup>
    );
  }
}
