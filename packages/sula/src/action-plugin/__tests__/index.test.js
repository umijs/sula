import React from 'react';
import { mount } from 'enzyme';
import { IconPlugin } from '../../render-plugin/icon';
import { actWait } from '../../__tests__/common';

describe('action plugin', () => {

  describe('history', () => {
    it('back', async() => {
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
      await actWait()
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
