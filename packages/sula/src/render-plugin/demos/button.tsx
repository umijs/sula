import React from 'react';
import { Button } from '../index';
import { triggerRenderPlugin } from '../../rope/triggerPlugin';

export default () => {
  const btnRef = React.useRef(null);
  return (
    <div>
      <Button
        onClick={() => {
          btnRef.current.showLoading();
        }}
      >
        转
      </Button>
      <Button
        onClick={() => {
          btnRef.current.hideLoading();
        }}
      >
        不转
      </Button>
      <Button icon="appstore" ref={btnRef}>
        Hello
      </Button>
      <br />
      {triggerRenderPlugin({}, [
        {
          type: 'link',
          props: {
            children: '成功转2秒',
          },
          action: () => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, 2000);
            });
          },
        },
        {
          type: 'button',
          props: {
            type: 'primary',
            children: '成功转2秒',
          },
          action: () => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, 2000);
            });
          },
        },
        {
          type: 'button',
          props: {
            type: 'danger',
            children: '失败转2秒',
          },
          action: () => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                reject();
              }, 2000);
            });
          },
        },
        {
          type: 'button',
          autoLoading: false,
          tooltip: 'autoLoading=false',
          props: {
            children: '自己控制转',
          },
          action: [
            (ctx) => {
              ctx.button.showLoading();
            },
            (ctx) => {
              setTimeout(() => {
                ctx.button.hideLoading();
              }, 2000);
            },
          ],
        },
      ])}
    </div>
  );
};
