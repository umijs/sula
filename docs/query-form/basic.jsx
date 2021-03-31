import React from 'react';
import { QueryForm } from 'sula';

const queryFields = Array(10)
  .fill(0)
  .map((_, index) => {
    return {
      name: `input${index}`,
      label: `Input${index}`,
      field: 'input',
    };
  });

export default class BasicDemo extends React.Component {
  state = {};

  componentDidMount() {}

  changevisibleFieldsCount = (v) => {
    this.setState({ visibleFieldsCount: v });
  };

  render() {
    const { visibleFieldsCount } = this.state;
    return (
      <div>
        <button onClick={() => this.changevisibleFieldsCount(4)}>4</button>
        <button onClick={() => this.changevisibleFieldsCount(3)}>3</button>
        <button onClick={() => this.changevisibleFieldsCount(true)}>无</button>
        <div style={{ background: 'rgb(241, 242, 246)', padding: 16, marginTop: 16 }}>
          <QueryForm
            key={visibleFieldsCount || 'all'}
            visibleFieldsCount={visibleFieldsCount}
            layout="vertical"
            fields={queryFields}
            actionsRender={[
              {
                type: 'button',
                props: {
                  type: 'primary',
                  children: '查一下'
                },
                action: (ctx) => {
                  console.log('ctx: ', ctx);
                  console.log('fieldsValue', ctx.form.getFieldsValue());
                },
              },
            ]}
          />
        </div>
      </div>
    );
  }
}
