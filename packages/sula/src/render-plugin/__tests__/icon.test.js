import React from 'react';
import { TabletFilled, AppstoreOutlined } from '@ant-design/icons';
import { mount, shallow } from 'enzyme';
import Icon from '../icon/Icon';
import LoadingIcon from '../icon/InnerLoadingIcon';
import { IconPlugin } from '../icon';
import '../../__tests__/common';

describe('icon', () => {
  jest.useFakeTimers(); // 设置快速时间
  beforeEach(() => {
    Icon.iconRegister({
      tablet: {
        filled: TabletFilled,
      },
      appstore: {
        outlined: AppstoreOutlined,
      }
    })
  });

  describe('Icon test', () => {
    it('basic icon', () => {
      const wrapper = mount(<Icon type="Head" />);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    })
  
    it('no text', () => {
      const wrapper = mount(<Icon type="tablet" theme="filled" className="testClassName" />);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    })
  
    it('has text', () => {
      const wrapper = mount(<Icon type="tablet" theme="filled" text="testIcon" onClick={() => {}} disabled={false} />);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    })
  
    it('icon click', () => {
      class TestIcon extends React.Component{
        state = {
          iconText: 'iconText',
          disabled: false,
        }
  
        render() {
          const { iconText, disabled } = this.state;
          return (
            <Icon
              disabled
              type="tablet"
              theme="filled"
              text={iconText}
              onClick={() => {
                this.setState({
                  iconText: iconText ? undefined : 'iconText',
                  disabled: !disabled
                })
              }}
            />
          )
        }
      }
      const wrapper = shallow(<TestIcon />);
      expect(wrapper.state('iconText')).toBe('iconText');
      expect(wrapper.state('disabled')).toBe(false);
      wrapper.find(Icon).simulate('click');
      expect(wrapper.state('iconText')).toBe(undefined);
      expect(wrapper.state('disabled')).toBe(true);
    })
  })

  describe('LoadingIcon', () => {
    it('basic loadingIcon', () => {
      const wrapper = mount(<LoadingIcon />);
      expect(wrapper.render()).toMatchSnapshot();
    })
  })

  describe('LoadingIconManager', () => {
    it('autoLoading is false', () => {
      const wrapper = mount(
        <IconPlugin
          config={{
            action: ctx => {
              ctx.icon.showLoading();
              setTimeout(() => {
                ctx.icon.hideLoading();
              }, 2000);
            }
          }}
          autoLoading={false}
          type="appstore"
        />
      );
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.find(Icon).at(1).simulate('click');
      jest.runAllTimers(); // 时间快进

      wrapper.update();
      wrapper.unmount();
    })

    it('autoLoading is true', () => {
      const wrapper = mount(
        <IconPlugin
          config={{
            action: [
              () => {
                console.log('next action');
              },
              'finallyAction'
            ]
          }}
          type="appstore"
        />
      );
      expect(wrapper.render()).toMatchSnapshot();
    })

    it('autoLoading is true, has lastAction.final', () => {
      const wrapper = mount(
        <IconPlugin
          config={{
            action: [
              () => {
                console.log('next action');
              },
              {
                type: jest.fn(),
                final: () => {
                  console.log('final action')
                }
              }
            ]
          }}
          type="appstore"
        />
      );
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.find(Icon).at(1).simulate('click');
    })

    it('autoLoading is true, no lastAction.final', () => {
      const wrapper = mount(
        <IconPlugin
          config={{
            action: [
              () => {
                console.log('next action');
              },
              {
                type: jest.fn(),
                before: () => {
                  console.log('final action')
                }
              }
            ]
          }}
          type="appstore"
        />
      );
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.find(Icon).at(1).simulate('click');
    })

    it('no config', () => {
      const wrapper = mount(
        <IconPlugin type="appstore"/>
      );
      expect(wrapper.render()).toMatchSnapshot();
    })

  })
})
