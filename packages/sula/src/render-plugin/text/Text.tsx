import React from 'react';
import { TextProps as ATextProps } from 'antd/lib/typography/Text';
import { Typography } from 'antd';

const { Text: AText } = Typography;

export type TextProps = ATextProps;

export default class Text extends React.Component<TextProps> {
  render() {
    return <AText {...this.props} />;
  }
}
