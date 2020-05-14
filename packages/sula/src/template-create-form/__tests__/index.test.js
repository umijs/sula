import React from 'react';
import { mount } from 'enzyme';
import { CreateForm } from '../';
import { delay } from '../../__tests__/common';

const fields = Array(10)
  .fill(0)
  .map((_, index) => {
    return {
      name: `input${index}`,
      label: `Input${index}`,
      field: 'input',
    };
  });

const submit = {
  url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
  method: 'GET',
  params: {
    name: 'sula',
  },
  finish: (ctx) => {
    return ctx.result;
  },
};

describe('createForm', () => {
  const finalSubmit = {
    ...submit, 
    convertParams: ctx => {
      const { params } = ctx;
      return { ...params, endName: 'testName' }
    }
  }

  it('view mode', () => {
    const wrapper = mount(
      <CreateForm
        mode="view"
        fields={fields}
        itemLayout={{ cols: { xl: 3, lg: 1 } }}
        submit={finalSubmit}
      />
    );
    wrapper.find('button').forEach(node => {
      if (node === 'Submit') {
        node.simulate('click');
      }
    })
    wrapper.update();
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('create mode', async() => {
    const wrapper = mount(
      <CreateForm
        fields={fields}
        mode="view"
        itemLayout={{ cols: 3 }}
        submit={submit}
        remoteValues={{
          url: '/values.json',
          method: 'post',
        }}
      />
    );
    wrapper.setProps({ mode: 'edit' });
    wrapper.update();

    await delay(1000);
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.unmount();
  })

  it('submit is function', () => {
    const wrapper = mount(
      <CreateForm
        fields={fields}
        mode="edit"
        submit={jest.fn()}
      />
    )
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.unmount();
  })

  it('has actionsRender', () => {
    const fn = jest.fn();
    const wrapper = mount(
      <CreateForm
        fields={fields}
        actionsRender={[
          {
            type: 'button',
            props: {
              className: 'action-test-btn',
              children: 'btn',
            },
            action: fn,
          },
        ]}
        submit={jest.fn()}
      />
    )
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.unmount();
  })
})