import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import DrawerForm from '..';
import { delay } from '../../__tests__/common';

describe('drawerform', () => {
  it('close', async () => {
    let modalRef;
    const wrapper = mount(
      <div>
        <DrawerForm
          type="drawer"
          ref={(ref) => {
            modalRef = ref;
          }}
        />
        <button
          type="button"
          onClick={() => {
            modalRef.show({
              title: 'Title',
              mode: 'edit',
              submit: {
                url: '/success.json',
                method: 'post',
              },
              remoteValues: {
                url: '/values.json',
                method: 'post',
              },
              fields: [
                {
                  name: 'test',
                  label: 'test',
                  field: 'input',
                },
              ],
            });
          }}
        >
          click
        </button>
      </div>,
    );

    wrapper.find('button').simulate('click');
    expect(wrapper.find('Drawer').props().visible).toEqual(true);

    await delay(1000);

    wrapper.find('.ant-drawer-close').simulate('click');
    expect(wrapper.find('Drawer').props().visible).toEqual(false);
  });

  it('internal close', () => {
    let modalRef;
    const wrapper = mount(
      <div>
        <DrawerForm
          isDrawer
          type="drawer"
          ref={(ref) => {
            modalRef = ref;
          }}
        />
        <button
          type="button"
          onClick={() => {
            modalRef.show({
              title: 'Title',
              mode: 'create',
              fields: [
                {
                  name: 'name',
                  label: '姓名',
                  field: 'input',
                },
              ],
              submit: {
                url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
                method: 'POST',
              },
            });
          }}
        >
          click
        </button>
      </div>,
    );
    wrapper.find('button').simulate('click');
    wrapper.update();

    const { onClose } = wrapper.find('Drawer').props();
    expect(wrapper.find('Drawer').props().visible).toEqual(true);
    act(() => {
      onClose();
    });
    wrapper.update();
    expect(wrapper.find('Drawer').props().visible).toEqual(false);
  });

  it('customize close', async () => {
    let modalRef;
    const wrapper = mount(
      <div>
        <DrawerForm
          isDrawer
          type="drawer"
          ref={(ref) => {
            modalRef = ref;
          }}
        />
        <button
          type="button"
          onClick={() => {
            modalRef.show({
              title: 'Title',
              mode: 'create',
              fields: [
                {
                  name: 'name',
                  label: '姓名',
                  field: 'input',
                },
              ],
              actionsRender: [
                {
                  type: 'button',
                  props: {
                    children: '返回',
                    className: 'backs',
                  },
                  action: (ctx) => {
                    ctx.modal.modalCancel();
                  },
                },
              ],
            });
          }}
        >
          click
        </button>
      </div>,
    );
    wrapper.find('button').simulate('click');
    wrapper.update();
    expect(wrapper.find('Drawer').props().visible).toEqual(true);
    wrapper.find('.backs').first().simulate('click');

    await delay(1000);
    expect(wrapper.find('Drawer').props().visible).toEqual(false);
  });

  it('submit', async () => {
    let modalRef;
    const wrapper = mount(
      <div>
        <DrawerForm
          isDrawer
          type="drawer"
          ref={(ref) => {
            modalRef = ref;
          }}
        />
        <button
          type="button"
          onClick={() => {
            modalRef.show({
              title: 'Title',
              mode: 'create',
              fields: [
                {
                  name: 'name',
                  label: 'label',
                  field: 'input',
                },
              ],
              actionsRender: [
                {
                  type: 'button',
                  props: {
                    children: 'submit',
                    className: 'submits',
                  },
                  action: [
                    (ctx) => {
                      ctx.modal.modalOk(ctx);
                    },
                    jest.fn()
                  ],
                },
              ],
            });
          }}
        >
          click
        </button>
      </div>,
    );

    wrapper.find('button').simulate('click');
    wrapper.update();
    expect(wrapper.find('Drawer').props().visible).toEqual(true);

    wrapper.find('.submits').first().simulate('click');

    await delay(1000);
    wrapper.update();
    expect(wrapper.find('Drawer').props().visible).toEqual(false);
  });

});

it('modalCancel plugin', async() => {
  let modalRef;
  const wrapper = mount(
    <div>
      <DrawerForm
        isDrawer
        type="drawer"
        ref={(ref) => {
          modalRef = ref;
        }}
      />
      <button
        type="button"
        onClick={() => {
          modalRef.show({
            title: 'Title',
            mode: 'create',
            fields: [
              {
                name: 'name',
                label: 'label',
                field: 'input',
              },
            ],
            actionsRender: [
              {
                type: 'button',
                props: {
                  children: 'back',
                  className: 'backs',
                },
                action: 'modalCancel',
              },
            ],
          });
        }}
      >
        click
      </button>
    </div>,
  );

  wrapper.find('button').simulate('click');
  wrapper.update();
  expect(wrapper.find('Drawer').props().visible).toEqual(true);
  wrapper.find('.backs').first().simulate('click');

  await delay(1000);
  wrapper.update();
  expect(wrapper.find('Drawer').props().visible).toEqual(false);
  
})

it('modalOk plugin', async() => {
  let modalRef;
  const wrapper = mount(
    <div>
      <DrawerForm
        isDrawer
        type="drawer"
        ref={(ref) => {
          modalRef = ref;
        }}
      />
      <button
        type="button"
        onClick={() => {
          modalRef.show({
            title: 'Title',
            mode: 'create',
            fields: [
              {
                name: 'name',
                label: 'label',
                field: 'input',
              },
            ],
            actionsRender: [
              {
                type: 'button',
                props: {
                  children: 'back',
                  className: 'backs',
                },
                action: 'modalOk',
              },
            ],
          });
        }}
      >
        click
      </button>
    </div>,
  );

  wrapper.find('button').simulate('click');
  wrapper.update();
  expect(wrapper.find('Drawer').props().visible).toEqual(true);
  wrapper.find('.backs').first().simulate('click');

  await delay(1000);
  wrapper.update();
  expect(wrapper.find('Drawer').props().visible).toEqual(false);
  
})
