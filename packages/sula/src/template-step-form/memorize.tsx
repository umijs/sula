import React, { SFC } from 'react';
import assign from 'lodash/assign';
import omit from 'lodash/omit';

interface ItemProps {
  visible?: boolean;
  children: React.ReactFragment;
  memoId?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

interface MemorizeProps {
  className?: string;
  style?: React.CSSProperties;
}

const Item: SFC<ItemProps> = () => null;

const Memorize: SFC<MemorizeProps> & { Item: typeof Item } = (props) => {
  const { children, ...restProps } = props;

  return (
    <div {...restProps}>
      {React.Children.toArray(children).map((child: { props: ItemProps }, index) => {
        const key = child.props.memoId || index;
        const { visible } = child.props;

        const visibleStyle = {};

        if (!visible) {
          // @ts-ignore
          visibleStyle.display = 'none';
        }

        const childStyle = assign(child.props.style || {}, visibleStyle);
        const finalChildProps = assign({}, omit(child.props, ['visible', 'memoId']), {
          style: childStyle,
          key,
        });
        return <div {...finalChildProps} />;
      })}
    </div>
  );
};

Memorize.Item = Item;

export default Memorize;
