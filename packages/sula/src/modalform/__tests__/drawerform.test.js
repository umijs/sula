import React from 'react';
import { mount } from 'enzyme';
import DrawerForm from '..';
import { delay } from '../../__tests__/common';

describe('modalform', () => {
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

  it('costom close', async () => {
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
              submit: {
                url: '/success.json',
                method: 'post',
                convertParams: ({ params }) => {
                  expect(params).toEqual({ test: '111' });
                  return params;
                },
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
    wrapper.update();
    wrapper
      .find('input')
      .last()
      .simulate('change', { target: { value: '111' } });

    wrapper.update();

    const { modal } = wrapper.find('DrawerForm').props();
    modal.close('@@sula_action_stop');
    wrapper.update();

    expect(wrapper.find('Drawer').props().visible).toEqual(false);
  });
});
