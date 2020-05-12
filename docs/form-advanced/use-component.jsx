/**
 * title: 使用组件
 * desc: |
 *   使用 Form、FieldGroup、Field、FormAction 可以完成更灵活的表单实现
 */

import React from 'react';
import { Form, FieldGroup, Field, FormAction } from 'sula';
import LayoutSwitcher from '../components/layoutSwitcher';
import ColumnsSwitcher from '../components/columnsSwitcher';
import ActionsPositionSwitcher from '../components/actionsPositionSwitcher';

export default class ValueCollectDemo extends React.Component {
  state = {
    cols: 1,
    actionsPosition: 'default',
    layout: 'horizontal',
  };

  render() {
    const { cols, actionsPosition, layout } = this.state;
    return (
      <div>
        <LayoutSwitcher
          value={layout}
          onChange={(layout) => {
            this.setState({
              layout,
            });
          }}
        />{' '}
        <ColumnsSwitcher
          value={cols}
          onChange={(cols) => {
            this.setState({
              cols,
            });
          }}
        />{' '}
        <ActionsPositionSwitcher
          value={actionsPosition}
          onChange={(actionsPosition) => {
            this.setState({
              actionsPosition,
            });
          }}
        />
        <Form
          layout={layout}
          itemLayout={{
            cols,
          }}
        >
          <FieldGroup
            actionsPosition={actionsPosition}
            actionsRender={[
              {
                type: 'button',
                props: {
                  children: 'reset',
                },
              },
            ]}
          >
            <Field field={{ type: 'input' }} name="input1" label="input1" />
            <Field field={{ type: 'input' }} name="input2" label="input2" />
            <Field field={{ type: 'input' }} name="input3" label="input3" />
            <Field field={{ type: 'input' }} name="input4" label="input4" />
          </FieldGroup>
        </Form>
        <Form style={{marginTop: 16}} layout={layout} itemLayout={{ span: 24 / cols }}>
          <FieldGroup>
            <Field field={{ type: 'input' }} name="input1" label="input1" />
            <Field field={{ type: 'input' }} name="input2" label="input2" />
            <Field field={{ type: 'input' }} name="input3" label="input3" />
            <Field field={{ type: 'input' }} name="input4" label="input4" />
            <FormAction
              actionsPosition={actionsPosition}
              actionsRender={[
                {
                  type: 'button',
                  props: {
                    type: 'primary',
                    children: 'query',
                  },
                },
                {
                  type: 'button',
                  props: {
                    children: 'reset',
                  },
                },
              ]}
            />
          </FieldGroup>
        </Form>
      </div>
    );
  }
}
