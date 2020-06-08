---
group: 
  title: 进阶指南
  order: 2
title: 什么是插件
order: 0
---

## 什么是插件

先看看有哪些常见场景使用了插件

## 常规插件

### 渲染插件

即展现的UI组件，按钮、输入框、图标等。

#### 表单插件

```js
const config = {
  fields: [
    {
      field: { // field就是插件扩展点，field对应的值就是插件配置
        type: 'input',
      }
    }
  ]
}
```

#### 表格列

```js
const config = {
  columns: [
    {
      render: {
        type: 'tag',
        props: {
          children: 'draft',
        }
      }
    }
  ]
}
```

#### 操作类

例如表单的操作按钮（提交、重置等），表格的操作按钮（批量删除、创建人物等），以及表格中操作列（超链接、图标等）。

```js
const config = {
  actionsRender: [{
    type: 'button',
    props: {
      children: '提交'
    },
    action: [{ // 操作类当然会有关联的触发行为
      type: 'validateFields',
    }, 'back']
  }]
}
```



### 行为插件

可以理解为用户交互所产生的行为逻辑，例如发出服务端请求、路由跳转等，一般和渲染插件绑定使用，或者由组件生命周期触发，例如表单查看模式下初始化阶段会向后端发请求获取表单值。

```js
const config = {
  actionsRender: [{
    type: 'button',
    props: {
      children: '路由跳转'
    },
    action: [ // 行为插件
      {
        type: 'route',
        path: '/template/create',
      }
    ]
  }]
}
```

### 其他

请求参数转换、返回数据转换。

```js
const config = {
  remoteDataSource: {
    url: '/api/datasource',
    method: 'POST',
    convertParams: 'normConvertParams', // 也可以写成插件
    converter: 'normConvertResponse',
  }
}
```


## 简写类插件

### 提交、返回

在 CreateForm、StepForm、ModalForm都有使用，例如提交

```js
const config = {
  submit: {
    url: '/api/submit.json',
    method: 'post',
  }
}
```

简写可以理解为多个插件的组合，方便用户更快捷的进行配置，那么submit是由哪些插件组合而成呢？

```js
// 如果我们想自定义提交按钮
const config = {
  actionsRender: [{
    type: 'button',
    props: {
      children: '提交',
      type: 'primary',
    },
    action: [
      'validateFields',
      {
        type: 'request',
        url: '/api/submit.json',
        method: 'post',
        params: '#{result}', // 代表上个行为的结果，即收集的表单值
      },
      'back',
    ]
  }]
}
```

可以看到 `submit` 是 渲染插件 `button` 和 三个行为插件 `validateFields`、`request`、`back` 组成的。

## 走进插件

在 sula 里插件的概念其实非常简单，它有两种形式 `插件`，`内联插件`。

以 `input` 渲染插件为例，看下这两种形式是如何实现的。

### input 插件

插件其实是对可服用逻辑封装后的定义，目的是通过简单的字符串配置就可以实现其背后的一段服用逻辑。

```js
sula.fieldType('input', (ctx, config) => {
  const {
    mode,
  } = ctx;

  return <Input disabled={mode === 'view'} {...config.props} />;
})

const config = {
  fields: [{
    field: 'input',
  }]
}
```



### input 内联插件

实际项目开发，我们更多的是使用内联写法。

```js
const config = {
  fields: [{
    field: (ctx) => {
      const {
        mode,
      } = ctx;

      return <Input disabled={mode === 'view'} placeholder="i am input" />;
    },
  }]
}
```

我们再以 `request` 请求行为插件为例，看下这两种形式是如何实现的。

### request 插件

```js
sula.actionType('request', (ctx, config) => {
  const {
    url,
    params,
  } = config;
  return axios.get(url, {
    params
  });
});

const config = {
  columns: [{
    render: {
      type: 'tag',
      props: {
        children: '拷贝',
      },
      action: [{
        type: 'request',
        url: '/api/copy.json',
        params: {
          id: 'sula101',
        }
      }, 'refreshTable']
    }
  }]
}
```

### request 内联插件

```js
import axios from 'axios';

const config = {
  columns: [{
    render: {
      type: 'tag',
      props: {
        children: '拷贝',
      },
      action: [() => {
        return axios.get('/api/copy.json', {
          params: {
            id: 'sula101',
          }
        })
      }, (ctx) => {
        ctx.refreshTable();
      }]
    }
  }]
}
```


