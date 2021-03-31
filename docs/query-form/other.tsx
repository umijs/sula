import React from 'react';
import { FormInstance, QueryForm } from 'sula';

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
  formRef = React.createRef<FormInstance>();

  render() {
    return (
      <div>
        <button onClick={() => {
          this.formRef.current?.setFieldsValue({
            input0: '123123',
          })
        }}>设置表单值</button>
        <div style={{ background: 'rgb(241, 242, 246)', padding: 16, marginTop: 16 }}>
          <QueryForm
            ref={this.formRef}
            layout="horizontal"
            labelAlign="left"
            onValuesChange={(_, allValues) => {
              console.log('allValues: ', allValues);
            }}
            fields={queryFields}
            ctxGetter={() => {
              return {
                table: {
                  refreshTable: () => {
                    console.log('刷新表格')
                  }
                }
              }
            }}
            actionsRender={[
              {
                type: 'button',
                props: {
                  type: 'primary',
                  children: '查一下'
                },
                action: [
                  { type: 'validateQueryFields', resultPropName: '$queryFieldsValue' },
                  (ctx) => {
                    return new Promise((resolve, reject) => {
                      // mock
                      setTimeout(() => {
                        ctx.table?.refreshTable();
                        resolve('ok');
                      }, 2000);
                    })
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
    );
  }
}
