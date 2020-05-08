import React from 'react';

export interface DivProps {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactFragment;
}

export default class Div extends React.Component<DivProps> {
  render() {
    const { className, style, children, ...restProps } = this.props;
    if (!children) {
      return null;
    }

    return (
      <div className={className} style={style} {...restProps}>
        {children}
      </div>
    );
  }
}
