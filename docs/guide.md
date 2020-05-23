---
title: 指南
order: 1
---

## sula教你十分钟完成crud
sula是基于umi和antd搭建的便携式中后台配置化系统

### 起步

**拉取sula包后首次在项目中引入sula使用可能会遇到一些问题，需要添加一些简单的配置即可**

*sula主导的是万物皆可插件的模式，插件几乎可以集成到你模块的每个角落，所以复用性和扩展性特别强大*

下面介绍从umi脚手架搭建到使用sula的过程帮助你理解并能在项目中轻松运用sula

1. 先找个地方建个空目录
```js
mkdir sula-use && cd sula-use
```
2. 通过官方工具创建项目安装依赖后使用
```js
yarn create @umijs/umi-app && tnpm i && tnpm start
```
在浏览器里打开 `http://localhost:8000/`，能看到以下界面，

![avatar](https://img.alicdn.com/tfs/TB1UQpvHXT7gK0jSZFpXXaTkpXa-2658-948.png)

3. 安装sula和umi-plugin-sula
```js
tnpm i sula umi-plugin-sula --save
```
*注意：sula内部集成了很多插件，这些插件使用前需要先注册；umi-plugin-sula承载了sula除icon以外的所有插件的注册*

4. 在.umirc.ts中声明sula
![avatar](https://img.alicdn.com/tfs/TB1ixXzHkP2gK0jSZPxXXacQpXa-3202-868.png)

5. 在global.js中导入antd.less并注册项目中所需要icon（详请请参考下文 `icon的使用`）
```js
import 'antd/dist/antd.less';
import { Icon } from 'sula';

Icon.iconRegister({
  tablet: {
    filled: TabletFilled,
  },
  upcircle: {
    twoTone: UpCircleTwoTone
  },
  car: {
    outlined: CarOutlined
  },
  coffee: CoffeeOutlined,
});

```

6. 最后就可以尽情的使用sula了
![avatar](https://img.alicdn.com/tfs/TB1EklBHi_1gK0jSZFqXXcpaXXa-3214-1128.png)

最终呈现
![avatar](https://img.alicdn.com/tfs/TB1ad0EHbj1gK0jSZFOXXc7GpXa-4778-956.png)

### create-form模版的使用
**下面是CreateForm最简单的一种实现**
  - fields：表单控件配置，field表述的是该项的类型（列如：input、select等）；也支持对象的写法，后面例子会讲到；
  - submit：向后端提交表单信息，url：提交接口地址；

```javaScript
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
  return (
    <div>
      <CreateForm
        fields={[
          {
            name: 'name',
            label: '姓名',
            field: 'input',
          },
        ]}
        submit={{
          url: 'https://www.testMoce.json',
          method: 'POST',
        }}
      />
    </div>
  );
}
```

```jsx
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
  return (
    <div>
      <CreateForm
        fields={[
          {
            name: 'name',
            label: '姓名',
            field: 'input',
          },
        ]}
        submit={{
          url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
          method: 'POST',
        }}
      />
    </div>
  );
}
```

**如果我想多添加几个表单项怎么办呢？**
- field：当表单项想设置props或添加正则等（此处不表述）时就要以对象的形式来展示了
  - type：该项的类型，props：设定该项属性
- initialSource：设置默认的source(类似于select、checkboxgroup需要设置)

![avatar](https://img.alicdn.com/tfs/TB161YjGkP2gK0jSZPxXXacQpXa-4100-1802.png)

```jsx
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
  const initialSource = [{
    text: '苹果',
    value: 'apple'
  }, {
    text: '香蕉',
    value: 'banana'
  }];

  return (
    <div>
      <CreateForm
        fields={[
          {
            name: 'name',
            label: '姓名',
            field: 'input',
          }, {
            name: 'fruit',
            label: '水果',
            initialSource,
            field: {
              type: 'select',
              props: {
                placeholder: '请输入'
              }
            },
          }, {
            name: 'times',
            label: '是否保密',
            field: 'switch',
          }
        ]}
        submit={{
          url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
          method: 'POST',
        }}
      />
    </div>
  );
}

```

**如果想用一个容器把form包裹起来呢？这也不是问题**
- container：表单容器
  - type：容器的类型；可以通过props来设置容器的标题等其他属性
- actionsPosition：按钮的位置；bottom|right|center|默认（不设置）
- itemLayout: 表单布局(详情可以参考antd)

![avatar](https://img.alicdn.com/tfs/TB1TP_qGi_1gK0jSZFqXXcpaXXa-4102-1804.png)

```jsx
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
  const initialSource = [{
    text: '苹果',
    value: 'apple'
  }, {
    text: '香蕉',
    value: 'banana'
  }];

  return (
    <div>
      <CreateForm
        actionsPosition="right"
        container={{
          type: 'card',
          props: {
            title: '卡片'
          }
        }}
        itemLayout={{
          labelCol: {
            span: 6,
          },
          wrapperCol: {
            span: 8,
          }
        }}
        fields={[
          {
            name: 'name',
            label: '姓名',
            field: 'input',
          }, {
            name: 'fruit',
            label: '水果',
            initialSource,
            field: {
              type: 'select',
              props: {
                placeholder: '请输入'
              }
            },
          }, {
            name: 'times',
            label: '是否保密',
            field: 'switch',
          }
        ]}
        submit={{
          url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
          method: 'POST',
        }}
      />
    </div>
  );
}

```

**到现在为止你可能想；编辑、查看状态下怎样获取接口数据并渲染？提交form的某些参数想额外处理怎么办？...别急,接下来就告诉你**
- remoteValues: 表单初始值远程请求
- request：sula封装的请求方法
  - url: 请求地址；params：请求参数
*在请求详情接口初始化、提交数据时需要更改某些参数的时候可以通过和request方法配合；其实还有其他方式，如果你感兴趣的话可以继续往后看*

![avatar](https://img.alicdn.com/tfs/TB1CKYkGeL2gK0jSZPhXXahvXXa-4094-1340.png)

```jsx
import React from 'react';
import { CreateForm, request } from 'sula';

export default () => {
  const initialSource = [{
    text: '苹果',
    value: 'apple'
  }, {
    text: '香蕉',
    value: 'banana'
  }];

  return (
    <div>
      <CreateForm
        actionsPosition="right"
        container={{
          type: 'card',
          props: {
            title: '卡片'
          }
        }}
        itemLayout={{
          labelCol: {
            span: 6,
          },
          wrapperCol: {
            span: 8,
          }
        }}
        fields={[
          {
            name: 'name',
            label: '姓名',
            field: 'input',
          }, {
            name: 'fruit',
            label: '水果',
            initialSource,
            field: {
              type: 'select',
              props: {
                placeholder: '请输入'
              }
            },
          }, {
            name: 'times',
            label: '是否保密',
            field: 'switch',
          }
        ]}
        remoteValues={{
          url: '/api/manage/detail.json',
          method: 'post',
          params: {
            id: 19
          }
        }}
        submit={ctx => {
          const { result } = ctx;
          return request({
            url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
            method: 'POST',
            params: { ...result, times: result.times ? '成功' : '失败' }
          })
        }}
      />
    </div>
  );
}

```

### QueryTable模版的使用
**下面先介绍QueryTable模版基础使用**
- columns：表格列配置
  - render: 设置表格项最终渲染形态；ctx参数包含该组list值和table实例等
- remoteDataSource：表格初始值接口请求
  - convertParams：处理并通过return返回最终的请求参数
  - converter：处理并通过return返回最终的列表数据
- 右上方按钮；Query：点击自动携带form列表值作为参数请求接口并刷新表格； Reset: 重置form列表并刷新table；

```jsx
import React from 'react';
import { QueryTable } from 'sula';

export default () => {
  const queryFields = [{
    name: 'name',
    label: '名字',
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }]

  const remoteDataSource = {
    url: 'https://randomuser.me/api',
    method: 'GET',
    convertParams({ params }) {
      return {
        results: 3,
        ...params,
      };
    },
    converter({ data }) {
      return {
        list: data.results.map((item, index) => {
          return {
            ...item,
            id: `${index}`,
            name: `${item.name.first} ${item.name.last}`,
            index,
          };
        }),
        total: 10,
      };
    },
  };

  const columns = [{
    title: '序号',
    key: 'index'
  }, {
    title: '国家',
    key: 'nat'
  }, {
    title: '年龄',
    key: 'age',
    render: ctx => {
      return <span>{ctx.record.registered.age}</span>
    }
  }, {
    title: '名字',
    key: 'name'
  }, {
    title: '邮箱',
    key: 'email',
  }]
  return (
    <QueryTable
      layout="vertical"
      columns={columns}
      remoteDataSource={remoteDataSource}
      fields={queryFields}
      rowKey="id"
    />
  )
}

```

**那怎么添加搜索项呢？搜索项太多了该怎么显示呢？怎么添加操作呢？**
- fields: 搜索表单项配置列表
  - name：搜索字段，label：显示搜索字段名；field：搜索框配置（包含类型和属性）支持对象和字符串（type）
- columns中的render不仅仅支持函数形式，还支持数组的形式来配置action-render
  - 内部type表示点击类型（一般为icon、button、text）,支持props；
    - action配置的是事件组（若干个事件），事件可以是字符串或对象的形式配置，action是字符串表示事件类型，action是对象时内部type表示类型，他们是通过链式来依次调用执行  

*根据搜索项的个数，搜索层会呈现不同的形态；1、搜索项小于等于两个时；搜索框和按钮在同一行展示；2、搜索项大于两个小于六个，搜索按钮会展示在第二行最右侧；3、大于六个搜索项时，五个搜索项之外的搜索项会被隐藏且搜索按钮旁会出现显示或隐藏其他搜索项的操作*

**搜索表单配置变化**
![avatar](https://img.alicdn.com/tfs/TB1DhIQGAY2gK0jSZFgXXc5OFXa-4150-1312.png)
**columns配置变化**
![avatar](https://img.alicdn.com/tfs/TB132MGGuL2gK0jSZPhXXahvXXa-4096-1510.png)

```jsx
import React from 'react';
import { QueryTable } from 'sula';

export default () => {
  const remoteDataSource = {
    url: 'https://randomuser.me/api',
    method: 'GET',
    convertParams({ params }) {
      return {
        results: 3,
        ...params,
      };
    },
    converter({ data }) {
      return {
        list: data.results.map((item, index) => {
          return {
            ...item,
            id: `${index}`,
            name: `${item.name.first} ${item.name.last}`,
            index,
          };
        }),
        total: 10,
      };
    },
  };
  
  const queryFields = [{
    name: 'name',
    label: '名字',
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }, {
    name: 'nat',
    label: '国家',
    field: 'input'
  }, {
    name: 'email',
    label: '邮箱',
    field: 'input'
  }, {
    name: 'index',
    label: '序号',
    field: 'input'
  }, {
    name: 'input1',
    label: 'input1',
    field: 'input'
  }, {
    name: 'input2',
    label: 'input2',
    field: 'input'
  }]

  const columns = [{
    title: '序号',
    key: 'index'
  }, {
    title: '国家',
    key: 'nat'
  }, {
    title: '年龄',
    key: 'age',
    render: ctx => {
      return <span>{ctx.record.registered.age}</span>
    }
  }, {
    title: '名字',
    key: 'name'
  }, {
    title: '邮箱',
    key: 'email',
  }, {
    title: '操作',
    key: 'operat',
    render: [
      {
        confirm: '是否删除',
        type: 'icon',
        props: {
          type: 'appstore'
        },
        action: [
          {
            type: 'request',
            url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
            method: 'POST',
            params: {
              id: '#{record.id}',
            },
            successMessage: '删除成功',
          },
          'refreshTable'
        ]
      }
    ]
  }]
  return (
    <QueryTable
      layout="vertical"
      columns={columns}
      remoteDataSource={remoteDataSource}
      fields={queryFields}
      rowKey="id"
    />
  )
}

```

**怎么实现表格中新增以及批量操作这些常用功能点呢？还有表格内部搜索呢？**
- actionsRender: 表头自定义部操作组配置
  - type： 控制类型；支持props透传；action：事件（支持链式和单个）
- filters以数组的形式支持筛选；filterRender：search表示搜索；sorter：为true的时候可设置升降序搜索

**表格内部搜索添加**
![avatar](https://img.alicdn.com/tfs/TB1AitfGSf2gK0jSZFPXXXsopXa-4086-1344.png)
**表头自定义操作组配置添加**
![avatar](https://img.alicdn.com/tfs/TB15oeJXepyVu4jSZFhXXbBpVXa-4096-1588.png)

```jsx
import React from 'react';
import { QueryTable } from 'sula';

export default () => {
  const remoteDataSource = {
    url: 'https://randomuser.me/api',
    method: 'GET',
    convertParams({ params }) {
      return {
        results: 3,
        ...params,
      };
    },
    converter({ data }) {
      return {
        list: data.results.map((item, index) => {
          return {
            ...item,
            id: `${index}`,
            name: `${item.name.first} ${item.name.last}`,
            index,
          };
        }),
        total: 10,
      };
    },
  };
  
  const queryFields = [{
    name: 'name',
    label: '名字',
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }, {
    name: 'nat',
    label: '国家',
    field: 'input'
  }, {
    name: 'email',
    label: '邮箱',
    field: 'input'
  }, {
    name: 'index',
    label: '序号',
    field: 'input'
  }, {
    name: 'input1',
    label: 'input1',
    field: 'input'
  }, {
    name: 'input2',
    label: 'input2',
    field: 'input'
  }]

  const columns = [{
    title: '序号',
    key: 'index',
    sorter: true
  }, {
    title: '国家',
    key: 'nat',
    filterRender: 'search'
  }, {
    title: '年龄',
    key: 'age',
    filters: [{
      text: 3,
      value: 3
    }, {
      text: 12,
      value: 12
    }, {
      text: 18,
      value: 18
    }],
    render: ctx => {
      return <span>{ctx.record.registered.age}</span>
    }
  }, {
    title: '名字',
    key: 'name'
  }, {
    title: '邮箱',
    key: 'email',
  }, {
    title: '操作',
    key: 'operat',
    render: [
      {
        confirm: '是否删除',
        type: 'icon',
        props: {
          type: 'appstore'
        },
        action: [
          {
            type: 'request',
            url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
            method: 'POST',
            params: {
              id: '#{record.id}',
            },
            successMessage: '删除成功',
          },
          'refreshTable'
        ]
      }
    ]
  }]

  const actionsRender = [{
    type: 'button',
    disabled: ctx => {
      var selectedRowKeys = ctx.table.getSelectedRowKeys() || [];
      return !selectedRowKeys.length;
    },
    props: {
      icon: 'cloud-upload',
      children: '批量导出'
    },
    action: [
      () => {
        console.log('批量导出');
      },
      'refreshTable'
    ]
  }, {
    type: 'button',
    props: {
      type: 'primary',
      children: '新增',
    },
    action: {
      type: 'route',
      path: '/'
    }
  }]

  return (
    <QueryTable
      layout="vertical"
      columns={columns}
      remoteDataSource={remoteDataSource}
      fields={queryFields}
      actionsRender={actionsRender}
      rowSelection={{}}
      rowKey="id"
    />
  )
}

```

### icon的使用
**icon使用和其他插件有些区别；antd4.0版本后的icon都是按需导入的方式，sula也兼顾到了这种方式，把antd中的icon插件化，下面就聊聊sula中icon的使用**

- icon使用前需要先注册（一般会在global.js中注册）
- 说明：iconRegister函数接受一个对象，该对象的key是icon的类型，value有2种形式 `object | Element (antd icon)` *Element (antd icon)默认type为outlined* ；value为object时，该object的key表示的是icon形态`filled | outlined | twoTone`，object的value对应的是`Element (antd icon)`；

```js
import { Icon } from 'sula';
import { TabletFilled, AppstoreOutlined, EditTwoTone, CoffeeOutlined } from '@ant-design/icons';

Icon.iconRegister({
  tablet: {
    filled: TabletFilled,
  },
  appstore: {
    outlined: AppstoreOutlined,
  },
  edit: {
    twoTone: EditTwoTone,
  },
  coffee: CoffeeOutlined,
});

```
- 使用就比较简单了，可以以组件、插件的方式使用，`使用的必须是你注册过的icon`
- 参数
  - type：注册过的icon的类型
  - theme：icon的展示类型`filled | outlined | twoTone`；默认为outlined


组件的形式使用
```js
import React from 'react';
import { Icon } from 'sula';

return (
  <>
    <Icon type="appstore" />
    <Icon type="tablet" theme="filled" />
    <Icon type="edit" theme="twoTone" />
  </>
)
```
插件的形式使用(拿table中的columns操作项为例)

```js
const columns = [
  ...
  {
    title: '操作',
    key: 'operation',
    render: [
      {
        type: 'icon',
        props: {
          type: 'tablet',
          theme: 'filled'
        }
      }
    ]
  }
  ...
]
```

### action的使用说明
**事件列表**
- 介绍：action配置的是事件列表（若干个事件），事件可以是`字符串或对象`的形式配置，action是字符串表示事件类型，action是对象时内部type表示类型，他们是通过链式来依次调用执行
- 用处：一般用于table中的操作列事件组、table表头操作行事件组、form底部行操作组等;

```js
// 表头操作组
const actionsRender = [{
  type: 'button',
  props: {
    type: 'primary',
    children: '删除'
  },
  action: [
    {
      type: 'request',
      url: 'http://api/testMock/delete.json',
      method: 'post',
      params: {
        rowkey: '#{table.getSelectedRowKeys()}'
      }
    },
    'refreshtable'
  ]
}]

```

### 模版字符串
- 介绍：sula中模版字符串为兼容区分es6中的模版字符串，以`"#{}"`形式表示；常用于table中的columns中的字段拼接
