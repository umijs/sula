import React from 'react';
import { Button } from 'antd';
import Modal from '..';
import { remoteSource, remoteValues, submit } from '../../form/demos/common.jsx';
import ModeSwitcher from '../../form/demos/modeSwitcher.tsx';

export default function () {
  const [mode, setMode] = React.useState('create');
  const modalRef = React.useRef(null);
  const drawerRef = React.useRef(null);
  return (
    <div>
      <Button
        onClick={() => {
          modalRef.current.show({
            mode,
            title: '弹窗表单',
            remoteValues,
            submit,
            fields: [
              {
                name: 'input',
                label: 'Input',
                field: 'input',
              },
              {
                name: 'select',
                label: 'Select',
                field: 'select',
                remoteSource,
              },
            ],
          });
        }}
      >
        弹出Modal
      </Button>
      <Modal ref={modalRef} />
      <br />
      <br />
      <Button
        onClick={() => {
          drawerRef.current.show({
            title: '弹窗表单',
            mode,
            remoteValues,
            submit,
            fields: [
              {
                name: 'input',
                label: 'Input',
                field: 'input',
              },
              {
                name: 'select',
                label: 'Select',
                field: 'select',
                remoteSource,
              },
            ],
          });
        }}
      >
        弹出Drawer
      </Button>
      <Modal type="drawer" ref={drawerRef} />
      <ModeSwitcher mode={mode} onChange={(mode) => setMode(mode)} />{' '}
    </div>
  );
}
