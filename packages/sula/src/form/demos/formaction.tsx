import React from 'react';
import { Form, FormAction, FieldGroup, Field } from '..';
import ColumnsSwitcher from './columnsSwitcher';
import ActionsPositionSwitcher from './actionsPositionSwitcher';
import LayoutSwitcher from './layoutSwitcher';

export default class Basic extends React.Component {
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
        <Form
          layout={layout}
          itemLayout={{
            cols,
          }}
          fields={[
            {
              name: 'input1',
              label: 'input1',
              field: {
                type: 'input',
                props: {
                  placeholder: 'i am input1',
                },
              },
            },
            {
              name: 'input2',
              label: 'input2',
              field: {
                type: 'input',
                props: {
                  placeholder: 'i am input2',
                },
              },
            },
            {
              name: 'input3',
              label: 'input3',
              field: {
                type: 'input',
                props: {
                  placeholder: 'i am input3',
                },
              },
            },
          ]}
          actionsPosition={actionsPosition}
          actionsRender={[
            {
              type: 'button',
              props: {
                type: 'primary',
                children: 'submit',
              },
            },
          ]}
        />
        <Form layout={layout} itemLayout={{ span: 8 }}>
          <FieldGroup>
            <Field field={{ type: 'input' }} name="input1" label="input1" />
            <Field field={{ type: 'input' }} name="input2" label="input2" />
            <Field field={{ type: 'input' }} name="input3" label="input3" />
            <Field field={{ type: 'input' }} name="input4" label="input4" />
            <FormAction
              itemLayout={{ span: 16 }}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
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
