import React from 'react';
import { Cascader as ACascader } from 'antd';
import { CascaderProps as ACascaderProps } from 'antd/lib/cascader';

export type CascaderSourceItem = {
  text: any;
  value: any;
};

export interface CascaderSource {
  text: any;
  value: any;
  children: CascaderSourceItem[];
}

export interface CascaderProps extends ACascaderProps {
  source: CascaderSource[];
}

export default class Cascader extends React.Component<CascaderProps> {
  static defaultProps = {
    fieldNames: {
      label: 'text',
    },
  };

  render() {
    const { source = [], ...restProps } = this.props;
    return <ACascader options={source} {...restProps} />;
  }
}
