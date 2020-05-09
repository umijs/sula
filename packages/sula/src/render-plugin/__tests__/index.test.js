import React from 'react';
import { Input, Swicth } from 'antd';
import { mount } from 'enzyme';
import sula from '../../core';

import { renderPlugin } from '../plugin';
import Text from '../text';
import Card from '../card';
import Div from '../div';

describe('render Plugin', () => {
  describe('renderPlugin', () => {
    it('has extraPropsName && config has extraPropsName', () => {
      renderPlugin('text', ['type'])(Text, true);
      expect(sula.render(
        'text',
        {},
        {
          type: 'danger',
          props: {
            children: 'danger',
          }
        }
      )).toEqual(<Text type="danger" ctx={{}} config={{ type: 'danger', props: { children: 'danger' } }}>danger</Text>);
    })
  
    it('has extraPropsName && config has not extraPropsName', () => {
      renderPlugin('switch', ['defaultValue'])(Swicth, true);
      expect(sula.render(
        'switch',
        {
          value: true
        },
        {}
      )).toEqual(<Swicth ctx={{ value: true }} config={{}} />);
    })
  
    it('input test', () => {
      renderPlugin('input')(Input, true);
      expect(sula.render(
        'input',
        {},
        {}
      )).toEqual(
        <Input ctx={{}} config={{}} type="text"/>
      );
    })
  })
  
  describe('Text snapshot', () => {
    it('Text no props', () => {
      const wrapper = mount(<Text>children</Text>);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    })
  
    it('Text props', () => {
      const wrapper = mount(<Text type="danger">children</Text>);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    })
  })

  describe('Card snapshot', () => {
    it('Card no props', () => {
      const wrapper = mount(<Card>children</Card>);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    })

    it('Card props', () => {
      const wrapper = mount(<Card title="Head">children</Card>);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    })
  })

  describe('div snapshot', () => {
    it('has children className', () => {
      const wrapper = mount(<Div className="testDiv">test</Div>);
      expect(wrapper.find('.testDiv').length).toBeTruthy();
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    });
    it('no children', () => {
      const wrapper = mount(<Div />);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    })
  })
})
