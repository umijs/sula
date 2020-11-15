---
group: 
  title: API
  order: 6
title: 配置API
order: 0
---
# API

## Form

### ctx
sula 内所有配置属性，均支持配置方法，ctx 为该方法的第一个参数，配置给不同属性时，ctx 内容会有差异

**参数及适用范围**
- form实例
- history: 详情参考 [umi history](https://umijs.org/zh-CN/api#history)
- mode: 表单模式, 支持 `'create' | 'view' | 'edit'`
- disabled: 是否可点击
- source：表单项数据源 `(select、checkboxgroup等支持source)`
- results、 result：链式操作的上一个行为promise返回的结果

|      | form | history | mode | disabled | source | results | result |
| ---- | ---- | ------- | ---- | -------- | ------ | ------- | ------ |
| field |  ✅  |  -  |  ✅  |  ✅  |  ✅  |  -  |  -  |
| render | ✅ |  -  |  ✅  |  -  |  -  |  -  |  -  |
| container | ✅ |  -  |  ✅  |  -  |  -  |  -  |  -  |
| actionsRender |  ✅  |  ✅  |  ✅  | - | - |  -  |  -  |
| action |  ✅  |  ✅  |  ✅  | - | - |  ✅  |  ✅  |


#### field 示例
表单控件插件
- 示例
```js
const fields = [
  {
    name: 'name',
    label: '姓名',
    fields: ctx => {
      return <Input disabled={ctx.mode === 'view'} />
    }
  },
  {
    name: 'age',
    label: '年龄',
    fields: {
      type: 'input',
      funcProps: {
        disabled: ctx => {
          if (ctx.text === '12') {
            return true;
          };
          return false;
        }
      }
    }
  },
  {
    name: 'others',
    label: '其他',
    render: ctx => {
      return <div>{ctx.mode} 渲染展示</div>
    }
  }
]
```

#### container 示例
容器插件
- 示例
```js
const container = {
  type: 'card',
  props: {
    title: '#{mode} 标题' // 可以通过 '#{}' 来取值
  }
}
```

### actionsRender 示例
表单底部操作组
- 说明： `actionsRender` ctx返回的是 `form`、 `history`、 `mode`；`actions`会进行链式操作，promise执行后会返回`result`、`results`
- 示例
```js
const actionsRender = [{
  type: 'button',
  props: {
    children: '提交',
    type: 'primary'
  },
  disabled: ctx => {
    if (ctx.mode === 'view') {
      return 'default';
    }
    return 'primary';
  },
  funcProps: {
    type: ctx => {
      if (ctx.mode === 'view') {
        return 'default';
      }
      return 'primary';
    }
  },
  action: [
    ctx => {
      console.log(ctx, 'action ctx')
    },
    // 行为链
  ]
}]
```

### 实例API

#### validateFields
触发表单验证
- 参数类型: `NamePath | true`
- 返回类型：`Promise`
- 介绍
  - 忽略`visible`或`collect`为`false`的表单项
- 用法
```js
// 返回格式同antd
validateFields()
  .then(values => {})
  .catch(error => {})
```

#### validateGroupFields
组触发表单验证
- 参数类型：`string`
- 返回类型：`promise`
- 介绍: 参数必填且只验证所选的组

- 用法
```js
const fields = [{
  name: 'name',
  label: '姓名',
  field: 'input'
}, {
  name: 'groups',
  label: '组',
  fields: [{
    name: 'ages',
    label: '年龄',
    field: 'input'
  }]
}]

// 返回格式同antd
validateGroupFields('groups')
  .then(values => {})
  .catch(error => {})
```

#### setFieldsValue
设置表单的值
- 参数类型: `({ [key: string]: any; }) => void`
- 介绍: 用法可参考[antd/setFieldsValue](https://ant-design.gitee.io/components/form-cn/#API)
- 用法
```js
setFieldsValue({
  name: 'value1',
  ages: 'value2',
})
```

#### setFieldValue
设置单个表单项的值
- 参数类型: `(name: NamePath, any) => void`
- 介绍: setFieldValue执行会触发表单联动

- 用法
```js
setFieldValue('name', '首富')
```

#### setFields
设置一组字段状态
- 参数：`(fields: FieldData[]) => void`
- 用法
```js
setFields([{
  name: 'name',  // 字段名称
  validating: false,  // 是否正在校验
  value: 'value', // 字段对应值
  // 可以在form实例isFieldValidating中获取
  touched: true,  // 是否被用户操作过
  errors: ['please input', 'others'],  // 错误信息
}])
```

#### setFieldSource
设置表单项数据源
- 参数类型: `(name: NamePath, any) => void`
- 用法
```js
setFieldSource('fruit', [{ value: 'apple', text: '苹果' }])
```

#### setFieldVisible
设置表单项的显隐
- 参数类型：`(name: NamePath, boolean) => void`
- 用法
```js
setFieldVisible('memo', false);
```

#### setFieldDisabled
设置表单项是否禁用的状态
- 参数类型：`(name: NamePath, boolean) => void`
- 用法
```js
setFieldDisabled('memo', false);
```

#### getFieldSource
获取表单项的数据源
- 参数类型：`(NamePath) => any`
- 用法
```js
getFieldSource('fruit');
```

#### getFieldDisabled
获取表单项是否禁用的状态
- 参数：`(NamePath) => boolean`
- 用法
```js
getFieldDisabled('fruit');
```

### itemLayout
表单布局
- 类型: `{ [key: string]: any }`
- 默认值: `{ span: 24, labelCol: { span: 6 }, wrapperCol: { span: 16 } }`
- 属性：
  - `cols`: 也可设置响应式 参考[antd/Col](https://ant.design/components/grid-cn/#Col)

- 用法
```js
const config = {
  itemLayout={{
    // cols: 3, // 每行所占的表单项个数
    span: 8, // 栅格占位格数
    labelCol: { // label标签布局；可设置 span、offset
      span: 8
    },
    wrapperCol: { // value布局, 方式同labelCol（horizontal状态下配置）
      span: 16,
    }
  }}
}
```

### mode
表单模式
- 类型: 支持 `create: 创建模式；view: 查看模式；edit: 编辑模式`
- 默认: `create`
- 介绍: mode为 `create` 时不会触发remoteValues方法

### dependency
表单关联
- 详细用法参考 [dependency](#/form-advanced/)
- 属性
  - dependency: 包裹的是级联配置对象，支持 `visible | source | disabled | value`
  - dependency下的属性

|  属性名  | 说明 | 类型 |
|  ----  | ----  | ---- |
| relates  | 关联表单项 | `Array<NamePath>` |
| inputs  | 设定关联表单项的匹配值，inputs和relates遵循一一映射关系 | `any[][]` |
| output  | 关联表单项的值匹配inputs值且相等时，当前表单项会被设置成output的值 | `any` |
| ignores  | 数组中的元素`(数组)`一一映射relates中需要忽略的值，当匹配忽略时则采用defaultOutput | `any[][]` |
| defaultOutput  | 关联表单项的值匹配inputs值且相等时，当前表单项会被设置成defaultOutput的值 | `any` |
| cases  | 更多的匹配场景，cases中同名字段优先级更高 | `array` |
| type  | 自定义关联 | `string` \| `(ctx,config) => void` |

- 介绍: 表单关联支持: 显隐关联 `visible`、数据源关联 `source`、禁用关联 `disabled`、值关联 `value`
- 注意: `*` 表示匹配所有

- 用法
```js
// 显示隐藏关联
const initialSource = [{
  value: 'apple',
  text: '苹果'
}, {
  value: 'banana',
  text: '香蕉'
}]
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
- 类型：`ReactElement | (ctx) => ReactElement | RenderType`
- 属性
  - type：插件类型
  - props: 属性
- 用法
```js
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
表单控件配置
- 类型：`Array<Field>`
- 属性

|  属性名  | 说明 | 类型 | 默认值 |
|  ----  | ----  | ---- | - |
| name  | 字段名(支持数组) | `string` \| `number` \| `Array<string`\|`number>` | - |
| lable  | 标签的文本 | `string` | - |
| layout  | 表单布局，优先级高于顶层配置 | `vertical` \| `horizontal` \| `inline` | `horizontal` |
| itemLayout  | 表单项布局分布，优先级高于顶层配置 | `object` | `{ span: 24, labelCol: { span: 6 }, wrapperCol: { span: 16 } }` |
| field  | 表单项控件 | `(ctx) => ReactNode` \| `RenderType` | - |
| initialVisible  | 表单项初始是否显示 | `boolean` | `true` |
| initialDisabled  | 表单项初始禁用状态 | `boolean` | `false` |
| initialSource  | 表单项初始数据源 | `any` | - |
| rules  | 校验规则，设置字段的校验逻辑 | `Array<Rule>` | - |
| dependency  | 配置表单关联,参考 `dependency` | `object` | - |
| remoteSource  | 表单项远程数据源 | `FetchType` | - |

- 用法
```js
const config = {
  fields = [{
    name: ['name', 'username'],
    lable: '姓名',
    field: 'input',
    rules: [{ required: true, message: '请输入姓名' }]
  }, {
    name: 'age'
    label: '年龄'
    field: {
      type: 'input',
      props: {
        placeholder: 'please input'
      }
    }
  }, {
    name: 'sex',
    lable: '性别',
    field: ctx => {
      return <input placeholder="please input" disabled={ctx.mode === 'view' ? true : false} />
    }
  }]
}
```

### actionsRender
事件操作组
- 类型：`RenderPlugin | RenderPlugin[]`
- 属性
  - type：渲染插件类型 支持`文本 图标 按钮`等
  - confirm：确认框的描述
  - tooltip：文字提示
  - disabled: 禁用点击
  - props：属性
  - action: 行为插件，点击触发行为，支持多种格式
    - string：行为插件类型，如refreshtable刷新表格
    - function：回调函数
    - object: 配置事件
      - type: 行为插件类型 `request类型可省略type`
      - before: 事件执行前的回调，可通过 `return false`或`return reject()` 阻断行为链
      - error: 事件执行报错回调
      - finish: 成功回调
      - final: 最后回调
    - array：支持以上几种类型，promise链式调用

- 用法
```js
const actionsRender = [{
  type: 'button',
  confirm: '确认提交',
  tooltip: '提交操作',
  props: {
    type: 'primary',
    children: '提交'
  },
  action: [
    'validateFields',
    {
      url: 'http://rap2.taobao.org:38080/app/mock/256045/form/submit.json',
      method: 'post',
      params: ctx => {
        return ctx.result;
      }
    },
    'back'
  ]
}]
```

### actionsPosition
底部操作位置
- 类型: 支持 `default | center | right | bottom`
- 默认值：`default`

### remoteValues
向服务器请求表单值
- 类型：`object`
- 属性

|  属性名  | 说明 | 类型 | 默认值 |
|  ----  | ----  | ---- | - |
| url | 请求地址 | `string` | - |
| method | 请求方式 | `string` | - |
| params | 参数 | `object` | - |
| converter | 处理返回数据 | `function` | - |

- 介绍: mode为view或edit时才会执行remoteValues请求

- 用法
```js
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
远程请求开始时的回调
- 参数：`-`
- 返回值：`-`
- 用法
```js
const config = {
  onRemoteValuesStart: () => {
    this.setState({ loading: true });
  }
}
```

### onRemoteValuesEnd
远程请求结束时的回调
- 参数：`-`
- 返回值：`-`
```js
const config = {
  onRemoteValuesEnd: () => {
    this.setState({ loading: false });
  }
}
```

### Field 组件
表单域
- 类型: `ReactElement`
- 属性

|  属性名  | 说明 | 类型 | 默认值 |
|  ----  | ----  | ---- | - |
| field | 表单项控件 | `FieldPlugin` | - |
| name | 字段名(支持数组) | `FieldNamePath` | - |
| collect | 是否收集表单项的值 | `boolean` | - |
| initialDisabled | 表单项初始禁用状态 | `boolean` | - |
| initialVisible | 表单项初始是否显示 | `boolean` | - |
| initialSource | 表单项初始数据源 | `any` | - |
| initialValue | 表单项初始值 | `any` | - |
| remoteSource | 表单项远程数据源 | `RequestConfig` | - |
| dependency | 配置表单关联 `参考 dependency` | `Dependencies` | - |
| children | 子组件 | `ReactElement` \| `FieldPlugin[]` | - |
| layout | 表单布局 | `'horizontal'` \| `'vertical'` \| `'inline'` | - |
| rules | 校验规则 | `Array<Omit<Rule, 'validator'> & {validator? : ValidatorPlugin;}>` | - |
| childrenContainer | 表单项容器 | `RenderPlugin` | - |

- 示例
```js
import React from 'react';
import { Form, FieldGroup, Field } from 'sula';

export default () => {
  const fieldChildren = [{
    name: 'a',
    label: 'a',
    field: 'input',
  }, {
    name: 'b',
    label: 'b',
    field: 'input',
  }, {
    name: 'c',
    label: 'c',
    field: 'input',
  }]
  return (
    <Form>
      <FieldGroup>
        <Field field="input" name="name" label="name" rules={[{ required: true, message: 'Please input' }]} />
        <Field label="aa">
          <div>view</div>
        </Field>
        <Field label="bb">
          <>
            <Field field="input" name="h" label="h" />
            <Field field="input" name="f" label="f" />
            <Field field="input" name="j" label="j" />
          </>
        </Field>
        <Field label="cc" childrenContainer={{ type: 'card', props: { title: 'card' } }}>
          {fieldChildren}
        </Field>
      </FieldGroup>
    </Form>
  )
}
```

### FormAction 组件
表单操作组
- 类型: `ReactElement`
- 属性

|  属性名  | 说明 | 类型 | 默认值 |
|  ----  | ----  | ---- | - |
| actionsPosition | 底部操作位置 | `'default'` \| `'bottom'` \| `'right'` \| `'center'` | `'default'` |
| actionsRender | 操作组配置 | `RenderPlugin` \| `RenderPlugin[]` | - |
| children | 子组件 | `ReactElement` | - |

- 示例
```js
import React from 'react';
import { Form, FieldGroup, FormAction } from 'sula';

export default () => {
  const fields = [{
    name: 'name',
    label: 'name',
    field: 'input',
  }, {
    name: 'age',
    label: 'age',
    field: 'input'
  }]
  return (
    <Form>
      <FieldGroup fields={fields} />
      <FieldGroup>
        {/* 属性配置 */}
        <FormAction
          actionsPosition="bottom"
          actionsRender={[{
            type: 'button',
            props: {
              type: 'primary',
              children: 'submit'
            },
            action: [
              'validateFields',
              {
                type: 'request',
                url: 'https://www.mocky.io/v2/5ed7a8b63200001ad9274ab5',
                method: 'post',
                convertParams: ({ result }) => result
              }
            ]
          }]}
        />
        {/* children */}
        {/*
          <FormAction>
            <Button type='primary'>提交</Button>
          </FormAction>
        */}
      </FieldGroup>
    </Form>
  )
}
```

### FieldGroup 组件
表单控件配置化管理组件
- 类型: `ReactElement`
- 属性

|  属性名  | 说明 | 类型 | 默认值 |
|  ----  | ----  | ---- | - |
| name | 分组值 | `string` | - |
| layout | 表单布局	 | `'horizontal'` \| `'vertical'` \| `'inline'` | - |
| itemLayout | 表单项布局分布 | `{ cols?: number, span?: number, offset?: 'number', gutter?: number, wrapper?: ColProps` \| `undefined, labelCoL?: ColProps` \| `undefined  }` | - |
| initialVisible | 表单控件组初始是否显示 | `boolean` | `true` |
| children | 子组件 | `ReactElement` | - |
| fields | 表单控件配置 | `Array<Field>` | - |
| dependency | 配置表单关联 `参考dependency` | `object` | - |
| container | 容器 `参考container插件` | `RenderPlugin` | - |
| actionsRender | 操作组配置 | `RenderPlugin` \| `RenderPlugin[]` | - |
| actionsPosition | 底部操作位置 | `'center'` \| `'right'` \| `'bottom'` | - |

- 注意
  - `fields` 和 `children` 不能同时生效，设置 `fields` 且不为空，`fields` 生效；否则 `children` 生效；
  - `FieldGroup` 组件外层须包裹Form(sula暴露的Form)

- 示例
```js
import React from 'react';
import { Form, FieldGroup, Field, FormAction } from 'sula';

export default () => {
  const fields = [{
    name: 'name',
    label: 'name',
    field: 'input',
  }, {
    name: 'age',
    label: 'age',
    field: 'input'
  }]
  return (
    <Form>
      {/* fields配置 */}
      <FieldGroup fields={fields} />
      {/* children */}
      <FieldGroup>
        <Field field="input" name="others" label="others" />
      </FieldGroup>
      {/* 底部事件组 */}
      <FieldGroup>
        <FormAction
          actionsRender={[{
            type: 'button',
            props: {
              type: 'primary',
              children: 'submit'
            },
            action: [
              'validateFields',
              {
                type: 'request',
                url: 'https://www.mocky.io/v2/5ed7a8b63200001ad9274ab5',
                method: 'post',
                convertParams: ({ result }) => result
              }
            ]
          }]}
        />
      </FieldGroup>
    </Form>
  )
}
```

### MediaQueries组件
媒体查询组件
- 介绍：示例中的`matches`会根据浏览器窗口变化而变化，实现媒体查询；规则如下

| 浏览器窗口`width` | matches |
|  ----  | ----  |
| width >= 1600 | `'xxl'` |
| 1600 > width >= 1200 | `'xl'` |
| 1200 > width >= 992 | `'lg'` |
| 992 > width >= 768 | `'md'` |
| 768 > width >= 576 | `'sm'` |
| 576 > width | `'xs'` |

- 示例
```js
import { MediaQueries } from 'sula';

export default () => {
  return (
    <MediaQueries>
      {(matches) => <span>{matches}</span>}
    </MediaQueries>
  )
}

```


## Table

### ctx

**参数及适用范围**
- table实例
- dataSource: table数据源
- history: 详情参考 [umi history](https://umijs.org/zh-CN/api#history)
- index: 索引
- record: 当前行数据
- text: 当前行的值
- params: 请求参数
- data: 接口返回数据
- result、results: 链式操作的上一个行为promise返回的结果

|      | table | dataSource | history | index | record | text | params | data | results | result |
| ---- | ---- | ------- | ---- | -------- | ------ | ------- | ------ | ------ | ------- | ------- |
| columns |  ✅  |  -  |  ✅  |  ✅  |  ✅  |  ✅  |  -  | - | - | - |
| remoteDataSource |  ✅  |  -  |  -  | - | - | - |  -  | - | - | - |
| convertParams |  ✅  |  -  |  -  | - | - | - |  ✅  | - | - | - |
| converter |  ✅  |  -  |  -  | - | - | - |  -  | ✅ | - | - |
| actionsRender | ✅ |  ✅  |  ✅  |  -  |  -  |  -  |  -  | - | - | - |
| leftActionsRender | ✅ |  ✅  |  ✅  |  -  |  -  |  -  |  -  | - | - | - |
| action | ✅ |  ✅  |  ✅  |  -  |  -  |  -  |  -  |  -  |  ✅  |  ✅  |

#### columns 示例
表格列的配置
- 注意：除了直接用ctx取值外，还可以通过 `'#{text}'` 来取值
- 示例
```js
const columns = [{
  title: '国家',
  key: 'nat',
  render: [{
    type: 'tag',
    funcProps: {
      color: ctx => {
        if (ctx.text  === 'China') {
          return 'red';
        }
        return 'yellow';
      }
    },
    props: {
      children: '#text',
      color: 
    }
  }]
}]
```

#### remoteDataSource 示例
表格初始值请求
- 示例
```js
const config = {
  remoteDataSource: {
    url: 'https://randomuser.me/api',
    method: 'GET',
    params: {
      id: 1
    },
    convertParams(ctx) {
      return {
        pageSize: ctx.params.pageSize,
        ...ctx.params,
      };
    },

    converter(ctx) {
      // 返回结果
    }
  }
}
```

#### actionsRender 示例
操作组配置
- 说明：actionsRender ctx返回的是 `table实例`、`history`、`dataSource`；actions会进行链式操作，promise执行后会返回`result`、`results`
- 示例
```js
const actionsRender = [{
  type: 'button',
  funcProps: {
    disabled: ctx => {
      if (ctx.table.dataSource.length >= 5) {
        return true;
      }
      return false;
    }
  },
  props: {
    type: 'primary',
    children: '创建',
  },
  action: [
    ctx => {
      // ctx
    },
    // 行为链
  ]
}]
```

### 实例API

#### setDataSource
设置表格数据源
- 类型: `array`
- 参数: 
  - dataSource: 数据数组
- 返回: `-`
- 用法
```js
setDataSource(dataSource);
```

#### getDataSource
获取表格数据源
- 类型: `() => object[]`
- 用法
```js
getDataSource();
```

#### setPagination
设置分页、排序、过滤信息
- 参数类型：`{[key: string]: any}`
- 用法
```js
setPagination({ pageSize: 10, total: 100 })
```

#### setFilters
设置过滤信息
- 参数类型：`{[key: NamePath]: any}`
- 用法
```js
setFilters({ phone: [123456] })
```

#### setSorter
设置排序并刷新表格
- 参数类型：`{[key: NamePath]: any}`
- 参数
  - order: 控制升 `ascend`、降序 `descend`
  - columnKey: 控制升降序字段
- 用法
```js
setSorter({
  order: 'ascend',
  columnKey: 'name'
})
```

#### getSelectedRowKeys
获取当前勾选的表格行的 rowKey 列表
- 参数类型: `() => number[]`
- 用法
```js
getSelectedRowKeys()
```

#### clearRowSelection
清空所有选项
- 用法
```js
clearRowSelection()
```

#### getSelectedRows
可操作列表中，获取选中项的数据列表 
- 类型: `() => object[]`
- 用法
```js
getSelectedRows()
```

#### getPaging
获取表格当前分页、排序、过滤信息
- 参数类型: `() => ({ pagination, filters, sorter })`
- 用法
```js
getPaging()
```

#### refreshTable
刷新表格
- 参数
  - pagination: 分页设置
  - filters：过滤
  - sorter：排序
- 用法
```js
refreshTable()
```

#### resetTable
重置表格
- 参数：`boolean`

- 介绍: 重置表格，参数为`true`时，刷新表格

- 用法
```js
resetTable(true)
```

### columns
表格列的配置描述
- 类型：`ColumnProps[]`
- 参数

|  属性名  | 说明 | 类型 |
|  ----  | ----  | ---- |
| title | 列头显示文字 | `string` |
| key | 列数据在数据项中对应的路径，支持通过数组查询嵌套路径 | `string` |
| filters | 表头的筛选菜单项 | `object[]` |
| filterRender | 过滤插件 | `FilterPlugin` |
| sorter | 排序; 需要服务端排序可设为 true | `function` \| `boolean` |
| render | 操作列配置, 同 `actionsRender` | `function` \| `array` |

- 用法
```js
const columns = [{
  title: '姓名',
  key: 'name',
  filterRender: 'search' // search为sula内置过滤插件
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
表格左上方操作组配置
- 类型：`array`
- 详细
  - rowSelection为空时，leftActionsRender可设置事件操作组（用法同 `actionsRender`）；rowSelection不为空时leftActionsRender配置失效

### actionsRender
操作组配置
同 `actionsRender`

### remoteDataSource
表格初始值请求
- 类型：`{ [key: string]: any }`
- 参数
  - url: 请求地址
  - params: 请求参数
  - method: 请求方式
  - convertParams: 处理请求参数
  - converter: 处理返回数据

- 用法
```js
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
表格初始分页、过滤、排序
- 类型: `{ [key: string]: any }`
- 默认值: `{ pagination: { current: 1, pageSize: 10 } }`
- 参数: 
  - pagination: 分页信息

- 用法
```js
const config = {
  initialPaging: {
    pagination: false, // 无分页情况
  }
}
```

## ModalForm
一般作为行为插件 modalform 和 drawerform 使用

### type
弹窗类型

- 类型: `modal | drawer`
- 默认值: `modal`
- 用法

```js
() => {
  const modalFormRef = React.useRef();
  
  return <div>
      <ModalForm type="drawer" ref={modalFormRef} />
      <button onClick={() => {
        modalFormRef.current.show({
          title: 'Head',
          width: 500,
          fields: [
            {
              type: 'input',
              name: 'input',
              label: 'input',
            }
          ],
          submit: {
            url: '/v1/api',
          },
          // 与 CreateForm 一致
        })
      }}>
        弹窗
      </button>
    </div>
}
```

## CreateForm
- 介绍：CreateForm是在sulaForm基础上封装的模版，支持大多数的表单业务场景
  - 只传submit的时候，默认处理成操作组 `提交、返回`(表单底部)，提交前会处理表单验证
  - 配置actionsRender会覆盖submit；配置同form中的 `actionsRender`
  - 添加非create状态下，赋值前添加loading、赋值后的loading消失

### fields
表单配置, 详情参考sulaForm中的fields配置

### submit
表单提交
- 参数
  - url: 提交地址
  - method：请求方式

### actionsRender
表单底部操作组配置, 详情参考 `actionsRender`

### back
- 默认history.goBack()，也可配置事件

- 用法
```js
const config = {
  back: ctx => {
    console.log(ctx);
  }
}
```

### submitButtonProps
定义提交按钮属性，例如图标

### backButtonProps
定义返回按钮属性，例如图标

**其他属性参考sulaForm**

## QueryTable
- 介绍：QueryTable是基于sulaTable封装的查询表格模版，在sulaTable上层添加了查询表单，由fields来配置

### fields
- 搜索表单配置，详情参考 `fields` 配置

### visibleFieldsCount
设置超过多少个搜索项会出现展示图标
- 类型：`number`
- 默认：5

### itemLayout
查询表单布局
- 默认值: `{ cols: 3 }`
- 介绍：详细参考 `itemLayout`

### fields
查询表单控件配置
- 介绍：详情参考 `fields`

### autoInit
是否初始化表格数据
- 类型：`boolean`
- 默认：`true`

### actionsRender
查询表格事件操作组
- 介绍：详情参考 `actionsRender`

### leftActionsRender
查询表单左上方事件操作组
- 介绍：详情参考 `leftActionsRender`

### remoteDataSource
查询表格初始值请求
- 介绍：详情参考 `表格初始值请求`

### formProps
查询表单属性
- 类型：`Omit<FormProps, FormPropsPicks>`
- 默认值：`{}`
- 介绍：详细参考 `form`

### tableProps
查询表格属性
- 类型：`Omit<TableProps, TablePropsPicks>`
- 默认值：`{}`
- 介绍：详情参考 `table`

**QueryTable中不透传属性如下, 其他的属性都可以通过tableProps、formProps传入**

```js
type FormPropsPicks = 'fields' | 'initialValues' | 'layout' | 'itemLayout';
type TablePropsPicks =
  | 'remoteDataSource'
  | 'actionsRender'
  | 'leftActionsRender'
  | 'rowKey'
  | 'columns'
  | 'rowSelection';
```

## StepForm
- 介绍：StepForm是基于sulaForm封装的步骤表单模版

### direction
横、纵向布局
- 类型：`horizontal | vertical`
- 详细：控制步骤表单横向、竖向展示
- 默认：`vertical`

### steps
步骤表单配置
- 类型：`StepProps[]`
- 属性：
  - title：主标题
  - subTitle：副标题
  - fields：配置参考 `fields`
  - description：描述

- 用法
```js
const config = {
  steps: [
    {
      title: 'Step1',
      subTitle: '基础信息',
      description: '所有项都是必填项',
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
- 默认：不出现成功页
- 详细：result是配置提交后是否出现成功页面

- 用法
```js
// 设置成功页
const config = {
  result: true
}

// 设置成功页面提示文本
const config = {
  result: {
    title: '成功'，
    subTitle: '成功详情'
  }
}
```

### stepsStyle
步骤表单的步骤条样式
- 类型：`React.CSSProperties`

### formStyle
步骤表单的表单样式
- 类型：`React.CSSProperties`

### submit
详情参考CreateForm的submit

### back
详情参考CreateForm的back

**其他属性参考sulaForm**

## StepQueryTable
- 介绍：StepQueryTable是基于QueryTable模版封装的步骤表格

### autoRefresh
切换步骤时是否自动刷新表格
- 类型：`boolean`
- 默认：`true`

### stepsStyle
步骤表格的步骤条样式
- 类型：`React.CSSProperties`

### queryTableStyle
步骤表格的表格样式
- 类型：`React.CSSProperties`

### steps
步骤表格的配置
- 参数
  - title: 标题
  - subTitle：子标题
  - description：描述
  - fields: 搜索表单配置，详情参考sulaForm中fields配置 `覆盖外层的fields`
  - columns: 详情参考sulaTable的columns配置 `覆盖外层的columns`

- 用法
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
