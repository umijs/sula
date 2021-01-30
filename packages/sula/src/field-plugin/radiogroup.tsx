import React from 'react';
import { Radio } from 'antd';
import { RadioGroupProps as ARadioGroupProps, RadioProps } from 'antd/lib/radio';

const RadioGroup = Radio.Group;

type RadioItemProps = {
  text: string;
} & RadioProps;

export interface RadioGroupProps extends ARadioGroupProps {
  source: RadioItemProps[];
}

export default class SulaRadioGroup extends React.Component<RadioGroupProps> {
  render() {
    const { source = [], ...restProps } = this.props;
    return (
      <RadioGroup {...restProps}>
        {source.map((item: RadioItemProps) => {
          const { text, value, ...restProps } = item;
          return <Radio value={value} key={value} {...restProps}>{text}</Radio>;
        })}
      </RadioGroup>
    );
  }
}
