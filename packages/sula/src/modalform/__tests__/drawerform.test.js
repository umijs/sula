import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Table } from '../../table';
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

  it('customize close', async () => {
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
              mode: 'create',
              fields: [
                {
                  name: 'name',
                  label: 'name',
                  field: 'input',
                },
              ],
              actionsRender: [
                {
                  type: 'button',
                  props: {
                    children: 'back',
                    className: 'backBtn',
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
    wrapper.find('.backBtn').first().simulate('click');

    await delay(1000);
    expect(wrapper.find('Drawer').props().visible).toEqual(false);
  });

  it('submit', async () => {
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
              mode: 'create',
              fields: [
                {
                  name: 'name',
                  label: 'name',
                  field: 'input',
                },
              ],
              actionsRender: [
                {
                  type: 'button',
                  props: {
                    children: 'submit',
                    className: 'submitBtn',
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

    wrapper.find('.submitBtn').first().simulate('click');

    await delay(1000);
    wrapper.update();
    expect(wrapper.find('Drawer').props().visible).toEqual(false);
  });

  it('modalCancel plugin', async () => {
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
              mode: 'create',
              fields: [
                {
                  name: 'name',
                  label: 'name',
                  field: 'input',
                },
              ],
              actionsRender: [
                {
                  type: 'button',
                  props: {
                    children: 'back',
                    className: 'backBtn',
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
    wrapper.find('.backBtn').first().simulate('click');

    await delay(1000);
    wrapper.update();
    expect(wrapper.find('Drawer').props().visible).toEqual(false);
  });

  it('modalOk plugin', (done) => {
    const wrapper = mount(
      <Table
        columns={[{ key: 'id', title: 'id' }]}
        actionsRender={{
          type: 'button',
          props: {
            children: 'button',
          },
          action: [
            {
              type: 'drawerform',
              resultPropName: 'res',
              title: 'title',
              fields: [
                {
                  name: 'input',
                  label: 'input',
                  field: 'input',
                },
              ],
              initialValues: {
                input: 123,
              },
              actionsRender: [
                {
                  type: 'button',
                  props: {
                    children: 'submit',
                    className: 'submitBtn',
                  },
                  action: [
                    (ctx) => Promise.resolve({ ...ctx.form.getFieldsValue(), success: true }),
                    'modalOk',
                  ],
                },
              ],
            },
            (ctx) => {
              expect(ctx.result).toEqual({ $submit: { input: 123, success: true } });
              expect(ctx.results).toEqual({
                res: {
                  $submit: {
                    input: 123,
                    success: true,
                  },
                },
              });
              done();
            },
          ],
        }}
      />,
    );

    wrapper.find('button').first().simulate('click');
    wrapper.update();
    wrapper.find('.submitBtn').first().simulate('click');
  });
});
