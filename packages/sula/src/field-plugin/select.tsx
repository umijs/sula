import React from 'react';
import { Select as ASelect } from 'antd';
import { SelectProps as ASelectProps, OptionProps } from 'antd/lib/select';

export type SelectSourceItem = {
  text: any;
} & Omit<OptionProps, 'children'>;

export interface SelectGroupItem {
  text: any;
  children: SelectSourceItem[];
}

export interface SelectProps extends ASelectProps<any> {
  source: Array<SelectSourceItem | SelectGroupItem>;
}

export default class Select extends React.Component<SelectProps> {
  renderOption = (item: SelectSourceItem) => {
    const { text, value, ...restProps } = item;
    return (
      <ASelect.Option value={value} key={value} {...restProps}>
        {text}
      </ASelect.Option>
    );
  };

  renderGroupOptions = (group: SelectGroupItem) => {
    return (
      <ASelect.OptGroup key={group.text} label={group.text}>
        {(group.children as SelectSourceItem[]).map((item) => {
          return this.renderOption(item);
        })}
      </ASelect.OptGroup>
    );
  };

  render() {
    const { source = [], ...restProps } = this.props;
    return (
      <ASelect {...restProps}>
        {source.map((item) => {
          if ((item as SelectGroupItem).children) {
            return this.renderGroupOptions(item as SelectGroupItem);
          }
          return this.renderOption(item as SelectSourceItem);
        })}
      </ASelect>
    );
  }
}
