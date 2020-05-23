---
nav:
  title: API
  order: 100
---

## API

### 实例API

#### validateFields
触发表单验证
- 返回类型：`Promise`
- 默认值：`所有项`
- 参数: `{array} nameList | true`
  - nameList: 过滤nameList之外的值
  - 参数为ture时，过滤visible为false的值
- 用法
```javaScript
// 基本用法
validateFields()
  .then(value => {})
  .catch(error => {})
```

#### validateGroupFields
组触发表单验证
- 返回类型：`promise`
- 参数：`{string} groupName`
  - 能获取组里面的值
```javaScript
// 模拟组
...
return (
  <Form
    {...config}
    fields={[{
      name: 'groupName',
      label: '组',
      fields: [{
        name: 'name',
        label: '姓名',
        field: 'input'
      }, {
        name: 'ages',
        label: '年龄',
        field: 'input'
      }],
    }, {
      name: 'others',
      label: '其他',
      field: 'input',
    }]}
  />
)
...
// 基本用法
validateGroupFields('groupName')
  .then(value => {})
  .catch(error => {})
...
```

#### setFieldValue
设置值
- 参数: `{string} name；{any} value`
  - name: 设置值的form项；value：设置value的值
- 用法
```javaScript
setFieldValue('name', '首富')
```

#### setFieldSource
设置source值
- 参数: `{string} name; {any} source`
  - name：设置source的form项；value：设置source的值
- 用法
```javaScript
setFieldSource('fruit', [{ value: 'apple', text: '苹果' }])
```

#### setFieldVisible
设置form项的显隐
- 参数：`{string} name; {boolean} visible`
  - name：设置显隐的form项；visible：false|true
- 用法
```javaScript
setFieldVisible('memo', false);
```

#### setFieldDisabled
设置form项的disabled
- 参数：`{string} name; {boolean} visible`
  - name：设置disabled的form项；disabled：false|true
- 用法
```javaScript
setFieldDisabled('memo', false);
```

#### getFieldSource
获取form某项的source
- 参数：`{string} name`
  - name：获取source的form项；
- 用法
```javaScript
getFieldSource('fruit');
```

#### getFieldDisabled
获取form某项的disabled
- 参数：`{string} name`
  - name：获取disabled的form项；
- 用法
```javaScript
getFieldDisabled('fruit');
```

### itemLayout
form布局
- 类型: `object`
- 参数
  - `labelCol: label标签布局； wrapper：value布局（horizontal状态配置）`
  - `{number} span: form每项占有的栅格数`
  - `{number|object} cols: 每行占有的form项数；也可设置响应式`
```javaScript
const config = {
  itemLayout={{
    // cols: 3,
    span: 8,
    labelCol: {
      span: 8
    },
    wrapper: {
      span: 16,
    }
  }}
}
```

### mode
表单模式
- 类型: `create | view | edit`
- 默认: `create`
`create: 创建模式；view: 查看模式；edit: 编辑模式`

### dependency
表单关联
- 详细：表单关联分为几种情况；关联显隐`visible`, 数据源关联`source`, 禁用关联`disabled`, 值关联`value`
- 参数
  - `{object}` dependency：包裹的是级联配置对象；对象的key表示级联类型，分为四种`visible | source | disabled | value`；
  - `{Array}` relates：关联的form项
  - `{Array<Array<string>>}` inputs：设定关联项的匹配值，inputs二维数组的值和relates中的值一一映射
  - `{any}` output: 关联form项的值和inputs匹配时，output会被赋予当前form项
  - `{any}` defaultOutput: 关联form项的值和inputs不匹配时，defaultOutput会被赋予当前form项

```js
// 显示隐藏关联
const config = {
  fields: [
    {
      name: 'name',
      label: '姓名',
      field: 'input',
    },
    {
      name: 'fruit',
      label: '水果',
      initialSource,
      field: {
        type: 'select',
        props: {
          placeholder: '请输入'
        }
      },
      dependency: {
        disabled: {
          relates: ['name'],
          inputs: [['a']],
          output: true,
          defaultOutput: false,
        }
      }
    }
  ]
}

```

### container
容器插件
- 类型：`object`
- 参数
  - type：容器类型 - `card|div`
  - 支持props的透传
```javaScript
const config = {
  container: {
    type: 'card',
    props: {
      title: 'card 标题',
    }
  }
}
```

### fields
配置列表
- 类型：`array`
- 详细
  - `{string} field`：可直接使用sula内部所封装的插件，或者手动封装插件
  - `{object} field`: 对象中type表示插件类型，支持props透传和ruler设置
  - `{function} field`: 函数返回的是Element对象，ctx参数包含form实例；mode状态；该项的disabled、souce值

*fields是form配置项的列表，列表下的field可以用多种形式表述，一般常用的是string和object*

```javaScript
const config = {
  fields = [{
    name: 'name',
    lable: '姓名',
    field: 'input'
  }, {
    name: 'sex',
    lable: '性别',
    field: ctx => {
      console.log(ctx, 'ctx');
      return <input placeholder="please input" />
    }
  }, {
    name: 'age'
    label: '年龄'
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }]
}
```

### actionsRender
事件组列表
- 类型：`array`
- 参数
  - `{string}type`：操作项类型（button、icon、text等）
  - `{string|array|object|function} action`: 配置的是事件组，也可以是单个事件，遵循链式调用；
  - 支持props透传
  action每项存在3种形式
    1. 字符串：sula内置action插件（history、back等），也可以写一个插件植入
    2. 函数形式：遵循链式调用
    3. 对象: type表示插件类型

```javaScript
const actionsRender = [{
  type: 'button',
  props: {
    type: 'primary',
    children: '提交'
  },
  action: 'back'
}]
```

### actionsPosition
底部操作位置
- 类型值: `default | center | right | bottom`
- 默认值：default

### remoteValues
向服务器请求表单值
- 类型：`object`
- 参数
  - ulr：请求地址
  - method：请求方式
  - params：请求所携带参数
  - converter: 处理并通过return返回最终的列表数据

```javaScript
const config = {
  remoteValues: {
    url: 'https://www.mock/list.json',
    method: 'GET',
    params: {
      id: 1,
    },
    converter: ({data}) => {
      return { data, dataLength: data.length };
    }
  }
}
```

### onRemoteValuesStart
mode状态非create的初始化loading效果
```javaScript
const config = {
  onRemoteValuesStart: () => {
    this.setState({ loading: true });
  }
}
```

### onRemoteValuesEnd
mode状态非create的loading消失；配合onRemoteValuesStart使用
```javaScript
const config = {
  onRemoteValuesEnd: () => {
    this.setState({ loading: false });
  }
}
```

## Table

### 实例API

#### setDataSource
设置表格的值
- 参数：`{arrar} dataSource`
- 用法
```js
setDataSource(dataSource);
```

#### getDataSource
获取此时表格数据
- 用法
```js
getDataSource();
```

#### setPagination
设置分页配置
- 参数：`{object} pagination`
```js
setPagination({ pageSize: 1, total: 100 })
```

#### setFilters
设置过滤信息
- 参数：`object`
  - 参数对象中的key代表搜索项
```js
setFilters({ phone: [123456] })
```

#### setSorter
设置排序并刷新表格
- 参数
  - order: 控制升 `ascend`、降序 `descend`
  - columnKey: 控制升降序字段

```js
setSorter({
  order: 'ascend',
  columnKey: 'name'
})
```

#### getSelectedRowKeys
可操作表格中，获取当前勾选的表格行的 rowKey 列表
- 返回类型: `array`
```js
getSelectedRowKeys()
```

#### clearRowSelection
可操作表格中，清空所有选项
```js
clearRowSelection()
```

#### getSelectedRows
可操作列表中，获取选中项的数据
- 返回值：勾选项的dataSource
```js
getSelectedRows()
```

#### getPaging
获取表格当前分页、排序、过滤信息
返回值：`{ pagination, filters, sorter }`
```js
getPaging()
```

#### refreshTable
刷新表格
- 参数
  - pagination: 分页设置
  - filters：过滤
  - sorter：排序

```js
refreshTable()
```

#### resetTable
重置表格搜索项，根据参数确定是否刷新表格
- 参数：`{boolean} isRefresh`

```js
// 重置表格搜索项并刷新表格
resetTable(true)

// 重置表格搜索项但不刷新表格
resetTable(true)
```

### actionsRender
事件组配置
- 类型：`array`
- 参数
  - `{string} type`：事件承载类型（button、icon等）
  - 支持props的透传
  - action：事件组

- 详细
action：事件组，一共有4种形式`字符串` `函数形式` `对象形式` `数组形式`;字符串、函数形式和对象形式只能处理单个事件，字符串表示的是sula内置action插件或额外编写的插件；数组形式能处理多个事件并链式调用他们，数组中列举的是单个事件，他们也有三种形式`字符串` `函数` `对象`；字符串和上述含义相似；函数形式是用户自定义；对象形式是以type来识别内置插件

```javaScript
const config = {
  actionsRender: [{
    type: 'button',
    props: {
      children: '刷新表格'
    },
    action: 'refreshTable'
  }]
}
```

### columns
表格列的配置描述
- 类型：`array`
- 参数
  - `{string} title`: 列头显示文字
  - `{string} key`：	列数据在数据项中对应的路径，支持通过数组查询嵌套路径
  - `filters`: 以数组的形式支持筛选
  - `filterRender: search`: 搜索(含搜索框)
  - `sorter`：为true的时候可设置升降序搜索
  - `{function|array} render`: 设置表格项最终渲染形态，ctx参数包含该组list值和table实例等

*render中的action如上述*

```javaScript
const columns = [{
  title: '姓名',
  key: 'name',
  filterRender: 'search'
}, {
  title: '年龄',
  key: 'ages'
}, {
  title: '操作',
  key: 'operat',
  render: [{
    type: 'icon',
    props: {
      type: 'tablet'
    }
    action: 'refreshTable',
  }, {
    type: 'icon',
    props: {
      type: 'appstore'
    },
    action: [{
      type: 'request',
      url: 'https://www.testmock.json',
      method: 'POST',
      params: {
        id: '#{record.id}'
      }
    }, 'refreshTable']
  }]
}]
```

### leftActionsRender
- 类型：`array`
- 详细
  - rowSelection属性为空时，leftActionsRender可设置事件组（类似于actionsRender）；rowSelection不为空时leftActionsRender配置失效

### remoteDataSource
表格初始值请求
- 类型：`object`
- 参数
  - url: 请求地址
  - params: 请求参数
  - method: 请求方式
  - convertParams: 参数返回的是params，处理并通过return返回最终的请求参数
  - converter: 参数返回的是请求到的数据，处理并通过return返回最终的列表数据

```javaScript
const config = {
  remoteDataSource: {
    url: 'https://randomuser.me/api',
    method: 'GET',
    params: {
      id: 1
    },
    convertParams({ params }) {
      return {
        pageSize: params.pageSize,
        ...params,
      };
    },
    converter(list) {
      return {
        ...list,
        listLength: list.length,
      };
    },
  }
}

```

### initialPaging
表格初始分页
- 类型: `object`
- 默认值: `{ pagination: { current: 1, pageSize: 10 } }`
- 参数: 
  - pagination: 分页信息

```javaScript
const config = {
  initialPaging: {
    pagination: false, // 无分页情况
  }
}
```

### initialDataSource
table的初始化数据
- 类型: `array`

```javaScript
const config = {
  initialDataSource: [{
    name: '小明',
    ages: 12,
    memo: '喜欢游泳'
  }, {
    name: '小张',
    ages: 11,
    memo: '就喜欢吃'
  }]
}
```

## CreateForm
- 介绍：CreateForm是在sula-form基础上封装的模版，支持大多数form场景，createForm主要处理的是actionsRender层、布局和国际化
  - 只传submit的时候，默认处理成事件组，提交前会先处理表单验证，提交后默认返回；form底部会出现提交和返回
  - 传入actionsRender会覆盖默认的事件组
  - 并添加非create状态下赋值前的自动loading和赋值后的loading消失

### submit
提交表单
- 参数
  - url: 提交地址
  - method：请求方式
### back
- 默认history.goBack()，也可配置事件

```js
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
          },
          {
            name: 'fruit',
            label: '水果',
            initialSource,
            field: {
              type: 'select',
              props: {
                placeholder: '请输入'
              }
            },
          },
          {
            name: 'times',
            label: '是否保密',
            field: 'switch',
          }
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

## QueryTable
- 介绍：QueryTable是基于sula-table封装的搜索表格模版，主要是在table上层添加了form用来搜索，由fields来配置；autoInit来控制是否初始化table数据等

### fields
- 搜索表单配置，详情可参考form中fields配置

### visibleFieldsCount
- 类型：`number`
- 默认：5
- 设置超过多少个搜索项会显示展示图标

### autoInit
- 类型：`boolean`
- 控制是否初始化请求渲染table
- 默认：`true`

## StepForm
- 介绍：StepForm是基于sula-form封装的步骤表单模版

### direction
- 类型：`horizontal | vertical`
- 详细：控制步骤表单横向或竖向展示
- 默认：`vertical`

### steps
- 类型：`array`
- steps配置步骤表单，title设置的是步骤标题；fields参考form
```js
const config = {
  steps: [
    {
      title: 'Step1',
      fields: [
        {
          name: 'name',
          label: '姓名'，
          field: 'input'
        }
      ]
    },
    {
      title: 'Step2',
      fields: [
        {
          name: 'ages',
          label: '年龄'，
          field: 'input'
        }
      ]
    }
  ]
}
```

### result
- 类型: `true | object`
- 默认不出现成功页
- 详细：result是配置提交后是否出现成功页面

```js
// 设置成功页
const config = {
  result: true
}

// 设置成功页面提示文本
const config = {
  result: {
    successMessage: '成功'，
    successDescription: '付款成功'
  }
}
```

### submit
详情参考CreateForm的submit

### back
详情参考CreateForm的back

## StepQueryTable
- 介绍：StepQueryTable是基于QueryTable模版封装的步骤table

### autoRefresh
- 类型：`boolean`
- 默认：`true`
- 详细：切换步骤时是否自动刷新表格

### steps
- 详细：步骤表格的配置
- 参数
  - title: 步骤标题
  - subTitle：子标题
  - description：描述
  - fields: 搜索表单配置，详情可参考form中fields配置 `设置后覆盖外层的fields`
  - columns: 同sula-table的columns，详情请参考sula-table `设置后覆盖外层的columns`

```js
const config = {
  steps = [
    {
      title: 'Step1',
      subTitle: '子标题',
      description: '描述',
      fields: [],
      columns: [],
    }
  ]
}
```
