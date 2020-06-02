---
title: 指南
order: 1
---

## sula带你十分钟完成crud

### 起步

**本文将从umi搭建项目开始，帮助你在项目中轻松运用sula。**

1. 先找个文件夹建个空目录
```js
mkdir sula-use && cd sula-use
```
2. 通过[umi官方工具](https://umijs.org/zh-CN/docs/getting-started)创建项目
```js
yarn create @umijs/umi-app && npm i && npm start
```
在浏览器里打开 `http://localhost:8000/`

![avatar](https://img.alicdn.com/tfs/TB1NGj1HHj1gK0jSZFOXXc7GpXa-4690-302.png)

3. 安装 sula 和 umi-plugin-sula
```js
// 推荐cnpm
npm i sula umi-plugin-sula --save
```
> 注意：umi-plugin-sula 完成了sula插件的注册（否则要开发者手动注册），以及 history、语言类型的设置。

4. 在 .umirc.ts 中启用 umi-plugin-sula 插件

![avatar](https://img.alicdn.com/tfs/TB1BLMaIbY1gK0jSZTEXXXDQVXa-3650-856.png)

5. sula中未引入antd样式，在src目录下新建global.ts并导入antd主题
```js
// global.ts
import 'antd/dist/antd.less';
```

6. 最后可以在项目中尽情的使用sula了

![avatar](https://img.alicdn.com/tfs/TB1oGIuHKH2gK0jSZFEXXcqMpXa-2938-912.png)

最终呈现
![avatar](https://img.alicdn.com/tfs/TB18AcCHQL0gK0jSZFxXXXWHVXa-3034-324.png)

### CreateForm使用
**本示例是CreateForm一种简单的实现**，你会看到最常用的属性配置
  - fields：表单控件配置
    - field：表单控件插件
  - submit：表单提交配置
    - url：提交地址

```js
// pages/index.tsx
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
  const config = {
    fields: [
      {
        name: 'name',
        label: 'Name',
        field: 'input',
      },
    ],
    submit: {
      url: 'http://rap2.taobao.org:38080/app/mock/256045/form/submit.json',
      method: 'POST',
    }
  }
  return <CreateForm {...config} />
}
```

```jsx
// pages/index.tsx
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
  const config = {
    fields: [
      {
        name: 'name',
        label: 'Name',
        field: 'input',
      },
    ],
    submit: {
      url: 'http://rap2.taobao.org:38080/app/mock/256045/form/submit.json',
      method: 'POST',
    }
  }
  return <CreateForm {...config} />
}
```

**添加表单项**
- field：使用对象形式，可配置插件属性
  - type：插件类型
  - props：插件属性
- initialSource：表单项初始数据源(select下拉框)
- valuePropName: 子节点的值的属性，如 Switch 的是 'checked' [详情参考antd](https://ant.design/components/form-cn/#Form.Item)

```diff
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
+ const initialSource = [{
+   text: 'Web',
+   value: 'web'
+ }, {
+   text: 'Product',
+   value: 'product'
+ }];

  return (
    <div>
      <CreateForm
        fields={[
          {
            name: 'name',
            label: 'Name',
            field: 'input',
+          }, {
+            name: 'profession',
+            label: 'Profession',
+            initialSource,
+            field: {
+              type: 'select',
+              props: {
+                placeholder: 'please select profession'
+              }
+            },
+          }, {
+            name: 'rooms',
+            label: 'Rooms',
+            field: 'switch',
+            valuePropName: 'checked'
+          }
        ]}
        submit: {
          url: 'http://rap2.taobao.org:38080/app/mock/256045/form/submit.json',
          method: 'POST',
        }
      />
    </div>
  );
}
```

```jsx
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
  const initialSource = [{
    text: 'Web',
    value: 'web'
  }, {
    text: 'Product',
    value: 'product'
  }];

  const config = {
    fields: [
      {
        name: 'name',
        label: 'Name',
        field: 'input',
      }, {
        name: 'profession',
        label: 'Profession',
        initialSource,
        field: {
          type: 'select',
          props: {
            placeholder: 'please select profession'
          }
        },
      }, {
        name: 'rooms',
        label: 'Rooms',
        field: 'switch',
        valuePropName: 'checked'
      }
    ],
    submit: {
      url: 'http://rap2.taobao.org:38080/app/mock/256045/form/submit.json',
      method: 'POST',
    }
  }
  return <CreateForm {...config} />
}
```

**设置表单布局和容器**
- container：容器插件
  - type：插件类型
  - props：插件属性
- actionsPosition：按钮位置 `bottom | right | center | default(默认)`
- itemLayout: 表单布局，支持labelCol和wrapperCol属性，同[antd](https://ant.design/components/form-cn/#Form.Item)

```diff
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
  const initialSource = [{
    text: 'Web',
    value: 'web'
  }, {
    text: 'Product',
    value: 'product'
  }];

  const config = {
    fields: [
      {
        name: 'name',
        label: 'Name',
        field: 'input',
      }, {
        name: 'profession',
        label: 'Profession',
        initialSource,
        field: {
          type: 'select',
          props: {
            placeholder: 'please please'
          }
        },
      }, {
        name: 'rooms',
        label: 'Rooms',
        field: 'switch',
        valuePropName: 'checked'
      }
    ],
+    actionsPosition: 'right',
+    container: {
+      type: 'card',
+      props: {
+        title: 'Card'
+      }
+    },
+    itemLayout: {
+      span: 6,    // span表示每项所占的栅格数
+      labelCol: {
+        span: 6
+      },
+      wrapper: {
+        span: 18,
+      }
+    },
    submit: {
      url: 'http://rap2.taobao.org:38080/app/mock/256045/form/submit.json',
      method: 'POST',
    },
  }
  return <CreateForm {...config} />
}
```

```jsx
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
  const initialSource = [{
    text: 'Web',
    value: 'web'
  }, {
    text: 'Product',
    value: 'product'
  }];

  const config = {
    fields: [
      {
        name: 'name',
        label: 'Name',
        field: 'input',
      }, {
        name: 'profession',
        label: 'Profession',
        initialSource,
        field: {
          type: 'select',
          props: {
            placeholder: 'please input'
          }
        },
      }, {
        name: 'rooms',
        label: 'Rooms',
        field: 'switch',
        valuePropName: 'checked'
      }
    ],
    submit: {
      url: 'http://rap2.taobao.org:38080/app/mock/256045/form/submit.json',
      method: 'POST',
    },
    actionsPosition: 'right',
    container: {
      type: 'card',
      props: {
        title: 'Card'
      }
    },
    itemLayout: {
      span: 6,
      labelCol: {
        span: 6
      },
      wrapper: {
        span: 18,
      }
    }
  }
  return <CreateForm {...config} />
}
```

**远程表单值**
- remoteValues: 表单初始值远程请求
  - url: 接口地址
- mode: 表单模式 `create: 创建模式，view: 查看模式，edit: 编辑模式`

>mode为view或edit时才会执行remoteValues请求

```diff
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
  const initialSource = [{
    text: 'Web',
    value: 'web'
  }, {
    text: 'Product',
    value: 'product'
  }];

  const config = {
    fields: [
      {
        name: 'name',
        label: 'Name',
        field: 'input',
      }, {
        name: 'profession',
        label: 'Profession',
        initialSource,
        field: {
          type: 'select',
          props: {
            placeholder: 'please select profession'
          }
        },
      }, {
        name: 'rooms',
        label: 'Rooms',
        field: 'switch',
        valuePropName: 'checked'
      }
    ],
    actionsPosition: 'right',
    container: {
      type: 'card',
      props: {
        title: 'Card'
      }
    },
    itemLayout: {
      span: 6,
      itemLayout: {
        span: 6,
        labelCol: {
          span: 6
        },
        wrapper: {
          span: 18,
        }
      }
    },
    submit: {
      url: 'http://rap2.taobao.org:38080/app/mock/256045/form/submit.json',
      method: 'POST',
    },
+    remoteValues: {
+      url: 'http://rap2.taobao.org:38080/app/mock/256045/form/formList',
+      method: 'get',
+    },
+    mode: 'edit'
  }
  return <CreateForm {...config} />
}
```

```jsx
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
  const initialSource = [{
    text: 'Web',
    value: 'web'
  }, {
    text: 'Product',
    value: 'product'
  }];

  const config = {
    fields: [
      {
        name: 'name',
        label: 'Name',
        field: 'input',
      }, {
        name: 'profession',
        label: 'Profession',
        initialSource,
        field: {
          type: 'select',
          props: {
            placeholder: 'please select profession'
          }
        },
      }, {
        name: 'rooms',
        label: 'Rooms',
        field: 'switch',
        valuePropName: 'checked'
      }
    ],
    actionsPosition: 'right',
    container: {
      type: 'card',
      props: {
        title: 'Card'
      }
    },
    itemLayout: {
      span: 6,
      itemLayout: {
        span: 6,
        labelCol: {
          span: 6
        },
        wrapper: {
          span: 18,
        }
      }
    },
    submit: {
      url: 'http://rap2.taobao.org:38080/app/mock/256045/form/submit.json',
      method: 'POST',
    },
    remoteValues: {
      url: 'http://rap2.taobao.org:38080/app/mock/256045/form/formList',
      method: 'get',
    },
    mode: 'edit',
  }
  return <CreateForm {...config} />
}
```

### QueryTable使用
- layout: 查询表单布局
- columns：表格列配置
```js
interface ColumnsProps = {
  title: string | ({ sortOrder, sortColumn, filters }) => ReactNode;
  key: string;
  render: RenderPlugin | RenderPlugin[];
  filterRender: { type: string } | string;
  [key: string]: AntdColumnsProps; // antd table columns透传属性
}
```
初始代码

```js
// pages/index.tsx
import React from 'react';
import { QueryTable } from 'sula';

export default () => {
  const fields = [{
    name: 'name',
    label: 'Name',
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }]
  const columns = [{
    title: 'Sequence',
    key: 'index'
  }, {
    title: 'Country',
    key: 'nat'
  }, {
    title: 'Age',
    key: 'age',
  }, {
    title: 'Name',
    key: 'name'
  }, {
    title: 'Email',
    key: 'email',
  }]
  return (
    <QueryTable
      layout="vertical"
      columns={columns}
      fields={fields}
      rowKey="id"
    />
  )
}
```

```jsx
// pages/index.tsx
import React from 'react';
import { QueryTable } from 'sula';

export default () => {
  const fields = [{
    name: 'name',
    label: 'Name',
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }]
  const columns = [{
    title: 'Sequence',
    key: 'index'
  }, {
    title: 'Country',
    key: 'nat'
  }, {
    title: 'Age',
    key: 'age',
  }, {
    title: 'Name',
    key: 'name'
  }, {
    title: 'Email',
    key: 'email',
  }]
  return (
    <QueryTable
      layout="vertical"
      columns={columns}
      fields={fields}
      rowKey="id"
    />
  )
}
```

**添加初始化数据**
- remoteDataSource：表格值接口请求
  - url: 请求地址
  - convertParams：处理请求参数
  - converter：处理返回数据

查询表格请求参数默认为以下格式
```js
{
   pagination: {
     pageSize: 10,
     current: 1, 
   },
   filters: {  // 过滤项
     age: 1,
     name: 'Bob'
   },
   sorter: {
     columnKey: 'index', // 排序项
     order: 'ascend'   // descend 降序； ascend：升序
   }
}
```
sula-table支持的期望数据格式
```js
{
  data: {
    list: [],   // 表格数据列表
    current: 1,
    pageSize: 10,  // 每页条数
    total: 100,     // 数据总数
  }
}
```

```diff
import React from 'react';
import { QueryTable } from 'sula';

export default () => {
  const fields = [{
    name: 'name',
    label: 'Name',
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }]

+  const remoteDataSource = {
+    url: 'http://rap2.taobao.org:38080/app/mock/256045/table/list',
+    method: 'GET',
+    convertParams({ params }) {
+      return {
+        results: 3,
+        ...params,
+      };
+    },
+    converter({ data }) {
+      return {
+        list: data.results.map((item, index) => {
+          return {
+            ...item,
+            id: index,
+            index,
+          };
+        }),
+        total: 10,
+      };
+    },
+  };

  const columns = [{
    title: 'Sequence',
    key: 'index'
  }, {
    title: 'Country',
    key: 'nat'
  }, {
    title: 'Age',
    key: 'age',
  }, {
    title: 'Name',
    key: 'name'
  }, {
    title: 'Email',
    key: 'email',
  }]
  return (
    <QueryTable
      layout="vertical"
      columns={columns}
+      remoteDataSource={remoteDataSource}
      fields={fields}
      rowKey="id"
    />
  )
}
```

```jsx
import React from 'react';
import { QueryTable } from 'sula';

export default () => {
  const fields = [{
    name: 'name',
    label: 'Name',
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }]
  const remoteDataSource = {
    url: 'http://rap2.taobao.org:38080/app/mock/256045/table/list',
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
            id: index,
            index,
          };
        }),
        total: 10,
      };
    },
  };
  
  const columns = [{
    title: 'Sequence',
    key: 'index'
  }, {
    title: 'Country',
    key: 'nat'
  }, {
    title: 'Age',
    key: 'age',
  }, {
    title: 'Name',
    key: 'name'
  }, {
    title: 'Email',
    key: 'email',
  }]
  return (
    <QueryTable
      layout="vertical"
      columns={columns}
      remoteDataSource={remoteDataSource}
      fields={fields}
      rowKey="id"
    />
  )
}
```

**添加搜索项**
>注意：根据搜索项个数，查询表单会呈现不同的形态
- 搜索项个数小于等于2个时；搜索项和搜索按钮在同一行展示
- 搜索项个数大于2个不超过5个时，搜索按钮会展示在第二行最右侧
- 搜索项个数超过5个时，超出的搜索项会被折叠隐藏

```diff
import React from 'react';
import { QueryTable } from 'sula';

export default () => {
  const fields = [{
    name: 'name',
    label: 'Name',
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
+  }, {
+    name: 'nat',
+    label: 'Country',
+    field: 'input'
+  }, {
+   name: 'email',
+   label: 'Email',
+   field: 'input'
+ }, {
+   name: 'index',
+   label: 'Sequence',
+   field: 'input'
+ }, {
+   name: 'age',
+   label: 'Age',
+   field: 'input'
+ }, {
+   name: 'others',
+   label: 'Others',
+   field: 'input'
  }]

  const remoteDataSource = {
    url: 'http://rap2.taobao.org:38080/app/mock/256045/table/list',
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
            id: index,
            index,
          };
        }),
        total: 10,
      };
    },
  };
  
  const columns = [{
    title: 'Sequence',
    key: 'index'
  }, {
    title: 'Country',
    key: 'nat'
  }, {
    title: 'Age',
    key: 'age',
  }, {
    title: 'Name',
    key: 'name'
  }, {
    title: 'Email',
    key: 'email',
  }]
  return (
    <QueryTable
      layout="vertical"
      columns={columns}
      remoteDataSource={remoteDataSource}
      fields={fields}
      rowKey="id"
    />
  )
}
```

```jsx
import React from 'react';
import { QueryTable } from 'sula';

export default () => {
  const fields = [{
    name: 'name',
    label: 'Name',
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }, {
    name: 'nat',
    label: 'Country',
    field: 'input'
  }, {
    name: 'email',
    label: 'Email',
    field: 'input'
  }, {
    name: 'index',
    label: 'Sequence',
    field: 'input'
  }, {
    name: 'age',
    label: 'Age',
    field: 'input'
  }, {
    name: 'others',
    label: 'Others',
    field: 'input'
  }]

  const remoteDataSource = {
    url: 'http://rap2.taobao.org:38080/app/mock/256045/table/list',
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
            id: index,
            index,
          };
        }),
        total: 10,
      };
    },
  };
  
  const columns = [{
    title: 'Sequence',
    key: 'index'
  }, {
    title: 'Country',
    key: 'nat'
  }, {
    title: 'Age',
    key: 'age',
  }, {
    title: 'Name',
    key: 'name'
  }, {
    title: 'Email',
    key: 'email',
  }]
  return (
    <QueryTable
      layout="vertical"
      columns={columns}
      remoteDataSource={remoteDataSource}
      fields={fields}
      rowKey="id"
    />
  )
}
```

**添加操作列**
> 说明：AntD 4.x 的Icon采用按需引入的方式，使用前需要注册Icon插件。

```js
// global.ts
import { Icon } from 'sula';
import { DeleteOutlined } from '@ant-design/icons';

// 注册所需的icon
Icon.iconRegister({
  delete: DeleteOutlined,
});
```

- render: 操作列配置
  - type：渲染插件类型 `文本 图标 按钮`
  - props：属性
  - action: 行为插件，点击触发行为，支持多种格式
    - string：行为插件类型，如`refreshtable`刷新表格
    - function：回调函数
    - object：可配置 type  final error 等属性
    - array：支持以上几种类型，promise链式调用

> action类型为request时，url、params等可配置在对象中；sula会帮你处理请求

```diff
  const columns = [{
    title: 'Sequence',
    key: 'index'
  }, {
    title: 'Country',
    key: 'nat'
  }, {
    title: 'Age',
    key: 'age',
  }, {
    title: 'Name',
    key: 'name'
  }, {
    title: 'Email',
    key: 'email',
+  }, {
+    title: 'Operator',
+    key: 'operator',
+    render: [
+      {
+        confirm: 'delete or not',
+        type: 'icon',
+        props: {
+          type: 'delete'
+        },
+        action: [
+          {
+            type: 'request',
+            url: 'http://rap2.taobao.org:38080/app/mock/256045/table/detele',
+            method: 'POST',
+            params: {
+              id: '#{record.id}',
+            },
+            successMessage: 'successfully deleted',
+          },
+          'refreshTable'
+        ]
+      }
+    ]
  }]
```

```jsx
import React from 'react';
import { QueryTable, Icon } from 'sula';
import { DeleteOutlined } from '@ant-design/icons';

Icon.iconRegister({
  delete: DeleteOutlined,
});

export default () => {
  const fields = [{
    name: 'name',
    label: 'Name',
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }, {
    name: 'nat',
    label: 'Country',
    field: 'input'
  }, {
    name: 'email',
    label: 'Email',
    field: 'input'
  }, {
    name: 'index',
    label: 'Sequence',
    field: 'input'
  }, {
    name: 'age',
    label: 'Age',
    field: 'input'
  }, {
    name: 'others',
    label: 'Other',
    field: 'input'
  }]

  const remoteDataSource = {
    url: 'http://rap2.taobao.org:38080/app/mock/256045/table/list',
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
            id: index,
            index,
          };
        }),
        total: 10,
      };
    },
  };
  
  const columns = [{
    title: 'Sequence',
    key: 'index'
  }, {
    title: 'Country',
    key: 'nat'
  }, {
    title: 'Age',
    key: 'age',
  }, {
    title: 'Name',
    key: 'name'
  }, {
    title: 'Email',
    key: 'email',
  }, {
    title: 'Operator',
    key: 'operator',
    render: [
      {
        confirm: 'delete or not',
        type: 'icon',
        props: {
          type: 'delete'
        },
        action: [
          {
            type: 'request',
            url: 'http://rap2.taobao.org:38080/app/mock/256045/table/detele',
            method: 'POST',
            params: {
              id: '#{record.id}',
            },
            successMessage: 'successfully deleted',
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
      fields={fields}
      rowKey="id"
    />
  )
}
```

**添加排序、筛选**
- filters表头的筛选菜单项
- filterRender：过滤插件
- sorter：服务端排序 可设为ture

> 本例中filterRender设置的search为sula内置过滤插件，效果如下图

![avatar](https://img.alicdn.com/tfs/TB1D4XgXA9l0K4jSZFKXXXFjpXa-1268-672.png)

```diff
  const columns = [{
    title: 'Sequence',
    key: 'index',
+    sorter: true
  }, {
    title: 'Country',
    key: 'nat',
+    filterRender: 'search'
  }, {
    title: 'Age',
    key: 'age',
+    filters: [{
+      text: 3,
+      value: 3
+    }, {
+      text: 12,
+      value: 12
+    }, {
+      text: 18,
+      value: 18
+    }],
  }, {
    title: 'Name',
    key: 'name'
  }
```

```jsx
import React from 'react';
import { QueryTable } from 'sula';

export default () => {
  const fields = [{
    name: 'name',
    label: 'Name',
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }, {
    name: 'nat',
    label: 'Country',
    field: 'input'
  }, {
    name: 'email',
    label: 'Email',
    field: 'input'
  }, {
    name: 'index',
    label: 'Sequence',
    field: 'input'
  }, {
    name: 'age',
    label: 'Age',
    field: 'input'
  }, {
    name: 'others',
    label: 'Others',
    field: 'input'
  }]

  const remoteDataSource = {
    url: 'http://rap2.taobao.org:38080/app/mock/256045/table/list',
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
            id: index,
            index,
          };
        }),
        total: 10,
      };
    },
  };
  
  const columns = [{
    title: 'Sequence',
    key: 'index',
    sorter: true
  }, {
    title: 'Country',
    key: 'nat',
    filterRender: 'search'
  }, {
    title: 'Age',
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
  }, {
    title: 'Name',
    key: 'name'
  }, {
    title: 'Email',
    key: 'email',
  }, {
    title: 'Operator',
    key: 'operator',
    render: [
      {
        confirm: 'delete or not',
        type: 'icon',
        props: {
          type: 'delete'
        },
        action: [
          {
            type: 'request',
            url: 'http://rap2.taobao.org:38080/app/mock/256045/table/detele',
            method: 'POST',
            params: {
              id: '#{record.id}',
            },
            successMessage: 'successfully deleted',
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
      fields={fields}
      rowKey="id"
    />
  )
}
```

**在表头添加操作按钮**
- rowSelection: 表格行是否可选择
- actionsRender: 表头操作按钮配置，同 `操作列render配置`

> disabled: 根据是否勾选选择框来判断批量操作的状态，参数ctx为 table实例、table数据源、history

```diff
+  const actionsRender = [{
+    type: 'button',
+    disable: ctx => {
+      const selectedRowKeys = ctx.table.getSelectedRowKeys() || [];
+      return !selectedRowKeys.length;
+    },
+    props: {
+      children: 'Bulk Export',
+      type: 'primary'
+    },
+    action: [
+      () => {
+        console.log('Bulk Export')
+      },
+      'refreshTable' // 刷新表格
+    ]
+  }]

  return (
    <QueryTable
      layout="vertical"
      columns={columns}
+      remoteDataSource={remoteDataSource}
      actionsRender={actionsRender}
+      rowSelection={{}}
      fields={fields}
      rowKey="id"
    />
  )
```
```jsx
import React from 'react';
import { QueryTable } from 'sula';

export default () => {
  const fields = [{
    name: 'name',
    label: 'Name',
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }, {
    name: 'nat',
    label: 'Country',
    field: 'input'
  }, {
    name: 'email',
    label: 'Email',
    field: 'input'
  }, {
    name: 'index',
    label: 'Sequence',
    field: 'input'
  }, {
    name: 'age',
    label: 'Age',
    field: 'input'
  }, {
    name: 'others',
    label: 'Others',
    field: 'input'
  }]

  const remoteDataSource = {
    url: 'http://rap2.taobao.org:38080/app/mock/256045/table/list',
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
            id: index,
            index,
          };
        }),
        total: 10,
      };
    },
  };
  
  const columns = [{
    title: 'Sequence',
    key: 'index',
    sorter: true
  }, {
    title: 'Country',
    key: 'nat',
    filterRender: 'search'
  }, {
    title: 'Age',
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
  }, {
    title: 'Name',
    key: 'name'
  }, {
    title: 'Email',
    key: 'email',
  }, {
    title: 'Operator',
    key: 'operator',
    render: [
      {
        confirm: 'delete or not',
        type: 'icon',
        props: {
          type: 'delete'
        },
        action: [
          {
            type: 'request',
            url: 'http://rap2.taobao.org:38080/app/mock/256045/table/detele',
            method: 'POST',
            params: {
              id: '#{record.id}',
            },
            successMessage: 'successfully deleted',
          },
          'refreshTable'
        ]
      }
    ]
  }]

  const actionsRender = [{
    type: 'button',
    disable: ctx => {
      const selectedRowKeys = ctx.table.getSelectedRowKeys() || [];
      return !selectedRowKeys.length;
    },
    props: {
      children: 'Bulk Export',
      type: 'primary'
    },
    action: [
      () => {
        console.log('Bulk Export')
      },
      'refreshTable'
    ]
  }]

  return (
    <QueryTable
      layout="vertical"
      columns={columns}
      remoteDataSource={remoteDataSource}
      actionsRender={actionsRender}
      rowSelection={{}}
      fields={fields}
      rowKey="id"
    />
  )
}
```
