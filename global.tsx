import React from 'react';
import { Icon, registerFieldPlugin, Field, request } from './packages/sula/src/index';
import {
  TabletFilled,
  AppstoreOutlined,
  CarOutlined,
  CoffeeOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { Button, Space, Select } from 'antd';

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

const DynamicDepFieldComp = (props) => {
  const { list } = props;
  const [fields, { add, remove }] = list;
  return (
    <>
      {fields.map((field) => {
        const { name, key, fieldKey, ...rest } = field;

        return (
          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            {props.fields.map((fieldConfig) => {
              const { dependency = {} } = fieldConfig;
              const transedDep = Object.keys(dependency).reduce((memo, depType) => {
                const dep = dependency[depType];
                const relates = dep.relates.map((r) => {
                  return [name, ...(Array.isArray(r) ? r : [r])];
                });
                memo[depType] = {
                  ...dep,
                  relates,
                };
                return memo;
              }, {});
              return (
                <Field
                  {...rest}
                  key={key}
                  name={[name, fieldConfig.name]}
                  fieldKey={[fieldKey, fieldConfig.name]}
                  rules={fieldConfig.rules}
                  field={fieldConfig.field}
                  dependency={transedDep}
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

registerFieldPlugin('dynamicdepfieldcomp')(DynamicDepFieldComp);

const RemoteSearch = (props) => {
  const { source = [], ctx, value, onChange, placeholder } = props;
  const handleSearch = (q) => {
    if(!q) {
      return;
    }
    request({
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      params: {
        q,
      },
    }).then(() => {
      

      ctx.form.setFieldSource(ctx.name, Array(10).fill(0).map((_, index) => {
        return {
          text: `商品_${q}_${index}`,
          value: `价格_${q}_${index}`,
        }
      }));
    });
  };

  return (
    <Select
      showSearch
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      notFoundContent={null}
      value={value}
      onChange={onChange}
      onSearch={handleSearch}
    >
      {source.map((item) => {
        return (
          <Select.Option key={item.value} value={item.value}>
            {item.text}
          </Select.Option>
        );
      })}
    </Select>
  );
};

registerFieldPlugin('customremotesearch')(RemoteSearch, true, true);
