import React from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import assign from 'lodash/assign';

export interface LinkProps extends ButtonProps{
}

export default class Link extends React.Component<LinkProps> {
  render() {
    const { className, style, ...restProps } = this.props;

    return (
      <Button className={className} style={assign({padding: 0}, style) } {...restProps} type="link" />
    );
  }
}
