/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { mount } from 'enzyme';
import { Tooltip, Popconfirm } from 'antd';
import RopeContainer from '../RopeContainer';

const sleep = (timeout = 0) => new Promise((resolve) => setTimeout(resolve, timeout));

describe('rope', () => {
  it('disabled', () => {
    const wrapper = mount(
      <RopeContainer disabled>
        <button type="button">click</button>
      </RopeContainer>,
    );

    expect(wrapper.find('button').props().disabled).toEqual(true);
  });

  it('tooltip visible change', async () => {
    const wrapper = mount(
      <RopeContainer tooltip="tips!!!">
        <div id="hello">Hello world!</div>
      </RopeContainer>,
    );
    wrapper.find('#hello').simulate('mouseenter');
    await sleep(1000);
    wrapper.update();
    expect(document.querySelectorAll('.ant-tooltip').length).toEqual(1);
    expect(wrapper.find(Tooltip).props().visible).toEqual(true);
    expect(wrapper.find(Tooltip).props().title).toEqual('tips!!!');
  });

  it('popconfirm visible change', async () => {
    const wrapper = mount(
      <RopeContainer confirm="confirm!!!">
        <div id="hello">Hello world!</div>
      </RopeContainer>,
    );
    wrapper.find('#hello').simulate('click');
    await sleep(1000);
    expect(document.querySelectorAll('.ant-popover').length).toEqual(1);
    const popconfirm = wrapper.find(Popconfirm);
    expect(popconfirm.props().visible).toEqual(true);
    expect(popconfirm.props().title).toEqual('confirm!!!');
  });

  it('only one visible', async () => {
    const wrapper = mount(
      <RopeContainer confirm="confirm!!!" tooltip="tip!!!">
        <div id="hello">Hello world!</div>
      </RopeContainer>,
    );
    wrapper.find('#hello').simulate('mouseenter');
    wrapper.find('#hello').simulate('click');
    await sleep(1000);
    wrapper.update();
    expect(wrapper.find(Tooltip).last().props().visible).toEqual(false);
    expect(wrapper.find(Popconfirm).props().visible).toEqual(true);
    expect(wrapper.find(Popconfirm).props().title).toEqual('confirm!!!');

    wrapper.find('#hello').simulate('mouseleave');
    wrapper.find('#hello').simulate('mouseenter');
    await sleep(1000);
    expect(wrapper.find(Tooltip).last().props().visible).toEqual(false);
    expect(wrapper.find(Popconfirm).props().visible).toEqual(true);
  });

  it('object props', () => {
    const wrapper = mount(
      <RopeContainer
        confirm={{
          title: 'confirm!!!',
          mouseEnterDelay: 0,
          mouseLeaveDelay: 0,
        }}
        tooltip={{
          title: 'tips!!!',
          mouseEnterDelay: 0,
          mouseLeaveDelay: 0,
        }}
      >
        <div id="hello">Hello world!</div>
      </RopeContainer>,
    );
    wrapper.find('#hello').simulate('mouseenter');
    expect(wrapper.find(Tooltip).last().props().visible).toEqual(true);
    expect(wrapper.find(Tooltip).last().props().title).toEqual('tips!!!');

    wrapper.find('#hello').simulate('click');
    expect(wrapper.find(Popconfirm).props().visible).toEqual(true);
    expect(wrapper.find(Tooltip).last().props().visible).toEqual(false);
    expect(wrapper.find(Popconfirm).props().title).toEqual('confirm!!!');
  });

  describe('trigger', () => {
    it('basic trigger', () => {
      const onClick = jest.fn();
      const wrapper = mount(
        <RopeContainer tooltip="tip" trigger={onClick}>
          <div>hello</div>
        </RopeContainer>,
      );

      wrapper.simulate('click');
      expect(onClick).toBeCalled();
    });
    it('confim trigger', () => {
      const onClick = jest.fn();
      const wrapper = mount(
        <RopeContainer tooltip="tip" confirm="confirm" trigger={onClick}>
          <div>hello</div>
        </RopeContainer>,
      );

      wrapper.simulate('click');
      expect(onClick).not.toBeCalled();
      wrapper.find('button').forEach((btn) => {
        if (btn.text() === 'OK') {
          btn.simulate('click');
        }
      });
      expect(onClick).toBeCalled();
    });
  });
});
