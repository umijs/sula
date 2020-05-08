---
title: rope
---

## Rope
```jsx
import React from 'react';
import Rope from './';

const sula = {
  trigger: (ctx, conf) => {
    return sula.action(conf.type, ctx, conf);
  },
  action: (type, ctx, conf) => {
    if (typeof type === 'function') {
      return type();
    }
    return Math.random();
  },
};

const rope = new Rope(sula);

const proxyFn = rope
  .use({ type: 'action1', before: () => true })
  .use({ type: 'action2' })
  .use({ type: 'action3' })
  .use({
    type: () => {
      return Promise.reject({ error: true });
    },
  })
  .use({ type: 'action5' })
  .proxy();

export default () => {
  return (
    <div
      onClick={() => {
        proxyFn(1, {});
      }}
    >
      hello
    </div>
  );
};
```

## resultPropName

```jsx
import React from 'react';
import Rope from './';

const sula = {
  trigger: (ctx, conf) => {
    return sula.action(conf.type, ctx, conf);
  },
  action: (type, ctx, conf) => {
    if (typeof type === 'function') {
      return type();
    }
    return type;
  },
};

const rope = new Rope(sula);

const proxyFn = rope
  .use({ type: 'action1', before: () => true })
  .use({ type: 'action2', resultPropName: 'action2' })
  .use({ type: 'action3' })
  .proxy();

export default () => {
  return (
    <div
      onClick={() => {
        proxyFn(1, {});
      }}
    >
      hello
    </div>
  );
};
```

## RopeContainer

```jsx
import React from 'react';
import { Button, Tooltip } from 'antd';
import RopeContainer from './RopeContainer';
import ModalForm from '../modalform'

export default () => {
  const modalRef = React.useRef(null);
  return (
    <div>
      <RopeContainer
        // confirm="确定吗"
        tooltip="提示下"
        trigger={() => {
          modalRef.current.show({
            title: '弹窗',
            fields: [{
              name: 'input1',
              label: 'Input1',
              field: 'input',
            }],
            submit: {
              url: '/api/xx',
            }
          })
        }}
      >
        <Button>确定吗</Button>
      </RopeContainer>
      <RopeContainer
        confirm="确定要弹吗"
        tooltip="弹它"
        disabled
        trigger={() => {
          alert('UKK');
        }}
      >
        <Button>弹2</Button>
      </RopeContainer>
      <ModalForm ref={modalRef} />
    </div>
  );
};
```

## triggerRenderPlugin

```jsx
import React from 'react';
import sula from '../core';
import { triggerRenderPlugin } from './triggerPlugin';

export default () => {
  return (
    <div>
      {triggerRenderPlugin({}, [
        {
          type: 'text',
          props: {
            children: 'warning',
            type: 'warning',
          },
          action: () => {
            alert(123);
          },
        },
        {
          type: 'text',
          props: {
            children: 'danger',
            type: 'danger',
          },
          action: () => {
            alert(456);
          },
        },
      ])}
    </div>
  );
};
```

## trigger

```jsx
import React from 'react';
import { triggerPlugin, triggerRenderPlugin } from './triggerPlugin';

export default () => {
  const text = triggerPlugin(
    'render',
    {},
    {
      type: 'text',
      props: {
        children: 'text',
        onClick: () => {
          console.log('change');
        },
      },
    },
    {
      skipFuncObjKeys: ['props'],
    },
  );

  const render = triggerRenderPlugin({ disabled: true }, [
    {
      type: 'text',
      props: {
        children: 'hello',
      },
      action: (ctx) => {
        console.log('abc', ctx);
      },
    },
  ]);

  const render2 = triggerRenderPlugin({}, [
    {
      type: 'text',
      props: {
        children: 'hello',
        className: 't1',
      },
      action: () => {
        console.log('action1');
      },
    },
    {
      type: 'text',
      props: {
        children: 'world',
        className: 't2',
      },
      action: () => {
        console.log('action2');
      },
    },
  ]);

  return (
    <div>
      <div>{text}</div>
      <div>{render}</div>
      <div>{render2}</div>
    </div>
  );
};
```

## triggerPlugin
```jsx
import React from 'react';
import { triggerPlugin } from './triggerPlugin';

export default () => {
  //  渲染组件
  const nodeModuleOthers = triggerPlugin(
    'render',
    {
      test: 'test'
    },
    {
      type: 'input',
      props: {
        placeholder: 'please input @{test}',
        onChange: () => {
          console.log('input值变化了我才出来！！');
        }
      }
    },
    {
      skipFuncObjKeys: ['props'],
    },
    true
  )
  // config参数为函数的情况
  const configFn = triggerPlugin('', { ctxParams: 'go' }, ctx => {
    // 如下执行
    return { name: 'test2', ctx };
  });
  console.log(configFn, 'configFn');

  return (
    <div>{nodeModuleOthers}</div>
  )
}

```

## triggerRenderPlugin
```jsx
import React from 'react';
import { triggerRenderPlugin } from './triggerPlugin';

export default () => {
  const nodeModules = triggerRenderPlugin(
    {
      testRender: 'test',
    },
    [{
      type: 'text',
      props: {
        children: 'text',
        type: 'danger',
      },
      action: () => {
        console.log('不给你还报错了  是吗？？？？')
      }
    }, {
      type: 'text',
      props: {
        children: 'testRender',
        type: 'warning'
      },
      action: () => {
        console.log('待会在收拾你');
      }
    }]
  )

  return (
    <div>{ nodeModules }</div>
  )
}

```

## triggerSingleRenderPlugin

```jsx
import React from 'react';
import { triggerSingleRenderPlugin } from './triggerPlugin';

export default () => {
  return (
    <div>
      {triggerSingleRenderPlugin(
        {},
        {
          type: 'text',
          props: {
            children: '点击',
            type: 'default',
          },
          action: () => {
            console.log('sfasdfa');
          },
        },
      )}
    </div>
  );
};
```

## triggerFieldPlugin
```jsx
import React from 'react';
import { triggerFieldPlugin } from './triggerPlugin';

export default () => {
  const fieldPluginRender = triggerFieldPlugin(
    {},
    {
      type: 'input',
      props: {
        placeholder: 'please input',
      },
      action: () => {
        console.log('就是你导致我出不来！！！');
      }
    }
  )

  return (
    <div>{ fieldPluginRender }</div>
  )
}

```

## triggerActionPlugin
```jsx
import React from 'react';
import { Button } from 'antd';
import { triggerActionPlugin } from './triggerPlugin';

export default () => {
  const handleClick = () => {
    triggerActionPlugin(
      {},
      {
        type: () => {
          console.log('触发我')
        }
      }
    );
  }

  return (
    <Button onClick={handleClick}>按钮</Button>
  )
}



```


