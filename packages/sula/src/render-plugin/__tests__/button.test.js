import React from 'react';
import { mount } from 'enzyme';
import { ButtonPlugin } from '../button';
import '../../__tests__/common';

describe('button', () => {
  jest.useFakeTimers(); // 设置快速时间
  it('basic', () => {
    const wrapper = mount(<ButtonPlugin
      icon="tablet"
      config={{
        action: [
          () => {
            console.log('first action')
          },
          'stringAction'
        ]
      }}
    >test</ButtonPlugin>)
    expect(wrapper.render()).toMatchSnapshot();
  })
  
  it('button click, no lastAction.final', () => {
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
            'finaAction'
          ]
        }}
      >按钮</ButtonPlugin>
    )

    expect(wrapper.render()).toMatchSnapshot();
    wrapper.find(ButtonPlugin).at(0).simulate('click');
    jest.runAllTimers(); // 时间快进
  })

  it('button click, has lastAction.final', () => {
    const wrapper = mount(
      <ButtonPlugin
        config={{
          action: [
            () => {
              console.log('first action');
            },
            {
              type: jest.fn(),
              final: () => {
                console.log('final action');
              }
            }
          ]
        }}
      >按钮</ButtonPlugin>
    )
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.find(ButtonPlugin).at(0).simulate('click');
    jest.runAllTimers(); // 时间快进

    wrapper.update();
    wrapper.unmount();
  })

  it('button click, has lastAction.final', () => {
    const wrapper = mount(
      <ButtonPlugin
        config={{
          action: [
            () => {
              console.log('first action');
            },
            {
              type: jest.fn(),
              before: () => {
                console.log('before action');
              }
            }
          ]
        }}
      >按钮</ButtonPlugin>
    )
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.find(ButtonPlugin).at(0).simulate('click');
    jest.runAllTimers(); // 时间快进
  })
})
