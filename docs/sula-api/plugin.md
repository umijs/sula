---
title: 内置插件列表
order: 1
---

# 插件

## 介绍
- 注意：插件使用前需先注册，注册流程如下

1、安装 umi-plugin-sula
```js
// 推荐cnpm
npm i -S umi-plugin-sula
```

2、在 .umirc.ts 中启用 umi-plugin-sula 插件
- 注意：umi-plugin-sula 完成了sula插件的注册（否则要开发者手动注册），以及 history、语言类型的设置。

![avatar](https://img.alicdn.com/tfs/TB1BLMaIbY1gK0jSZTEXXXDQVXa-3650-856.png)

3、注册项目中所需的icon

```js
// global.ts
import { Icon } from 'sula';
import { DeleteOutlined, AppstoreOutlined } from '@ant-design/icons';

// 注册所需的icon
Icon.iconRegister({
  delete: DeleteOutlined,
  appstore: {
    outlined: AppstoreOutlined,
  },
});
```

## 自定义插件
如果以下插件满足不了你的需求，可根据需求自定义插件
- 说明：插件是全局作用的，所以建议在全局注册；为了好展示，示例暂且在组件中注册

### 自定义field插件
`registerFieldPlugin` 是field插件注册的内部方法
- 参数

|  属性名  | 说明 | 类型 |
|  ----  | ----  | ---- |
|  pluginName  | 插件名  | `string` |
|  Component  | 组件  | `React.ComponentClass` \| `React.FunctionComponent` |
|  hasSource  | 是否有数据源  | `boolean` |
|  hasCtx  | 是否配置ctx  | `boolean` |

- 调用形式
```js
registerFieldPlugin(pluginName)(Component, hasSource, hasCtx);
```

- 示例
```js
import React from 'react'
import { Input } from 'antd';
import { 
  registerFieldPlugin,
  CreateForm,
} from 'sula';

// 注册自定义field插件 => testinput
registerFieldPlugin('testinput')(Input);

export default () => {
  const config = {
    fields: [{
      name: 'name',
      label: '姓名',
      field: 'testinput' // 使用注册插件
    }],
    submit: {
      url: 'https://www.mocky.io/v2/5ed7a8b63200001ad9274ab5',
      method: 'POST',
    },
  }
  return (
    <CreateForm {...config} />
  )
}
```

### 自定义render插件
`registerRenderPlugin` 是render插件注册的内部方法
- 属性

|  属性名  | 说明 | 类型 | 默认值 |
|  ----  | ----  | ---- | - |
|  pluginName  | 插件名  | `string` | - |
|  Component  | 组件  | `React.ComponentClass` \| `React.FunctionComponent` | `div` |
|  extraPropsName  | 筛选config的值  | `string[]` | - |
|  needCtxAndConfig  | 是否有ctx和config  | `boolean` | - |

- 调用形式
```js
registerRenderPlugin(pluginName, extraPropsName)(Component, needCtxAndConfig);
```

- 示例
```js
import React from 'react'
import { Button } from 'antd';
import { 
  registerRenderPlugin,
  CreateForm,
} from 'sula';

// 注册自定义render插件 => testButton
registerRenderPlugin('testButton')(Button);

export default () => {
  const config = {
    fields: [{
      name: 'name',
      label: '姓名',
      field: 'input'
    }],
    actionsRender: [{
      type: 'testButton', // 使用插件
      props: {
        type: 'primary',
        children: '提交'
      },
      action: [
        'validateFields',
        {
          url: 'https://www.mocky.io/v2/5ed7a8b63200001ad9274ab5',
          method: 'post',
          params: ctx => {
            return ctx.result;
          }
        }
      ]
    }]
  }
  return (
    <CreateForm {...config} />
  )
}
```

### 自定义action插件
`registerActionPlugin` 是action插件注册的内部方法
- 属性

|  属性名  | 说明 | 类型 |
|  ----  | ----  | ---- |
|  pluginName  | 插件名  | `string` |
|  actionPlugin  | 行为插件  | `ActionImpl` |

- 调用形式
```js
registerActionPlugin(pluginName, actionPlugin)
```

- 示例
```js
import React from 'react'
import { 
  registerActionPlugin,
  CreateForm,
} from 'sula';

// 注册自定义action插件 => console
registerActionPlugin('console', (ctx) => {
  console.log(ctx, 'config');
})

export default () => {
  const config = {
    fields: [{
      name: 'name',
      label: '姓名',
      field: 'input'
    }],
    actionsRender: [{
      type: 'button',
      props: {
        type: 'primary',
        children: '提交'
      },
      action: [
        'validateFields',
        {
          url: 'https://www.mocky.io/v2/5ed7a8b63200001ad9274ab5',
          method: 'post',
          params: ctx => {
            return ctx.result;
          }
        },
        'console' // 使用插件
      ]
    }]
  }
  return (
    <CreateForm {...config} />
  )
}
```

## field 插件
field插件用于表单项的配置中
- 对象配置属性如下

|  属性名  | 说明 | 类型 |
|  ----  | ----  | ---- |
|  type  |  插件类型（sula内置插件） | `string` \| `(ctx, config) => ReactElement` |
|  props  |  属性 应用于组件上的属性设置 | `object` |
|  funcProps | 处理属性 | `Record<string, (ctx: FormCtx) => string>` |

- 说明：field支持`对象` `字符串` `函数`配置；字符串配置表示插件类型

```js
// 字符串
{
  field: 'input',
}
// 对象配置
{
  field: {
    type: 'input', // 插件类型
    funcProps: {
      disabled: ctx => {
        if (ctx.mode === 'view') {
          return true
        };
        return false;
      }
    },
    props: {
      placeholder: 'please input',
    }
  }
}
// 函数配置
{
  // ctx包涵disabled、form实例、mode、以及source
  field: (ctx) => {
    return <Input disabled={ctx.mode === 'view'}/>
  }
}
```

### input
表单控件单行文本输入框
- 示例
```js
field: {
  type: 'input',
  props: {
    placeholder: 'please input'
  }
}
```
输入框 Input 对应 props 内，更多配置参考[antd Input](https://ant.design/components/input-cn/#API)

### select
表单控件下拉框
- 示例

1、数据源默认值
```js
{
  name: 'select',
  label: 'select',
  field: {
    type: 'select',
    props: {
      placeholder: 'please select'
    }
  },
  initialSource: [{
    value: 'apple',
    text: '苹果'
  }, {
    value: 'banana',
    text: '香蕉'
  }],
}
```
2、数据源默认值选项分组
```js
{
  name: 'select',
  label: 'Select',
  initialSource: [{
    value: 'apple',
    text: '苹果',
    children: [{
      value: 'Jonagold',
      text: '红龙苹果'
    }]
  }, {
    value: 'banana',
    text: '香蕉'
  }],
  field: {
    type: 'select',
    props: {
      placeholder: 'please select'
    }
  }
}
```
3、远程数据源
```js
{
  name: 'select',
  label: 'select',
  field: {
    type: 'select',
    props: {
      placeholder: 'please select'
    }
  },
  remoteSource: {
    url: 'http://rap2.taobao.org:38080/app/mock/256557/field/select',
    method: 'get'
  },
}
```
选择器 select 对应 props 内，更多配置参考[antd Select](https://ant.design/components/select-cn/)


### textarea
表单控件多行文本输入框
- 示例
```js
field: {
  type: 'textarea',
  props: {
    placeholder: 'please input'
  }
}
```
多行文本框 Textarea 对应 props 内，更多配置参考[antd Textarea](https://ant.design/components/input-cn/)

### inputnumber
表单控件的数字输入框
- 示例
```js
field: {
  type: 'inputnumber',
  props: {
    placeholder: 'please input',
    max: 100,
    min: 10
  }
}
```
- 说明: 表单中的inputnumber校验通过 `max | min` 控制即可

数字输入框 InputNumber 对应props 内，更多配置参考[antd InputNumber](https://ant.design/components/input-number-cn/)

### rate
表单控件的评分功能
- 示例
```js
field: {
  type: 'rate',
  props: {
    allowHalf: true,
  }
}
```
评分 Rate 对应props内，更多配置参考[antd Rate](https://ant.design/components/rate-cn/)

### switch
表单控件开关选择器
- 示例
```js
{
  field: {
    type: 'switch',
    props: {
      checkedChildren: '开启',
      unCheckedChildren: '关闭'
    }
  },
  valuePropName: 'checked'
}
```
- 说明：valuePropName 是子节点的值的属性，如 Switch 的是 `'checked'`

开关选择器 Switch 对应 props 内，更多配置参考[antd Switch](https://ant.design/components/switch-cn/)

### checkbox
表单控件多选框
- 示例
```js
{
  field: {
    type: 'checkbox',
    props: {
      children: '苹果'
    }
  },
  valuePropName: 'checked',
}
```
- 说明：valuePropName 是子节点的值的属性，如 checkbox 的是 `'checked'`

多选框 Checkbox 对应 props 内，更多配置参考[antd Checkbox](https://ant.design/components/checkbox-cn/)


### checkboxgroup
表单控件多选框组
- 示例
```js
{
  field: 'checkboxgroup',
  initialSource: [{
    value: 'apple',
    text: '苹果',
  }, {
    value: 'banana',
    text: '香蕉'
  }],
  // remoteSource: { // 支持remoteSource
  //   url: 'http://rap2.taobao.org:38080/app/mock/256557/field/select',
  //   method: 'get'
  // },
}
```

多选框组 Checkbox.Group 对应 props 内，更多配置参考[antd Checkbox.Group](https://ant.design/components/checkbox-cn/)

### radio
表单控件单选框
- 示例
```js
{
  field: {
    type: 'radio',
    props: {
      children: '橘子'
    }
  },
  valuePropName: 'checked'
}
```
- 说明：valuePropName 是子节点的值的属性，如 radio 的是 `'checked'`

单选框 Radio 对应 props 内，更多配置参考[antd Radio](https://ant.design/components/radio-cn/)

### radiogroup
表单控件单选框组
- 示例
```js
{
  field: 'radiogroup',
  initialSource: [{
    value: 'apple',
    text: '苹果',
  }, {
    value: 'banana',
    text: '香蕉'
  }],
  // remoteSource: { // 支持remoteSource
  //   url: 'http://rap2.taobao.org:38080/app/mock/256557/field/select',
  //   method: 'get'
  // },
}
```

单选框组 Radio.Group 对应 props 内，更多配置参考[antd Radio.Group](https://ant.design/components/radio-cn/)

### slider
表单控件滑动输入条
- 示例
```js
field: {
  type: 'slider',
  props: {
    tooltipVisible: true
  }
}
```
滑动输入条 Slider 对应props 内，更多配置参考[antd Slider](https://ant.design/components/slider-cn/)

### cascader
表单控件级联选择框
- source类型
```js
interface CascaderSource {
  text: any;
  value: any;
  children: CascaderSourceItem[];
}
```
- 示例
```js
{
  field: 'cascader',
  initialSource: [{
    value: 'hangzhou',
    text: '杭州',
    children: [{
      value: 'xihu',
      text: '西湖'
    }]
  }, {
    value: 'nanjing',
    text: '南京'
  }],
  // remoteSource: { // 支持remoteSource
  //   url: 'http://rap2.taobao.org:38080/app/mock/256557/field/selectTree',
  //   method: 'get'
  //   converter: ({ data }) => {
  //     return data;
  //   }
  // },
}
```
级联选择框 Cascader 对应props 内，更多配置参考[antd Cascader](https://ant.design/components/cascader-cn/)

### datepicker
表单控件日期选择框
- 示例
```js
field: {
  type: 'datepicker',
  props: {
    valueFormat: 'utc'
  }
}
```
- 属性
- valueFormat：返回日期格式
  - 默认值：`-`
  - 存在以下几种情况
    - `"utc"`：返回毫秒时间戳格式, 例如：`1593508518351`
    - `true`：返回格式同 `format`, 例如：`"2020-06-23 17:19:46"`
    - `默认不设置`：返回moment格式
- format: 设置日期格式, valueFormat为 `true` 时生效
  - 默认值：`"YYYY-MM-DD"`

日期选择框 Datepicker 对应 props 内，更多配置参考[antd Datepicker](https://ant.design/components/date-picker-cn/)

### rangepicker
表单控件日期范围选择框
- 示例
```js
field: {
  type: 'rangepicker',
  props: {
    valueFormat: 'utc'
  }
}
```
- 属性
- valueFormat：返回日期格式
  - 默认值：`-`
  - 存在以下几种情况
    - `"utc"`：返回毫秒时间戳格式, 例如：`[1593508518351, 1595927718351]`
    - `true`：返回格式同 `format`, 例如：`["2020-06-23 17:19:46", "2020-07-28 17:19:46"]`
    - `默认不设置`：返回moment格式
- format: 设置日期格式, valueFormat为 `true` 时生效
  - 默认值：`"YYYY-MM-DD HH:mm:ss"`

日期范围选择框 DatePicker.RangePicker 对应 props 内，更多配置参考[antd DatePicker.RangePicker](https://ant.design/components/date-picker-cn/)

### timepicker
表单控件时间选择框
- 示例
```js
field: {
  type: 'timepicker',
}
```
- 属性
- valueFormat：返回时间格式
  - 默认值：`-`
  - 存在以下几种情况
    - `"utc"`：返回毫秒时间戳格式, 例如：`1591175526204`
    - `true`：返回格式同 `format`, 例如：`"17:05:05"`
    - `默认不设置`：返回moment格式
- format: 设置日期格式, valueFormat为 `true` 时生效
  - 默认值：`"HH:mm:ss"`
    
时间选择框 TimePicker 对应 props 内，更多配置参考[TimePicker](https://ant.design/components/time-picker-cn/)

### upload
表单控件上传
- 示例
```js
{
  valuePropName: 'fileList',
  field: {
    type: 'upload',
    props: {
      request: {
        url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        params: {
          name: 'sula',
        },
        converter: (ctx) => {
          // 可以访问ctx
          return ctx.data;
        },
      },
      multiple: true,
      children: <Button>Click to upload</Button>,
    },
  },
}
```


## render 插件
渲染插件
- 属性：

|  属性名  | 说明 | 类型 | 默认值 |
|  ----  | ----  | ---- | - |
|  type  | 类型  | `string` \| `RenderPluginFunction` | - |
|  props  | 属性  | `Record<string, any>` | - |
|  confirm  | 确认框的描述  | `string` \| `(ctx: RenderCtx) => string` | - |
|  tooltip  | 文字提示  | `string` \| `(ctx: RenderCtx) => string` | - |
|  disabled  | 禁用点击  | `boolean` \| `(ctx: RenderCtx) => boolean` | `false` |
|  funcProps  | 属性处理 | `Record<string, (ctx: RenderCtx) => string>` | - |
|  action  | 事件组配置  | `ActionPlugin` \| `ActionPlugin[]` | - |

```js
render: {
  type: 'icon',
  tooltip: '删除该项',
  confirm: '确定要删除 #{record.index} 吗？',
  disabled: ctx => {
    if (ctx.record.nat === 'China') {
      return true;
    }
    return false;
  },
  props: {
    type: 'delete'
  },
  action: [
    () => {
      // 删除操作
    },
    'refreshTable' // action 插件
  ]
}
```

### text
文本渲染插件
- 示例
```js
render: {
  type: 'text',
  props: {
    children: 'text',
    type: 'danger'
  }
}
```
组件使用
```js
import React from 'react';
import { Text } from 'sula';

export default () => {
  return <Text type="danger">文本</Text>
}
```
- 属性

|  属性名  | 说明 | 类型 | 默认值 |
|  ----  | ----  | ---- | - |
|  type  | 文本类型  | `secondary` \| `warning` \| `danger` | - |
|  ellipsis  | 设置自动溢出省略，需要设置元素宽度  | `boolean` | `false` |
|  disabled  | 禁用文本  | `boolean` | `false` |
|  delete  | 添加删除线样式	  | `boolean` | `false` |

文本 Text 对应 props 内，更多配置参考[antd Typography.Text](https://ant.design/components/typography-cn/#Typography.Text)

### button
按钮渲染插件
- 说明
  - 导入Icon支持 `string`、`object`
  - action有返回Promise时 `(request)`按钮会自动loading；Promise执行结束后loading消失
- 示例
```js
render: {
  type: 'button',
  props: {
    children: '按钮',
    type: 'primary',
    icon: 'appstore',
    // icon: {
    //   type: 'appstore', // appstore为注册过的icon
    //   style: {
    //     color: '#fff'
    //   }
    // }
  }
}

// 按钮自动loading
render: [{
  type: 'button',
  props: {
    children: '提交',
    type: 'primary'
  },
  action: [{
    url: 'https://www.mocky.io/v2/5ed7a8b63200001ad9274ab5',
    method: 'post'
  }, {
    type: 'button',
    props: {
      children: 'loading 3秒'
    },
    action: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('3 秒后出现')
        }, 3000)
      })
    }
  }]
}]
```

组件使用
```js
import React from 'react';
import { Button } from 'sula';

export default () => {
  return <Button icon="appstore" type="primary">按钮</Button>
}
```

按钮 Button 对应 props 内，更多配置参考[antd Button](https://ant.design/components/button-cn/)

### icon
图标渲染插件
- action有返回Promise时 `(request)`按钮会自动loading；Promise执行结束后loading消失
- 示例
```js
render: {
  type: 'icon',
  props: {
    type: 'appstore', // appstore为注册过的icon
    text: '其他' // icon右侧文本
  },
  action: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('3 秒后出现')
      }, 3000)
    })
  }
}
```
组件使用
```js
import React from 'react';
import { Icon } from 'sula';

export default () => {
  // appstore为注册过的icon
  return <Icon type="appstore">
}
```
- 说明：icon在项目中不管以组件或者插件的形式使用都要提前注册

icon的注册
```js
import { Icon } from 'sula';
import { DeleteOutlined, AppstoreOutlined } from '@ant-design/icons';

Icon.iconRegister({
  appstore: {
    outlined: AppstoreOutlined
  }
  delete: DeleteOutlined,
});
```
图标 Icon对应 props 内，更多配置参考[antd Icon](https://ant.design/components/icon-cn/)

### tag
标签渲染插件
- 示例
```js
render: {
  type: 'tag',
  props: {
    children: '标签文本',
    color: 'red',
  }
}
```

标签 tag 对应 props 内，更多配置参考[antd Tag](https://ant.design/components/tag-cn/)

### badge
徽章渲染插件
```js
render: {
  type: 'badge',
  props: {
    text: '徽章',
    status: 'success'
  }
}
```

徽章 badge 对应 props 内，更多配置参考[antd badge](https://ant.design/components/badge-cn/)

### inputgroup
输入框组插件
- 属性
  - childrenContainer：是包裹field的容器 `card | div` 或 输入框组`inputGroup`
  - children: 输入框组内的表单项
- 示例
```js
{
  label: '输入框组',
  childrenContainer: {
    type: 'inputgroup',
    props: {
      compact: true, // 是否用紧凑模式
      size: 'small', // 输入框组中所有input的大小
    },
  },
  children: [
    {
      name: 'country',
      noStyle: true,
      field: {
        type: 'input',
        props: {
          style: { width: '50%' },
        },
      },
    },
    {
      name: 'province',
      noStyle: true,
      field: {
        type: 'input',
        props: {
          style: { width: '50%' },
        },
      },
    },
  ],
},
```

### link
跳转插件
- 示例
```js
render: {
  type: 'link',
  props: {
    children: '跳转到'
  },
}
```
- 说明：link插件是button插件的link类型

### rowSelection
表格选中行显示渲染插件
- 示例
```js
// leftActionsRender: 表格的左上方操作组
leftActionsRender: ['rowSelection']

// actionsRender: 表格右上方操作组
actionsRender: ['rowSelection']
```
- 说明：QueryTableProps模版的leftActionsRender默认添加了 `rowSelection` 插件

### progress
进度条渲染插件
- 示例
```js
render: {
  type: 'progress',
  props: {
    status: 'exception',
  }
}
```

进度条 progress 对应 props 内，更多配置参考[antd Progress](https://ant.design/components/progress-cn/)

### 容器插件

#### div
div容器
- 示例
```js
container: {
  type: 'div',
  props: {
    style: {
      minWidth: '1000px'
    }
  }
}
```

#### card
卡片容器
- 示例
```js
container: {
  type: 'card',
  props: {
    title: '卡片',
    style: {
      minWidth: '1000px'
    }
  }
}
```
卡片 card 对应 props 内，更多配置参考[antd Card](https://ant.design/components/card-cn/)

## form action 插件

### validateFields
表单验证行为插件
- 示例
```js
actionsRender: [{
  type: 'button',
  props: {
    type: 'primary',
    children: '提交',
  },
  action: [
    'validateFields',
    {
      type: 'request',
      url: 'http://www.testMock.json',
      method: 'POST'
    }
  ]
}]
```
- 说明：可配合actionsRender使用，用于提交前校验表单，CreateForm模版内置了该插件

### validateGroupFields
表单组验证行为插件
- 示例
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

actionsRender: [{
  type: 'button',
  props: {
    children: '表单组验证'
  },
  action: [{
    type: 'validateGroupFields',
    args: ['groups']
  }]
}]
```
- 说明: 步骤表单 `StepForm` 校验且下一步中内置了该插件

### validateQueryFields
搜索列表行为插件
- 示例
```js
acion: [{
  type: 'validateQueryFields',
  resultPropName: '$queryFieldsValue' // 搜索表单的值
}]
```
- 说明：查询表格中的 `QueryFields` 组件内置了该插件

### resetFields
重置表单行为插件

```js
actionsRender: [{
  type: 'button',
  props: {
    children: '重置表单'
  },
  action: 'resetFields'
}]
```
- 说明：查询表格中的 `QueryFields` 组件内置了该插件

## table action 插件

### refreshTable
刷新表格行为插件
- 示例
```js
action: 'refreshTable'
```

### resetTable
重置表格行为插件
```js
action: [{
  type: 'resetTable',
  args: [false]
}]
```
- 说明: 参数为 `false` 只重置表格但不刷新；参数为 `true` 重置并刷新表格

### modalform
弹框表单表格插件

- 属性:
  - 介绍：modalform插件配置对象中的属性会全部传到ModalForm组件中

|  属性名  | 说明 | 类型 | 默认值 |
|  ----  | ----  | ---- | - |
|  mode  | 表单模式  | `'create'` \| `'view'` \| `'edit'` | `'create'` |
|  title  |  标题 | `string` | - |
|  fields  | 表单控件配置  | `FieldProps[]` | - |
|  submit  | 提交表单配置  | `RequestConfig` | - |
|  actionsRender  | 操作组配置  | `RenderPlugin` \| `RenderPlugin[]` | - |
|  container  | 容器配置  | `object` | - |
|  width  | 弹框宽度  | `number` | - |

```js
action: [{
  type: 'modalform',
  title: '创建',
  container: {
    type: 'card',
    props: {
      title: '卡片'
    }
  },
  width: 1200,
  fields: [{
    name: 'name',
    label: '姓名',
    field: 'input'
  }, {
    name: 'age',
    label: '年龄',
    field: 'input'
  }],
  submit: {
    url: 'https://www.mocky.io/v2/5ed7a8b63200001ad9274ab5',
    method: 'post'
  }
}]
```
- 说明：用于表格的新建、编辑、查看等弹出模式

### drawerform
抽屉表单表格插件
- 属性

|  属性名  | 说明 | 类型 | 默认值 |
|  ----  | ----  | ---- | - |
|  mode  | 表单模式  | `'create'` \| `'view'` \| `'edit'` | `'create'` |
|  title  |  标题 | `string` | - |
|  fields  | 表单控件配置  | `FieldProps[]` | - |
|  submit  | 提交表单配置  | `RequestConfig` | - |
|  actionsRender  | 操作组配置  | `RenderPlugin` \| `RenderPlugin[]` | - |
|  container  | 容器配置  | `object` | - |
|  width  | 抽屉宽度  | `number` | `550` |

- 示例
```js
action: [{
  type: 'drawerform',
  title: '创建',
  fields: [{
    name: 'name',
    label: '姓名',
    field: 'input'
  }, {
    name: 'age',
    label: '年龄',
    field: 'input'
  }],
  submit: {
    url: 'https://www.mocky.io/v2/5ed7a8b63200001ad9274ab5',
    method: 'post'
  }
}]
```
- 说明：用于表格的新建、编辑、查看等抽屉模式

### filterRender
过滤插件
- 说明：表格column级别的插件

#### search
过滤搜索插件
- 示例
```js
filterRender: 'search'
```
- 说明：弹出输入框形式过滤搜索表格某项

## 其他action插件

### request
请求插件
- 属性

|  属性名  | 说明 | 类型 | 默认值 |
|  ----  | ----  | ---- | - |
|  url  | 接口地址  | `string` | - |
|  method  | 请求方式  | `GET` \| `POST` | `GET` |
|  params  | 参数  | `object` | - |
|  convertParams  |  请求参数转换 | `ConvertParamsPlugin` \| `ConvertParamsPlugin[]` | - |
|  converter  | 返回数据转换  | `ConverterPlugin` \| `ConverterPlugin[]` | - |
|  successMessage  | 自定义成功message  | `string` | - |

- 示例
```js
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
]
```
- 说明：request 插件的type可省略

### back
跳转返回插件
```js
action: 'back'
```

### forward
路由前进插件
```js
action: 'forward'
```

### route
路由跳转插件
```js
action: {
  type: 'route',
  path: '/form',
  query: {
    id: 1
  }
}
```
