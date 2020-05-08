import React from 'react';
import { Radio } from 'antd';

interface ColumnsSwitcherProps {
  source?: Array<{ text: string; value: string }>;
  onChange: (columns: string) => void;
}

export default class ColumnsSwitcher extends React.Component<ColumnsSwitcherProps> {
  static defaultProps = {
    source: [
      { text: '单列', value: 1 },
      { text: '双列', value: 2 },
      { text: '三列', value: 3 },
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
