import React from 'react';
import { mount } from 'enzyme';
import { IconPlugin } from '../../render-plugin/icon';
import { registerActionPlugin } from '../';
import { registerFieldPlugins } from '../../field-plugin';
import { registerRenderPlugins } from '../../render-plugin';

describe('action plugin', () => {
  beforeEach(() => {
    registerRenderPlugins();
    registerFieldPlugins();
    registerActionPlugin();
  })

  describe('history', () => {
    it('back', () => {
      const wrapper = mount(
        <IconPlugin
          config={{
            action: 'back',
          }}
          autoLoading={false}
          type="appstore"
        />
      )
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.find(IconPlugin).simulate('click');
    })
  })

  describe('modalForm', () => {
    it('basic modalform', () => {
      const wrapper = mount(
        <IconPlugin
          config={{
            action: [
              {
                type: 'modalform',
                title: 'text'
              }
            ],
          }}
          autoLoading={false}
          type="appstore"
        />
      );
      expect(wrapper.render()).toMatchSnapshot();
    })
  })
})
