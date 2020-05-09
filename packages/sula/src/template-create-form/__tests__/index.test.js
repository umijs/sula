import React from 'react';
import { mount } from 'enzyme';
import CreateForm from '../';
import '../../__tests__/common';

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
    console.log('ctx: ', ctx);
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
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('create mode', () => {
    const wrapper = mount(
      <CreateForm
        fields={fields}
        itemLayout={{ cols: 3 }}
        submit={submit}
      />
    );
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.unmount();
  })

  it('submit is function', () => {
    const wrapper = mount(
      <CreateForm
        fields={fields}
        mode="edit"
        submit={() => {
          console.log('submit field');
        }}
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
        submit={() => {
          console.log('submit field');
        }}
      />
    )
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.unmount();
  })
})