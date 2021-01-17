import React from 'react';
import { Icon, registerFieldPlugin, Field } from './packages/sula/src/index';
import {
  TabletFilled,
  AppstoreOutlined,
  CarOutlined,
  CoffeeOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { Button, Space } from 'antd';

// umi-plugin-sula 承载
// registerFieldPlugins();
// registerRenderPlugins();
// registerActionPlugin();

Icon.iconRegister({
  tablet: {
    filled: TabletFilled,
  },
  appstore: {
    outlined: AppstoreOutlined,
  },
  car: {
    outlined: CarOutlined,
  },
  coffee: CoffeeOutlined,
});

const DynamicFieldComp = (props) => {
  const { list } = props;
  const [fields, { add, remove }] = list;
  return (
    <>
      {fields.map((field) => {
        const { name, key, fieldKey, ...rest } = field;
        return (
          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            {props.fields.map((fieldConfig) => {
              return (
                <Field
                  {...rest}
                  key={key}
                  name={[name, fieldConfig.name]}
                  fieldKey={[fieldKey, fieldConfig.name]}
                  rules={fieldConfig.rules}
                  field={fieldConfig.field}
                />
              );
            })}
            <MinusCircleOutlined onClick={() => remove(field.name)} key="remove" />
          </Space>
        );
      })}
      <Button
        style={{ width: 300 }}
        type="dashed"
        onClick={() => add()}
        block
        icon={<PlusOutlined />}
      >
        添加
      </Button>
    </>
  );
};

registerFieldPlugin('dynamicfieldcomp')(DynamicFieldComp);
