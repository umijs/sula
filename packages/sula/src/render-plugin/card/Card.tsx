import React from 'react';
import { CardProps as ACardProps } from 'antd/lib/card';
import { Card as ACard } from 'antd';

export interface CardProps extends ACardProps {
}

export default class Card extends React.Component<CardProps> {
  render() {
    return <ACard {...this.props} />;
  }
}
