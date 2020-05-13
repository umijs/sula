import React from 'react';
import { mount } from 'enzyme';
import { Form, FormAction } from '..';
import '../../__tests__/common';

describe('form action', () => {
  it('formaction in form', () => {
    const fn = jest.fn();
    const wrapper = mount(
      <Form
        fields={[
          {
            name: 'group',
            actionsRender: [
              {
                type: 'button',
                props: {
                  className: 'action-test-btn',
                  children: 'btn',
                },
                action: fn,
              },
            ],
            actionsPosition: 'center',
            fields: [
              {
                name: 'input',
                label: 'input',
                field: 'input',
              },
            ],
          },
        ]}
      />,
    );

    wrapper.find('.action-test-btn').last().simulate('click');
    expect(fn.mock.calls[0][0].form).not.toBeNull();
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('formaction component', () => {
    const fn = jest.fn();
    const wrapper = mount(
      <Form layout="vertical">
        <FormAction
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
        />
      </Form>,
    );
    wrapper.find('.action-test-btn').last().simulate('click');
    expect(fn.mock.calls[0][0].form).not.toBeNull();
    expect(wrapper.render()).toMatchSnapshot();
  });
});
