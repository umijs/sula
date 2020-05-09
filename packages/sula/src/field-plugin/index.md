---
title: 表单插件
---

## 组件

```jsx
import React from 'react';
import { Select, CheckboxGroup, Cascader, RadioGroup, Upload, TimePicker, DatePicker, RangePicker } from './';
import { Button } from '../render-plugin';

const source = [
  {
    text: '苹果',
    value: 'apple',
  },
  {
    text: '桃子',
    value: 'peach',
  },
];

const cascaderoptions = [
  {
    value: 'zhejiang',
    text: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        text: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            text: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    text: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        text: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            text: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]

export default () => {
  return (
    <div>
      <Select
        style={{ width: 200 }}
        source={[
          {
            text: '水果',
            children: source,
          },
          {
            text: '蔬菜',
            children: [
              {
                text: '西红柿',
                value: 'tomato',
              },
            ],
          },
        ]}
      />{' '}
      <CheckboxGroup source={source} />{' '}
      <Cascader source={cascaderoptions} placeholder="Please select" />{' '}
      <RadioGroup source={source} />{' '}
      <Upload onChange={e => { console.log('e', e) }}>
        <Button>上传</Button>
      </Upload>
      <RangePicker />{' '}
      <DatePicker />{' '}
      <TimePicker onChange={(finalTime, timeString) => { console.log(finalTime, timeString, 'timpicker time') }} />
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
      {sula.field(
        'select',
        {
          mode: 'view',
          source: [
            {
              text: '苹果',
              value: 'apple',
            },
            {
              text: '桃子',
              value: 'peach',
            },
          ],
        },
        {
          props: {
            style: {
              width: 200,
            },
          },
        },
      )}
      {
        sula.field(
          'timepicker',
          {},
        )
      }
    </div>
  );
};
```
