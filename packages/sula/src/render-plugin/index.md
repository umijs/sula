---
title: 渲染插件
---

## 组件

```jsx
import React from 'react';
import { Card, Text, Icon, Button } from './';
import { IconPlugin } from './icon'
import { ButtonPlugin }  from './button';

export default () => {
  const [text, setText] = React.useState('文字');
  const btnRef = React.useRef(null);
  const iconRef = React.useRef(null);

  return (
    <div>
      <Card title="Head">Body</Card>
      <Text type="danger">hello</Text>
      <Icon type="tablet" theme="filled" />
      <Icon type="appstore" />
      <Icon type="appstore" onClick={() => {}} />
      <Icon type="appstore" disabled onClick={() => {}} />
      <Icon
        type="tablet"
        theme="filled"
        text={text}
        onClick={() => {
          setText(text ? undefined : '文字');
          console.log('点击');
        }}
      />
      <Button ref={btnRef} onClick={() => {
        btnRef.current.showLoading();
        setTimeout(() => {
          btnRef.current.hideLoading();
        }, 2000)
      }}>转2秒</Button><br />

      <IconPlugin
        text="转起来"
        config={{
          action: [
            ctx => {
              ctx.icon.showLoading();
              setTimeout(() => {
                ctx.icon.hideLoading();
              }, 2000);
            },
            () => {
              console.log('next action');
            },
            () => {
              console.log('finally action');
            },
          ]
        }}
        autoLoading={false}
        type="appstore"
      />
    </div>
  );
};
```

## 插件

```jsx
import React from 'react';
import sula from '../core';

export default () => {
  return (
    <div>
      {sula.render(
        'text',
        {},
        {
          props: {
            type: 'danger',
            children: 'danger',
          },
        },
      )}
      {
        sula.render(
        'icon',
        {},
        {
          props: {
            type: 'appstore',
          },
        },
      )
      }
      {
        sula.render(
        'tag',
        {},
        {
          props: {
            children: 'hello',
          },
        },
      )
      }
      {
        sula.render(
          'progress',
          {},
          {
            props: {
              percent: 30,
            },
          },
        )
      }
    </div>
  );
};
```

<code title="button" src="./demos/button.tsx" />
