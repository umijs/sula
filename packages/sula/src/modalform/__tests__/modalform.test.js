import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Table } from '../../table';
import ModalForm from '..';
import { delay } from '../../__tests__/common';

describe('modalform', () => {
  it('close', async () => {
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
    expect(wrapper.find('Modal').props().visible).toEqual(true);
    await delay(1000);
    wrapper.find('.ant-modal-close').simulate('click');
    expect(wrapper.find('Modal').props().visible).toEqual(false);
  });

  it('costom close', () => {
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
    act(() => {
      modal.close('@@sula_action_stop');
    });
    wrapper.update();

    expect(wrapper.find('Modal').props().visible).toEqual(false);
  });

  it('modalform action plugin', (done) => {
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
              type: 'modalform',
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
              submit: () => {
                return Promise.resolve({ id: 1 });
              },
            },
            (ctx) => {
              expect(ctx.result).toEqual({ $submit: { id: 1 }, $fieldsValue: { input: 123 } });
              done();
            },
          ],
        }}
      />,
    );

    wrapper.find('button').first().simulate('click');
    wrapper.update();
    wrapper.find('button').forEach((node) => {
      if (node.text() === 'Submit') {
        node.simulate('click');
      }
    });
  });
});
