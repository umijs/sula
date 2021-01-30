import React from 'react';
import { TreeSelect as ATreeSelect } from 'antd';
import { TreeSelectProps as ATreeSelectProps } from 'antd/lib/tree-select';
import { AntTreeNodeProps } from 'antd/lib/tree';

export type TreeNodeSourceItem = {
  text: any;
  value: any;
  children?: TreeNodeSourceItem[];
} & AntTreeNodeProps;

export interface TreeSelectProps extends Omit<ATreeSelectProps<any>, 'treeData' | 'children'> {
  source: TreeNodeSourceItem[];
}

export default class TreeSelect extends React.Component<TreeSelectProps> {
  renderTreeNode = (item: TreeNodeSourceItem) => {
    const { children, text, value, ...otherProps } = item;
    if (children) {
      return (
        <ATreeSelect.TreeNode key={value} {...otherProps} title={text} value={value}>
          {children.map((it) => {
            return this.renderTreeNode(it);
          })}
        </ATreeSelect.TreeNode>
      );
    }
    return (
      <ATreeSelect.TreeNode key={value} {...otherProps} title={text} value={value} />
    );
  };

  render() {
    const { source = [], ...restProps } = this.props;
    return (
      <ATreeSelect {...restProps}>
        {source.map((item) => {
          return this.renderTreeNode(item);
        })}
      </ATreeSelect>
    );
  }
}
