import React from 'react';
import { Form as AForm } from 'antd';
import { FormListProps as AFormListProps } from 'antd/lib/form';
import FieldGroup, { FieldGroupProps } from './FieldGroup';

export type FormListProps = Omit<
  FieldGroupProps,
  'fields' | 'actionsPosition' | 'actionsRender' | 'children'
> &
  AFormListProps;

export default class FormList extends React.Component<FormListProps> {
  render() {
    const {
      name,
      layout,
      itemLayout,
      initialVisible,
      dependency,
      container,
      ...aFormListProps
    } = this.props;
    return (
      <FieldGroup
        name={name}
        layout={layout}
        itemLayout={itemLayout}
        initialVisible={initialVisible}
        dependency={dependency}
        container={container}
        isList
      >
        <AForm.List {...aFormListProps} name={name}></AForm.List>
      </FieldGroup>
    );
  }
}
