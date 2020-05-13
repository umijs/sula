import React from 'react';
import { mount } from 'enzyme';
import { ButtonPlugin } from '../button';
import '../../__tests__/common';

describe('button', () => {
  jest.useFakeTimers(); // 设置快速时间
  it('basic', () => {
    const actions = jest.fn();
    const wrapper = mount(<ButtonPlugin
      icon="tablet"
      config={{
        action: [
          actions,
          'stringAction'
        ]
      }}
    >test</ButtonPlugin>)
    expect(wrapper.render()).toMatchSnapshot();
  })
  
  it('button click, no lastAction.final', () => {
    const actions = jest.fn();
    const wrapper = mount(
      <ButtonPlugin
        autoLoading={false}
        config={{
          action: [
            ctx => {
              ctx.button.showLoading();
              setTimeout(() => {
                ctx.button.hideLoading()
              }, 2000);
            },
            actions,
            'finaAction'
          ]
        }}
      >按钮</ButtonPlugin>
    )
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.find(ButtonPlugin).at(0).simulate('click');
    jest.runAllTimers(); // 时间快进
    expect(wrapper.find('button').text()).toBe('按 钮');
    expect(actions).toBeCalled();
  })

  it('button click, has lastAction.final', () => {
    const actions = jest.fn();
    const wrapper = mount(
      <ButtonPlugin
        config={{
          action: [
            actions,
            {
              type: jest.fn(),
              final: jest.fn()
            }
          ]
        }}
      >按钮</ButtonPlugin>
    )
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.find(ButtonPlugin).at(0).simulate('click');
    jest.runAllTimers(); // 时间快进

    expect(wrapper.find('button').text()).toBe('按 钮');
    expect(actions).toBeCalled();

    wrapper.update();
    wrapper.unmount();
  })

  it('button click, has lastAction.final', () => {
    const actions = jest.fn();
    const wrapper = mount(
      <ButtonPlugin
        config={{
          action: [
            actions,
            {
              type: jest.fn(),
              before: jest.fn()
            }
          ]
        }}
      >按钮</ButtonPlugin>
    )
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.find(ButtonPlugin).at(0).simulate('click');
    jest.runAllTimers(); // 时间快进

    expect(actions).toBeCalled();
  })
})
