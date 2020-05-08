import React from 'react';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

export default class SulaCheckboxGroup extends React.Component {
  render() {
    const { source = [], ...restProps } = this.props;
    return (
      <CheckboxGroup
        {...restProps}
        options={source.map((item) => {
          return {
            ...item,
            label: item.text,
          };
        })}
      />
    );
  }
}
