import React from 'react';
import * as sula from 'sula';
import { Tabs, Input, Select } from 'antd';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import theme from 'prism-react-renderer/themes/nightOwlLight';

const { TabPane } = Tabs;

const scope = {
  ...sula,
  Tabs,
  TabPane,
};

const createFormCode = `// import { CreateForm } from 'sula';

function() {
  return <CreateForm 
    fields={[
      {
        field: 'input',
        name: 'input',
        label: 'Input',
      },
      {
        field: 'select',
        name: 'select',
        label: 'Select',
        initialSource: [{
          text: '苹果',
          value: 'apple',
        }]
      }
    ]}
    submit={{
      url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
      method: 'POST'
    }}
  />
}
`;

const queryTableCode = `
// import { QueryTable } from 'sula';
  
function () {
  const fields = Array(10)
    .fill(0)
    .map((_, index) => {
      return {
        name: 'input' + index,
        label: 'Input' + index,
        field: 'input',
      };
    });

  const remoteDataSource = {
    url: 'https://randomuser.me/api',
    method: 'GET',
    convertParams({ params }) {
      return {
        results: params.pageSize,
        ...params,
      };
    },
    converter({ data }) {
      return {
        list: data.results.map((item, index) => {
          return {
            ...item,
            id: index + '',
            name: item.name.first + ' ' + item.name.last,
            index,
          };
        }),
        total: 100,
      };
    },
  };

  const columns = [
    {
      title: '序号',
      key: 'index',
    },
    {
      title: '国家',
      key: 'nat',
    }
  ];

  return <QueryTable
    visibleFieldsCount={1}
    itemLayout={{ cols: 2}}
    remoteDataSource={remoteDataSource} 
    fields={fields}
    columns={columns}
    rowKey="id"
    actionsRender={[{
      type: 'button', 
      props: {
        icon: 'appstore',
        children: '操作',
      },
      action: [() => {
        console.log('step1');
      }, () => {
        console.log('step2');
      }]
    }]}
    tableProps={{
      initialPaging: {
        pagination: { pageSize: 2}
      }
    }}
  />
}
`;

const stepFormCode = `
// import { StepForm } from 'sula';

function () {
  return <div style={{background: '#fff', padding: 24}}>
    <StepForm 
      steps={[
        {
          title: '验证',
          fields: [{
            field: 'input',
            name: 'input1-1',
            label: 'Input1-1',
          }]
        },
        {
          title: '支付',
          fields: [{
            field: 'input',
            name: 'input2-1',
            label: 'Input2-1',
          }]
        }
      ]}
      result={{
        title: '支付成功',
      }}
      submit={{
        url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
        method: 'POST'
      }}
    />
  </div>;
}
`

const codes = [
  {
    name: 'CreateForm',
    code: createFormCode,
  },
  {
    name: 'QueryTable',
    code: queryTableCode,
  },
  {
    name: 'StepForm',
    code: stepFormCode,
  },
];

export default class Playground extends React.Component {
  render() {
    return (
      <Tabs>
        {codes.map(({ code, name }) => {
          return (
            <TabPane tab={name} key={name}>
              <div style={{ background: '#f6f7f9' }}>
                <LiveProvider theme={theme} scope={scope} code={code}>
                  <LivePreview style={{ padding: 16 }} />
                  <LiveError />
                  <LiveEditor />
                </LiveProvider>
              </div>
            </TabPane>
          );
        })}
      </Tabs>
    );
  }
}
