import React from 'react';
import { Radio } from 'antd';

interface LayoutSwitcherProps {
  source?: Array<{ text: string; value: string }>;
  onChange: (layout: string) => void;
}

export default class LayoutSwitcher extends React.Component<LayoutSwitcherProps> {
  static defaultProps = {
    source: [
      { text: '水平(默认)', value: 'horizontal' },
      { text: '垂直', value: 'vertical' },
      { text: '内联', value: 'inline' },
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
