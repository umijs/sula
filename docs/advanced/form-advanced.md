---
title: Form 进阶
order: 1
---

## 动态渲染表单

<code src="../form-advanced/dynamic-form.jsx" />

## 使用组件（非配置）

<code src="../form-advanced/use-component.jsx" />

## collect 值收集

<code src="../form-advanced/value-collect.jsx" />


## field.children

<code src="../form-advanced/field-children.jsx" />

## 远程搜索


```js
// 全局注册
import React from 'react';
import { registerFieldPlugin, request } from './packages/sula/src/index';
import { Select } from 'antd';

const RemoteSearch = (props) => {
  const { source = [], ctx, value, onChange, placeholder } = props;
  const handleSearch = (q) => {
    if(!q) {
      return;
    }
    request({
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      params: {
        q,
      },
    }).then(() => {
      ctx.form.setFieldSource(ctx.name, Array(10).fill(0).map((_, index) => {
        return {
          text: `商品_${q}_${index}`,
          value: `价格_${q}_${index}`,
        }
      }));
    });
  };

  return (
    <Select
      showSearch
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      notFoundContent={null}
      value={value}
      onChange={onChange}
      onSearch={handleSearch}
    >
      {source.map((item) => {
        return (
          <Select.Option key={item.value} value={item.value}>
            {item.text}
          </Select.Option>
        );
      })}
    </Select>
  );
};

// 注入 source 和 ctx
registerFieldPlugin('customremotesearch')(RemoteSearch, true, true);
```

<code src="../form-advanced/remote-search.jsx" />


## dependency

表单关联

### visible关联

```jsx
/**
 * title: 简单的显隐关联
 * desc: |
 *   场景：类型不为空，为 `水果` 的表单项显示，否则隐藏
 */
import React from 'react';
import { CreateForm } from 'sula';

export default () => {
  const config = {
    fields: [
      {
        name: 'type',
        label: '类型',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入'
          }
        }
      },
      {
        name: 'vegetable',
        label: '类型输入土豆',
        field: 'input',
        dependency: {
          visible: {
            relates: ['type'],
            inputs: [['土豆']],
            output: false,
            defaultOutput: true,
          }
        }
      },
      {
        name: 'fruilt',
        label: '水果',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入'
          }
        },
        initialVisible: false,
        dependency: {
          visible: {
            relates: ['type'],
            inputs: ['*'],        // *表示所有情况都满足
            ignores: [['']],      // ignores为兼容并清空
            output: true,
            defaultOutput: false,
          }
        }
      }
    ],
    submit: {
      url: 'https://www.mocky.io/v2/5ed7a8b63200001ad9274ab5',
      method: 'post'
    }
  };
  return <CreateForm { ...config } />
}
```

```jsx
/**
 * title: 表单单项关联多项
 * desc: |
 *  场景：类型输入 `绿色`，为 `水果` 和 `蔬菜`表单项均显示，否则均隐藏
 */
import React from 'react';
import { Form } from 'sula';

export default () => {
  const config = {
    fields: [
      {
        name: 'type',
        label: '类型',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入 "绿色"'
          }
        }
      },
      {
        name: 'fruilt',
        label: '水果',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入'
          }
        },
        initialVisible: false,
        dependency: {
          visible: {
            relates: ['type'],
            inputs: [['绿色']],
            output: true,
            defaultOutput: false,
          }
        }
      },
      {
        name: 'vegetables',
        label: '蔬菜',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入'
          }
        },
        initialVisible: false,
        dependency: {
          visible: {
            relates: ['type'],
            inputs: [['绿色']],
            output: true,
            defaultOutput: false,
          }
        }
      }
    ]
  };
  return <Form { ...config } />
}
```

```jsx
/**
 * title: 表单多项关联一项
 * desc: |
 *  场景：类型输入不为空，口感输入 `酸甜`, 为 `水果` 表单项显示，否则隐藏
 */
import React from 'react';
import { Form } from 'sula';

export default () => {
  const config = {
    fields: [
      {
        name: 'type',
        label: '类型',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入'
          }
        }
      },
      {
        name: 'taste',
        label: '口感',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入 "酸甜"'
          }
        },
      },
      {
        name: 'fruilt',
        label: '水果',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入'
          }
        },
        initialVisible: false,
        dependency: {
          visible: {
            relates: ['type', 'taste'],
            inputs: ['*', ['酸甜']],
            ignores: [['']],
            output: true,
            defaultOutput: false,
          }
        }
      }
    ]
  };
  return <Form { ...config } />
}
```

```jsx
/**
 * title: 组关联
 * desc: |
 *  场景：类型输入 `蔬菜`，为 `groups`的组显示，否则隐藏
 */
import React from 'react';
import { Form } from 'sula';

export default () => {
  const config = {
    fields: [
      {
        name: 'type',
        label: '类型',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入 "蔬菜"'
          }
        }
      },
      {
        name: 'groups',
        container: {
          type: 'card',
          props: {
            title: '卡片'
          }
        },
        initialVisible: false,
        dependency: {
          visible: {
            relates: ['type'],
            inputs: [['蔬菜']],
            output: true,
            defaultOutput: false,
          }
        },
        fields: [
          {
            name: 'cabbage',
            label: '大白菜',
            field: {
              type: 'input',
              props: {
                placeholder: '请输入'
              }
            }
          }
        ]
      }
    ]
  };
  return <Form { ...config } />
}
```

### 数据源关联
```jsx
/**
 * title: 数据源基础关联
 * desc: |
 *  场景：类型输入 `水果`，为 `水果` 表单项数据源不为空，否则为空
 */
import React from 'react';
import { Form } from 'sula';

export default () => {
  const selectSource = [
    {
      name: 'apple',
      text: '苹果'
    },
    {
      name: 'banana',
      text: '香蕉'
    }
  ];

  const config = {
    fields: [
      {
        name: 'type',
        label: '类型',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入 "水果"'
          }
        }
      },
      {
        name: 'fruilt',
        label: '水果',
        field: {
          type: 'select',
          props: {
            placeholder: '请输入'
          }
        },
        dependency: {
          source: {
            relates: ['type'],
            inputs: [['水果']],
            output: selectSource,
            defaultOutput: [],
          }
        }
      },
    ]
  };
  return <Form { ...config } />
}
```

```jsx
/**
 * title: 多场景数据源关联
 * desc: |
 *  场景：类型输入 `水果`，为 `水果` 的表单项数据源类型为水果；类型输入 `蔬菜`, 为 `蔬菜` 的表单项数据源类型为蔬菜
 */
import React from 'react';
import { Form } from 'sula';

export default () => {
  const fruiltSource = [
    {
      name: 'apple',
      text: '苹果'
    },
    {
      name: 'banana',
      text: '香蕉'
    }
  ];

  const vegetableSource = [
    {
      name: 'eggplant',
      text: '茄子'
    },
    {
      name: 'cabbage',
      text: '大白菜'
    }
  ]

  const config = {
    fields: [
      {
        name: 'type',
        label: '类型',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入 "水果" 或 "蔬菜"'
          }
        }
      },
      {
        name: 'fruilt',
        label: '水果',
        field: {
          type: 'select',
          props: {
            placeholder: '请输入'
          }
        },
        dependency: {
          source: {
            relates: ['type'],
            cases: [{               // cases在更多的匹配场景使用
              inputs: [['水果']],
              output: fruiltSource
            }, {
              inputs: [['蔬菜']],
              output: vegetableSource
            }],
            defaultOutput: [],
          }
        }
      },
    ]
  };
  return <Form { ...config } />
}
```

```jsx
/**
 * title: 远程数据源关联
 * desc: |
 *  场景：类型输入 `水果`，`水果` 表单项数据源不为空，否则为空`（可查看接口请求参数）`
 */
import React from 'react';
import { Form } from 'sula';

export default () => {
  const config = {
    fields: [
      {
        name: 'type',
        label: '类型',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入 "水果"'
          }
        }
      },
      {
        name: 'fruilt',
        label: '水果',
        field: {
          type: 'select',
          props: {
            placeholder: '请输入'
          }
        },
        remoteSource: {
          init: false,
          url: 'https://run.mocky.io/v3/a435a830-a2b3-49ce-bc6b-40298ba57bcb',
          method: 'GET',
          converter: ({data}) => {
            return data.map(item => {
              return {
                text: item.text,
                value: item.value
              }
            })
          }
        },
        dependency: {
          source: {
            relates: ['type'],
            defaultOutput: [],
          }
        }
      },
    ],
  };
  return <Form { ...config } />
}
```

### value关联
```jsx
/**
 * title: value关联
 * desc: |
 *  场景：姓名输入 `林俊杰` 或 `周杰伦`，`职业` 表单项的值为`歌手`，否则为空
 */
import React from 'react';
import { Form } from 'sula';

export default () => {
  const config = {
    fields: [
      {
        name: 'name',
        label: '姓名',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入 "林俊杰"或"周杰伦"'
          }
        }
      },
      {
        name: 'profession',
        label: '职业',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入'
          }
        },
        dependency: {
          value: {
            relates: ['name'],
            inputs: [['林俊杰', '周杰伦']],
            output: '歌手',
            defaultOutput: undefined,
          }
        }
      },
    ]
  };
  return <Form { ...config } />
}
```

### disabled关联

```jsx
/**
 * title: disabled关联
 * desc: |
 *  场景：热搜输入 `街头`，`内容` 表单项不可编辑`歌手`，否则可编辑
 */
import React from 'react';
import { Form } from 'sula';

export default () => {
  const config = {
    fields: [
      {
        name: 'hot',
        label: '热搜',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入 "街头"'
          }
        }
      },
      {
        name: 'context',
        label: '内容',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入'
          }
        },
        dependency: {
          disabled: {
            relates: ['hot'],
            inputs: [['街头']],
            output: true,
            defaultOutput: false,
          }
        }
      },
    ]
  };
  return <Form { ...config } />
}
```

### 自定义关联
```jsx
/**
 * title: 自定义关联
 * desc: |
 *  场景：类型输入 `健康`，颜色输入`绿色`，`水果` 表单项显示，否则隐藏
 */
import React from 'react';
import { Form } from 'sula';

export default () => {
  const config = {
    fields: [
      {
        name: 'type',
        label: '类型',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入 "健康"',
          }
        }
      }, {
        name: 'color',
        label: '颜色',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入 "绿色"'
          }
        }
      }, {
        name: 'fruit',
        label: '水果',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入'
          }
        },
        initialVisible: false,
        dependency: {
          visible: {
            relates: ['type', 'color'],
            defaultOutput: false,
            type: ctx => {
              const { values = [], form: { setFieldVisible }, name } = ctx;
              if (values[0] === '健康' && values[1] === '绿色') {
                setFieldVisible(name, true)
              } else {
                setFieldVisible(name, false)
              }
            }
          }
        }
      }
    ]
  };
  return <Form { ...config } />
}
```
