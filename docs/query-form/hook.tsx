import React from 'react';
import { useForm, QueryForm } from 'sula';

const queryFields = Array(10)
  .fill(0)
  .map((_, index) => {
    return {
      name: `input${index}`,
      label: `Input${index}`,
      field: 'input',
    };
  });

const BasicDemo = () => {
  const [form] = useForm();
  return (
    <div>
      <button
        onClick={() => {
          form.setFieldsValue({
            input0: '123123',
          });
        }}
      >
        设置表单值
      </button>
      <div style={{ background: 'rgb(241, 242, 246)', padding: 16, marginTop: 16 }}>
        <QueryForm
          form={form}
          layout="horizontal"
          labelAlign="left"
          onValuesChange={(_, allValues) => {
            console.log('allValues: ', allValues);
          }}
          fields={queryFields}
          actionsRender={[
            {
              type: 'button',
              props: {
                type: 'primary',
                children: '查一下',
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
};

export default BasicDemo;
