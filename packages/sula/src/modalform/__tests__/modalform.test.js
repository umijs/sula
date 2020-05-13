import React from 'react';
import { mount } from 'enzyme';
import ModalForm from '..';
import '../../__tests__/common';

describe('modalform', () => {
  it('close', () => {
    let modalRef;
    const wrapper = mount(
      <div>
        <ModalForm
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
    expect(wrapper.find('Modal').props().visible).toEqual(true);

    wrapper.find('.ant-modal-close').simulate('click');
    expect(wrapper.find('Modal').props().visible).toEqual(false);
  });

  it('costom close', async () => {
    let modalRef;
    const wrapper = mount(
      <div>
        <ModalForm
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

    const { modal } = wrapper.find('ModalForm').props();
    modal.close('@@sula_action_stop');
    wrapper.update();

    expect(wrapper.find('Modal').props().visible).toEqual(false);
  });
});
