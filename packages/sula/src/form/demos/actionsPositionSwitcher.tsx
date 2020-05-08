import React from 'react';
import { Radio } from 'antd';

interface ActionsPositionSwitcherProps {
  source?: Array<{ text: string; value: string }>;
  onChange: (actionsPosition: string) => void;
}

export default class ActionsPositionSwitcher extends React.Component<ActionsPositionSwitcherProps> {
  static defaultProps = {
    source: [
      { text: 'default', value: 'default' },
      { text: 'center', value: 'center' },
      { text: 'right', value: 'right' },
      { text: 'bottom', value: 'bottom' },
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
