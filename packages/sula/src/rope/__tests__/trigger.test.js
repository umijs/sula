/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { mount } from 'enzyme';
import {
  getLazyCtx,
  triggerPlugin,
  triggerFieldPlugin,
  toArrayActions,
  triggerRenderPlugin,
  normalizeConfig,
} from '../triggerPlugin';
import { registerRenderPlugins } from '../../render-plugin';
import { registerFieldPlugins } from '../../field-plugin';

describe('sula trigger plugin', () => {
  describe('getLayyCtx', () => {
    it('no params', () => {
      expect(getLazyCtx()).toBeNull();
      const fn = jest.fn(() => ({ form: 'f', table: 't' }));
      expect(
        getLazyCtx({
          ctxGetter: fn,
          other: 'o',
        }),
      ).toEqual({ form: 'f', other: 'o', table: 't' });
      expect(fn).toHaveBeenCalled();
      expect(getLazyCtx({ ctxGetter: 'a', other: 'o' })).toEqual({ other: 'o' });
    });
  });

  describe('toArrayActions', () => {
    it('basic', () => {
      const actionsChain = [];
      const actions = [
        {
          type: 'first',
          finish: {
            type: 'second',
            finish: {
              type: 'third',
            },
          },
        },
      ];

      toArrayActions(actions, actionsChain);
      expect(actionsChain).toEqual([{ type: 'first' }, { type: 'second' }, { type: 'third' }]);

      const actionsChain2 = [];
      const actions2 = [
        [
          {
            type: 'a-1',
          },
          [
            {
              type: 'a-2-1',
            },
            {
              type: 'a-2-2',
            },
            {
              type: 'a-2-3',
              finish: {
                type: 'a-2-3-1',
              },
            },
          ],
        ],
        {
          type: 'b-1',
          finish: {
            type: 'b-1-1',
          },
        },
      ];
      toArrayActions(actions2, actionsChain2);
      expect(actionsChain2).toEqual([
        { type: 'a-1' },
        { type: 'a-2-1' },
        { type: 'a-2-2' },
        { type: 'a-2-3' },
        { type: 'a-2-3-1' },
        { type: 'b-1' },
        { type: 'b-1-1' },
      ]);
    });
  });

  describe('triggerPlugin', () => {
    registerRenderPlugins();
    registerFieldPlugins();

    it('function type', () => {
      expect(triggerPlugin('field', {}, { type: () => <div>abc</div> })).toEqual(<div>abc</div>);
    });

    it('basic object', () => {
      expect(
        triggerPlugin('render', {}, { type: 'text', props: { children: 'abc' } }),
      ).toMatchSnapshot();
    });

    it('template string', () => {
      expect(
        triggerPlugin(
          'field',
          { a: 'input!', disabled: true },
          {
            type: 'input',
            props: {
              placeholder: 'please #{a}',
            },
            funcProps: {
              disabled: (ctx) => ctx.disabled,
            },
          },
          null,
          true,
        ),
      ).toMatchSnapshot();
    });

    it('skip function props', () => {
      const fn = jest.fn();
      expect(
        triggerPlugin(
          'field',
          { holder: 'input!', disabled: true },
          {
            type: 'input',
            props: {
              placeholder: 'please #{holder}',
              onClick: fn,
            },
          },
          {
            skipFuncObjKeys: ['props'],
          },
          true,
        ),
      ).toMatchSnapshot();
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('triggerFieldPlugin', () => {
    it('baisc', () => {
      const fn = jest.fn();
      expect(
        triggerFieldPlugin(
          { holder: 'input!' },
          {
            type: 'input',
            props: {
              placeholder: 'plese #{holder}',
              onClick: fn,
            },
          },
        ),
      ).toMatchSnapshot();
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('normalizeConfig', () => {
    it('string && function', () => {
      expect(normalizeConfig('abc')).toEqual({ type: 'abc' });
      expect(
        normalizeConfig(() => {
          return 'abc';
        }).type(),
      ).toEqual('abc');
    });

    it('has type', () => {
      expect(normalizeConfig({ props: {} }, 'abc')).toEqual({
        type: 'abc',
        props: {},
      });
    });

    it('basic config', () => {
      expect(normalizeConfig({ type: 'abc', props: {} })).toEqual({
        type: 'abc',
        props: {},
      });
      expect(normalizeConfig(<div>abc</div>)).toEqual(<div>abc</div>);
    });

    describe('triggerRenderPlugin', () => {
      it('null', () => {
        expect(triggerRenderPlugin({}, [])).toBeNull();
      });

      it('not have action', () => {
        const text = triggerRenderPlugin(
          {},
          {
            type: 'text',
            props: {
              children: 'hello world',
              className: 't1',
            },
          },
        );
        expect(text).toMatchSnapshot();
      });

      it('basic', () => {
        const fn = jest.fn();
        const text = triggerRenderPlugin(
          {},
          {
            type: 'text',
            props: {
              children: 'hello world',
              className: 't1',
            },
            action: fn,
          },
        );
        const wrapper = mount(text);
        expect(fn).not.toHaveBeenCalled();
        expect(text).toMatchSnapshot();
        wrapper.find('.t1').at(0).simulate('click');
        expect(fn).toHaveBeenCalled();
      });

      it('only one child render', () => {
        const fn = jest.fn();
        const text = triggerRenderPlugin({}, [
          {
            type: 'text',
            props: {
              children: 'hello',
              className: 't1',
            },
            action: fn,
          },
        ]);
        const wrapper = mount(text);
        expect(fn).not.toHaveBeenCalled();
        expect(text).toMatchSnapshot();
        wrapper.find('.t1').at(0).simulate('click');
        expect(fn).toHaveBeenCalled();
      });

      it('multiple child render', () => {
        const fn1 = jest.fn();
        const fn2 = jest.fn();
        const text = triggerRenderPlugin({}, [
          {
            type: 'text',
            props: {
              children: 'hello',
              className: 't1',
            },
            action: fn1,
          },
          {
            type: 'text',
            props: {
              children: 'world',
              className: 't2',
            },
            action: fn2,
          },
        ]);
        const wrapper = mount(text);
        expect(fn1).not.toHaveBeenCalled();
        expect(fn2).not.toHaveBeenCalled();
        expect(text).toMatchSnapshot();
        wrapper.find('.t1').at(0).simulate('click');
        expect(fn1).toHaveBeenCalled();
        wrapper.find('.t2').at(0).simulate('click');
        expect(fn2).toHaveBeenCalled();
      });
    });
  });
});
