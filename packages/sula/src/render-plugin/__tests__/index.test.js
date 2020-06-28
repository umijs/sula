import React from 'react';
import { mount } from 'enzyme';
import sula from '../../core';

import { registerRenderPlugin } from '../plugin';
import Text from '../text';
import Card from '../card';
import Div from '../div';
import Link from '../link';

describe('render Plugin', () => {
  describe('registerRenderPlugin', () => {
    function Span(props) {
      if (props.ctx) {
        const { config = {}, ctx } = props;
        return <span {...config.props} disabled={ctx.disabled} />;
      }

      return <span {...props} />;
    }

    it('extra props', () => {
      registerRenderPlugin('spanWithExtra', ['extra'])(Span);

      const spanWithExtra = sula.render(
        'spanWithExtra',
        {},
        {
          props: {
            style: {
              fontSize: 16,
            },
          },
          extra: true,
        },
      );
      expect(spanWithExtra).toEqual(<Span extra={true} style={{ fontSize: 16 }} />);
    });

    it('without extra props', () => {
      registerRenderPlugin('spanWithOutExtra')(Span);

      const spanWithOutExtra = sula.render(
        'spanWithOutExtra',
        {},
        {
          extra: true,
        },
      );
      expect(spanWithOutExtra).toEqual(<Span />);
    });

    it('ctx', () => {
      registerRenderPlugin('spanWithCtx')(Span, true);

      const spanWithCtx = sula.render(
        'spanWithCtx',
        { disabled: true },
        {
          props: {
            children: 'Hello world',
          },
        },
      );

      expect(mount(spanWithCtx).find('span').props()).toEqual({
        children: 'Hello world',
        disabled: true,
      });
    });
  });

  it('text', () => {
    const wrapper = mount(<Text>Hello world</Text>);
    expect(wrapper.text()).toEqual('Hello world');
  });

  it('link', () => {
    const wrapper = mount(<Link style={{ fontSize: 16 }}>Href</Link>);
    expect(wrapper.find('Button').props().style).toEqual({ fontSize: 16, padding: 0 });
    expect(wrapper.find('Button').props().children).toEqual('Href');
    expect(wrapper.find('Button').props().type).toEqual('link');
  });

  describe('div', () => {
    it('empty', () => {
      const wrapper = mount(<Div />);
      expect(wrapper.find('div').length).toBeFalsy();
    });

    it('div', () => {
      const wrapper = mount(<Div>Hello world</Div>);
      expect(wrapper.find('div').text()).toEqual('Hello world');
    });
  });

  it('card', () => {
    const wrapper = mount(<Card title="Title">Hello world</Card>);
    expect(wrapper.find('.ant-card-head-title').text()).toEqual('Title');
    expect(wrapper.find('.ant-card-body').text()).toEqual('Hello world');
  });
});
