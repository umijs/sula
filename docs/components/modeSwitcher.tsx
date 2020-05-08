import React from 'react';
import { Radio } from 'antd';

interface ModeSwitcherProps {
  source?: Array<{ text: string; value: string }>;
  onChange: (mode: string) => void;
}

export default class ModeSwitcher extends React.Component<ModeSwitcherProps> {
  static defaultProps = {
    source: [
      { text: '新建', value: 'create' },
      { text: '编辑', value: 'edit' },
      { text: '查看', value: 'view' },
    ],
  };

  render() {
    return (
      <Radio.Group
        value={this.props.value}
        onChange={(e) => this.props.onChange(e.target.value)}
        buttonStyle="solid"
      >
        {this.props.source.map((item) => {
          return (
            <Radio.Button value={item.value} key={item.value}>
              {item.text}
            </Radio.Button>
          );
        })}
      </Radio.Group>
    );
  }
}
