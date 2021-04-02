import React from 'react';
import { Form, FormList, Field } from 'sula';
import { Table, Button, Space } from 'antd';

export default class EditableTableDemo extends React.Component {
  render() {
    return (
      <div>
        <Form layout="vertical">
          <FormList label="可编辑表格" name="et">
            {(fields, list) => {
              console.log('list: ', list);
              const { add, remove} = list
              return (
                <div>
                  <Table
                    components={{
                      body: {
                        row: (props) => {
                          return <tr {...props} style={{ verticalAlign: 'baseline' }} />;
                        },
                        cell: (props) => {
                          return <td {...props} style={{ padding: '24px 24px 0' }} />;
                        },
                      },
                    }}
                    pagination={false}
                    dataSource={fields}
                    rowKey="fieldKey"
                    columns={[
                      {
                        title: '省份',
                        key: 'province',
                        render: (_, record) => {
                          const { name, fieldKey } = record;
                          return (
                            <Field
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                              name={[name, 'province']}
                              fieldKey={[fieldKey, 'province']}
                              field="input"
                            />
                          );
                        },
                      },
                      {
                        title: '城市',
                        key: 'city',
                        render: (_, record) => {
                          const { name, fieldKey } = record;
                          return (
                            <Field
                              name={[name, 'city']}
                              fieldKey={[fieldKey, 'city']}
                              field="input"
                            />
                          );
                        },
                      },
                      {
                        title: '姓名',
                        key: 'name',
                        render: (_, record) => {
                          const { name, fieldKey } = record;
                          return (
                            <Field
                              name={[name, 'name']}
                              fieldKey={[fieldKey, 'name']}
                              field="input"
                            />
                          );
                        },
                      },
                      {
                        title: '',
                        width: 200,
                        key: 'operation',
                        render: (_, record) => {
                          return (
                            <Space>
                              <a
                                onClick={() => {
                                  remove(record.name);
                                }}
                              >
                                删除
                              </a>
                              <a
                                onClick={() => {
                                  add(undefined, record.name + 1);
                                }}
                              >
                                添加
                              </a>
                            </Space>
                          );
                        },
                      },
                    ]}
                  />
                  <Button
                    block
                    type="dashed"
                    style={{ marginTop: 16 }}
                    onClick={() => {
                      add();
                    }}
                  >
                    添加
                  </Button>
                </div>
              );
            }}
          </FormList>
        </Form>
      </div>
    );
  }
}
