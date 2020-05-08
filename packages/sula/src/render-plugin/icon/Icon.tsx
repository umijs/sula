import React from 'react';
import cx from 'classnames';
import warning from '../../_util/warning';
import './style/icon.less';

type BasicIconProps = {
  style?: React.CSSProperties;
  className?: string;
  spin?: boolean;
  rotate?: number;
  twoToneColor?: string;
};

export type IconThemeMapper = {
  outlined?: React.ComponentClass<BasicIconProps>;
  filled?: React.ComponentClass<BasicIconProps>;
  twoTone?: React.ComponentClass<BasicIconProps>;
};

export type IconMapper = Record<string, IconThemeMapper>;

type Props = {
  type: string;
  theme: 'filled' | 'twoTone';

  disabled?: boolean;
  text?: string | React.ReactElement;
  iconMapper?: IconMapper; // 独立使用
} & BasicIconProps;

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;

export type IconProps = Props & NativeAttrs;

let globalIconMapper: IconMapper = {};

export default class Icon extends React.Component<IconProps> {
  static defaultProps = {
    theme: 'outlined',
  };

  static iconRegister = (iconMapper: IconMapper) => {
    globalIconMapper = iconMapper;
  };

  render() {
    const { type, theme, disabled, text, iconMapper, ...iconProps } = this.props;
    const finalIconMapper: IconMapper = iconMapper || globalIconMapper;
    if (finalIconMapper[type] && finalIconMapper[type][theme]) {
      const iconCls = cx(iconProps.className, {
        'sula-icon-disabled': !!disabled,
        'sula-icon-clickable': !!iconProps.onClick && disabled !== true,
      });

      const IconCompClass = finalIconMapper[type][theme] as React.ComponentClass<BasicIconProps>;
      if (text) {
        const { rotate, twoToneColor, spin, className, ...restProps } = iconProps;
        return (
          <span className={iconCls} {...restProps}>
            {React.createElement(IconCompClass, {
              rotate,
              spin,
              twoToneColor,
            })}
            <span style={{ marginLeft: 4 }}>{text}</span>
          </span>
        );
      } else {
        iconProps.className = iconCls;
        return React.createElement(IconCompClass, iconProps);
      }
    }

    warning(false, 'icon', `${type} ${theme} is not registered in iconMapper`);
    return null;
  }
}
