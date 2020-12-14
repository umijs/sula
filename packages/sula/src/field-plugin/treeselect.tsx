import React from 'react';
import { TreeSelect as ATreeSelect } from 'antd';
import { TreeSelectProps as ATreeSelectProps } from 'antd/lib/tree-select';

export type TreeNodeSource = {
  text: any;
  value: any;
  children?: TreeNodeSource[];
};

export interface TreeSelectProps extends Omit<ATreeSelectProps<any>, 'treeData' | 'children'> {
  source: TreeNodeSource[];
}

export default class TreeSelect extends React.Component<TreeSelectProps> {
  renderTreeNode = (item: TreeNodeSource) => {
    if (item.children) {
      return (
        <ATreeSelect.TreeNode title={item.text} value={item.value} key={item.value}>
          {item.children.map((it) => {
            return this.renderTreeNode(it);
          })}
        </ATreeSelect.TreeNode>
      );
    }
    return <ATreeSelect.TreeNode title={item.text} value={item.value} key={item.value} />;
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
