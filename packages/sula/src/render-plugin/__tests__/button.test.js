import React from 'react';
import { mount } from 'enzyme';
import LoadigButton, { ButtonPlugin, LinkPlugin } from '../button';
import { delay } from '../../__tests__/common';

describe('button', () => {
  it('loadingbutton', () => {
    const loadingButtonRef = React.createRef();
    const wrapper = mount(
      <LoadigButton ref={loadingButtonRef} icon="edit">
        Hello world
      </LoadigButton>,
    );
    expect(wrapper.find('Button').props().children).toEqual('Hello world');
    expect(wrapper.find('Icon').props().type).toEqual('edit');
    expect(loadingButtonRef.current).not.toBeNull();
  });

  describe('Button Plugin', () => {
    it('not have config', () => {
      const wrapper = mount(<ButtonPlugin config={{}}>Edit</ButtonPlugin>);
      expect(wrapper.find('Button').props()).toMatchObject({
        children: 'Edit',
      });
    });

    async function testButtonLoading(action, autoLoading = true) {
      const wrapper = mount(
        <ButtonPlugin
          autoLoading={autoLoading}
          text="loading"
          config={{
            action,
          }}
        />,
      );
      wrapper.find('button').first().simulate('click');
      await delay(1000);
      wrapper.update();
      expect(wrapper.find('Button').props().loading).toEqual(true);

      await delay(1500);
      wrapper.update();
      expect(wrapper.find('Button').props().loading).toEqual(false);
    }

    it('loading', () => {
      testButtonLoading((ctx) => {
        ctx.button.showLoading();
        setTimeout(() => {
          ctx.button.hideLoading();
        }, 2000);
      }, false);
    });

    it('autoLoading', () => {
      testButtonLoading([
        async () => {
          await delay(2000);
          return Promise.resolve();
        },
      ]);
    });

    it('final', () => {
      const fn = jest.fn(() => Promise.resolve());
      testButtonLoading([
        {
          type: fn,
          final: async () => {
            await delay(2000);
            return Promise.resolve();
          },
        },
      ]);
    });

    it('other type', () => {
      testButtonLoading([
        {
          type: async () => {
            await delay(2000);
            return Promise.resolve();
          },
        },
      ]);
    });
  });

  it('LinkPlugin', () => {
    const wrapper = mount(<LinkPlugin style={{ fontSize: 16 }} />);
    expect(wrapper.find('Button').props().type).toEqual('link');
    expect(wrapper.find('Button').props().style).toEqual({ fontSize: 16, padding: 0 });
  });
});
