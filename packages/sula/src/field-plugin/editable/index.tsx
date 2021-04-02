import React from 'react';
import { Table, Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import cx from 'classnames';
import { Field, FieldProps } from '../../form';
import { Dependencies, DependencyType } from '../../types/dependency';
import { toArray } from '../../_util/common';
import { FieldNameList, FieldNamePath } from '../../types/form';
import LocaleReceiver from '../../localereceiver';
import './index.less';

interface FieldData {
  name: number;
  key: number;
  fieldKey: number;
  [key: string]: any;
}

export interface EditableProps {
  fields: FieldProps[];
  name: FieldNamePath;
}

export default class Editable extends React.Component<EditableProps> {
  static defaultProps = {
    fields: [],
  };

  renderField = (field: FieldData, fieldConfig: FieldProps, isViewMode: boolean) => {
    const { name, key, fieldKey, ...restField } = field;
    const { dependency = {} as Dependencies, label, ...restFieldConfig } = fieldConfig;
    const transformedDep = Object.keys(dependency).reduce(
      (memo: Dependencies, depType: DependencyType) => {
        const dep = dependency[depType];
        const relates = dep!.relates.map((r) => {
          return [fieldKey, ...toArray(r)];
        });
        memo[depType] = {
          ...dep,
          relates,
        };
        return memo;
      },
      {},
    ) as Dependencies;

    const fieldName = [name, ...toArray(fieldConfig.name)] as FieldNameList;
    const fieldNameKey = [fieldKey, ...toArray(fieldConfig.name)];

    return (
      <Field
        {...restField}
        {...restFieldConfig}
        noStyle={isViewMode}
        key={key}
        name={fieldName}
        fieldKey={fieldNameKey}
        dependency={transformedDep}
      />
    );
  };

  render() {
    const { list, ctx } = this.props;
    const [fields, { add, remove }] = list;
    const { mode } = ctx;
    const isViewMode = mode === 'view';
    return (
      <LocaleReceiver>
        {(locale) => {
          return (
            <div>
              <Table<FieldData>
                className={cx('sula-editable', {
                  [`sula-editable-view`]: isViewMode,
                })}
                pagination={false}
                dataSource={fields}
                rowKey="fieldKey"
                columns={[
                  ...this.props.fields.map((fieldConfig) => {
                    return {
                      title: fieldConfig.label,
                      key: toArray(fieldConfig.name).join('_'),
                      width: fieldConfig.width,
                      render: (_: any, field: FieldData) => {
                        return this.renderField(field, fieldConfig, isViewMode);
                      },
                    };
                  }),
                  ...(isViewMode
                    ? []
                    : [
                        {
                          title: '',
                          width: 160,
                          key: 'operation',
                          render: (_, record) => {
                            return (
                              <Space>
                                <a
                                  onClick={() => {
                                    add({}, record.name + 1);
                                  }}
                                >
                                  {locale.addText}
                                </a>
                                <a
                                  onClick={() => {
                                    const values = ctx.form.getFieldValue([
                                      ...toArray(this.props.name),
                                      record.name,
                                    ]);
                                    add(values, record.name + 1);
                                  }}
                                >
                                  {locale.copyText}
                                </a>
                                <a
                                  onClick={() => {
                                    remove(record.name);
                                  }}
                                >
                                  {locale.deleteText}
                                </a>
                              </Space>
                            );
                          },
                        },
                      ]),
                ]}
              />
              {isViewMode ? null : (
                <Button
                  icon={<PlusOutlined />}
                  block
                  type="dashed"
                  style={{ marginTop: 16 }}
                  onClick={() => {
                    add();
                  }}
                >
                  <span>{locale.addText}</span>
                </Button>
              )}
            </div>
          );
        }}
      </LocaleReceiver>
    );
  }
}
