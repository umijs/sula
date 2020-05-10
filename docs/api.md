---
title: API
order: 100
---

<Alert>🚧 WIP</Alert>

## Form

### 实例 API

```js
interface FormInstance extends AntdFormInstance {
  validateFields: (nameList?: FieldNamePath[] | true) => Promise<any>;
  validateGroupFields: (groupName: string) => Promise<any>;
  setFieldValue: (name: FieldNamePath, value: any) => void;
  setFieldSource: (name: FieldNamePath, source: any) => void;
  setFieldVisible: (name: FieldNamePath, visible: boolean) => void;
  setFieldDisabled: (name: FieldNamePath, disabled: boolean) => void;
  getFieldSource: (name: FieldNamePath) => any;
  getFieldDisabled: (name: FieldNamePath) => any;
}
```

### itemLayout

Field布局

```js
const config = {
  itemLayout: {
    cols: 3,
    // span: 8, // 两者等价
    // cols: {md: 1, lg: 2, xl: 3 }, // 响应式
    wrapperCol: {span: 16},
    labelCol: {span: 8}, // 只有 horizontal 需要配置
  }
}
```

表单组件

### container

容器插件

```js
const config = {
  container : {
    type: 'card',
    props: {
      title: 'Head',
    }
  }
}
```

### fields

```js
// 1. 组件
const fields = [{
  field: 'input
}];

// 2. 容器
const fields = [{
  container: {type: 'card', props: {title: 'Head' }},
  fields: [{
    // ……
  }]
}]

// 3. Field嵌套Field
// 参考场景：https://ant.design/components/form-cn/#components-form-demo-complex-form-control
const fields = [{
  label: 'world',
  childrenContainer: {
    type: 'inputgroup',
    props: {
      compact: true,
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
}]
```

### actionsRender

表单操作插件

```js
const actionsRender = [{
  type: 'button',
  props: {
    children: 'submit',
  }
}]
```

### actionsPosition

`''` | `'center'` | `'bottom'` | `'right'`

### actionsStyle

表单操作插件容器样式

### remoteValues

向服务器请求表单值

```js
const config = {
  remoteValues: {
    url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
  }
}
```

## Table

### 实例 API

```js
interface TableInstance {
  setDataSource: (dataSource: DataSource) => void;
  getDataSource: () => DataSource;

  setPagination: (pagination: PaginationConfig) => void;
  setFilters: (filters: Filters) => void;
  setSorter: (sorter: Sorter) => void;

  getSelectedRowKeys: () => string[];
  clearRowSelection: () => void;

  getSelectedRows: () => DataSource;

  getPaging: () => Paging;

  refreshTable: (
    pagination?: PaginationConfig,
    filters?: Filters,
    sorter?: Sorter,
  ) => Promise<undefined>;
  resetTable: (isRefresh?: boolean) => void | Promise<undefined>;
}
```

### columns

```js
const config = {
  columns: [{
    title: '操作',
    key: 'op',
    render: [{
      type: 'button',
      tooltip: '删除',
      confirm: '确定要删除吗？',
      props: {
        type: 'danger',
        children: '删除',
      },
      action: [
        () => {},
        () => {},
      ]
    }, ({text, record}) => {
      return <Button type={record.status}>{text}</Button>;
    }]
  }]
}
```

### actionsRender

同 Form#actionsRender 配置方式

### leftActionsRender

同上

### remoteDataSource

请求dataSource配置

### initialPaging

```js
// 不分页
const config = {
  initialPaging: false,
  // initialPaging: {pagingation: false},
}

// 分页、过滤、排序
const config = {
  initialPaging: {
    filters: {
      name: ['sula']
    },
    sorter: {
      columnKey: 'age',
      order: 'descend',
    }
  }
}
```

### initialDataSource

初始 dataSource


## CreateForm

### submit

请求配置

### back

默认是 history.goBack()

## QueryTable

### visibleFieldsCount

默认是5，超过5个出现展开图标

### autoInit

默认是 true，初始进行 dataSource 请求


## StepForm

### direction

`'horizontal'` | `'vertical'`

### steps

```js
const config = {
  steps: [{
    title: '标题',
    subTitle: '子标题',
    description: '描述',
    // 参考 Form
    fields: [{
      name: 'step1-1',
      label: 'Step1-1',
      field: 'input'
    }]
  }, {
    // step2 配置
  }]
}
```

### result

如果配置则最后出现成功页面

```js
const config = {
  result: {
    successMessage: '成功',
    successDescription: '付款成功'
  }
}
```

### submit

同CreateForm#submit

### back

同CreateForm#back

## StepQueryTable

同 QueryTable，优先级低于 Steps 中的 QueryTable配置，进行浅合并

```js
const config = {
  fields: [],
  colums: [],
  steps: [{
    title: 'Step1',
    fields: [],
    colums: [],
  }]
}
```

### autoRefresh

默认是 true，进入不同步骤自动刷新表格

### steps

```js
const config = {
    steps: [{
      title: '标题',
      subTitle: '子标题',
      description: '描述',
      // 同 QueryTable，优先级高于最外层
      // fields
      // columns
    }]
}


