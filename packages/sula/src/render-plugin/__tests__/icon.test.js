import React from 'react';
import { mount } from 'enzyme';
import { EditOutlined, EditTwoTone, FormOutlined } from '@ant-design/icons';
import SulaIcon, { IconPlugin } from '../icon';
import LoadingIcon from '../icon/InnerLoadingIcon';
import { delay } from '../../__tests__/common';

SulaIcon.iconRegister({
  edit: {
    outlined: EditOutlined,
    twoTone: EditTwoTone,
  },
});

describe('icon', () => {
  it('loading icon', () => {
    const loadingIconRef = React.createRef();
    const wrapper = mount(<LoadingIcon ref={loadingIconRef} />);
    expect(wrapper.find('Icon').props().type).toEqual('loading');
    expect(wrapper.find('Icon').props().loading).toEqual(true);
    expect(loadingIconRef.current).not.toBeNull();
  });

  describe('component icon', () => {
    it('globalIconMapper', () => {
      const wrapper = mount(<SulaIcon type="edit" theme="twoTone" />);
      expect(wrapper.find('span').props()).toMatchObject({
        'aria-label': 'edit',
        className: 'anticon anticon-edit',
      });
    });

    it('iconMapper', () => {
      const wrapper = mount(<SulaIcon type="form" iconMapper={{ form: FormOutlined }} />);
      expect(wrapper.find('span').props()).toMatchObject({
        'aria-label': 'form',
        className: 'anticon anticon-form',
      });
    });

    it('null', () => {
      const wrapper = mount(<SulaIcon type="notExist" />);
      expect(wrapper.find('span').length).toBeFalsy();
    });
  });

  it('disabled', () => {
    const wrapper = mount(<SulaIcon type="edit" disabled />);
    expect(wrapper.find('span').props()).toMatchObject({
      className: 'anticon anticon-edit sula-icon-disabled',
    });
  });

  it('loading', () => {
    const wrapper = mount(<SulaIcon type="edit" loading />);
    expect(wrapper.find('span').props()).toMatchObject({
      className: 'anticon anticon-edit sula-icon-loading',
    });
  });

  it('clickable', () => {
    const wrapper = mount(<SulaIcon type="edit" onClick={() => {}} />);
    expect(wrapper.find('span').props()).toMatchObject({
      className: 'anticon anticon-edit sula-icon-clickable',
    });
  });

  it('text', () => {
    const wrapper = mount(<SulaIcon type="edit" text="edit" />);
    expect(wrapper.find('span').last().text()).toEqual('edit');
  });

  describe('iconPlugin', () => {
    async function testLoading(action, autoLoading = true) {
      const wrapper = mount(
        <IconPlugin
          autoLoading={autoLoading}
          text="loading"
          type="edit"
          config={{
            action,
          }}
        />,
      );
      wrapper.find('Icon').first().simulate('click');
      await delay(1000);
      wrapper.update();
      expect(wrapper.find('.sula-icon-loading').props().style).toEqual({ display: '' });
      expect(wrapper.find('.sula-icon-clickable').props().style).toEqual({ display: 'none' });

      await delay(1500);
      wrapper.update();
      expect(wrapper.find('.sula-icon-loading').props().style).toEqual({ display: 'none' });
      expect(wrapper.find('.sula-icon-clickable').props().style).toEqual({ display: '' });
    }

    it('not have config', () => {
      const wrapper = mount(<IconPlugin config={{}} type="edit" />);
      expect(wrapper.find('Icon').props()).toEqual({ theme: 'outlined', type: 'edit' });
      expect(wrapper.find('Icon').type()).toEqual(SulaIcon);
    });

    it('loading', () => {
      testLoading(
        [
          (ctx) => {
            ctx.icon.showLoading();
            setTimeout(() => {
              ctx.icon.hideLoading();
            }, 2000);
          },
        ],
        false,
      );
    });

    it('autoLoading', () => {
      testLoading([
        async () => {
          await delay(2000);
          return Promise.resolve();
        },
      ]);
    });

    it('final', () => {
      const fn = jest.fn(() => Promise.resolve());
      testLoading([
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
      testLoading([
        {
          type: async () => {
            await delay(2000);
            return Promise.resolve();
          },
        },
      ]);
    });
  });
});
