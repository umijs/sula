/* eslint-disable no-template-curly-in-string,import/no-extraneous-dependencies */
import React from 'react';
import moment from 'moment';
import { isPromise, isFormData } from '../is';
import actionLogger from '../action-logger';
import template from '../template';
import transformConfig from '../transformConfig';
import { toArray, assignWithDefined } from '../common';
import transStore from '../filterStore';
import warning from '../warning';

process.env.SULA_LOGGER = 'all';

describe('sula utils', () => {
  describe('is', () => {
    it('isPromise', () => {
      expect(isPromise(Promise.resolve('a'))).toBeTruthy();
      expect(isPromise(function a() {})).toBeFalsy();
    });

    it('isFormdata', () => {
      expect(isFormData({ a: 1 })).toBeFalsy();
      expect(isFormData(new FormData())).toBeTruthy();
    });
  });

  describe('actionLogger', () => {
    let logSpy;
    beforeEach(() => {
      logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      logSpy.mockRestore();
    });

    it('action', () => {
      actionLogger('action', 'name');
      expect(logSpy).toHaveBeenCalledWith(
        '%caction %cname',
        'color: #9e9e9e;font-weight:bold;',
        'color: #1890ff;font-weight:bold;',
      );
    });

    it('beforePass', () => {
      actionLogger('beforePass', 'name');
      expect(logSpy).toHaveBeenCalledWith('    %cbefore pass', 'color: #5b8c00;font-weight:bold;');
    });
    it('beforeStop', () => {
      actionLogger('beforeStop', 'name');
      expect(logSpy).toHaveBeenCalledWith('    %cbefore stop', 'color: #eb2f96;font-weight:bold;');
    });

    it('actionError', () => {
      actionLogger('actionError', 'name');
      expect(logSpy).toHaveBeenCalledWith(
        '    %cerror',
        'color: #f5222d;font-weight:bold;',
        'name',
      );
    });

    it('actionSuccess', () => {
      actionLogger('actionSuccess', 'name');
      expect(logSpy).toHaveBeenCalledWith(
        '    %csuccess',
        'color: #389e0d;font-weight:bold;',
        'name',
      );
    });
  });

  describe('template', () => {
    it('baisc', () => {
      expect(template(123, { a: '123' })).toEqual(123);
      expect(template(true, { a: '123' })).toEqual(true);
      expect(template({}, { a: '123' })).toEqual({});
      expect(template([], { a: '123' })).toEqual([]);
      expect(template('', { a: '123' })).toEqual('');
      expect(template('#{a}123', { a: '123' })).toEqual('123123');
      expect(template('123a#{a}', { a: '123' })).toEqual('123a123');
      expect(template('#{a}', { a: '123' })).toEqual('123');
    });
  });

  describe('transform config', () => {
    it('no params', () => {
      expect(transformConfig({ type: 'a' })).toEqual({ type: 'a' });
    });
    it('empty string undefined null number boolean will return itself', () => {
      expect(transformConfig('', { a: 1 })).toEqual('');
      expect(transformConfig(undefined, { a: 1 })).toEqual(undefined);
      expect(transformConfig(null, { a: 1 })).toEqual(null);
      expect(transformConfig(1, { a: 1 })).toEqual(1);
      expect(transformConfig(true, { a: 1 })).toEqual(true);
      expect(transformConfig(false, { a: 1 })).toEqual(false);
      expect(transformConfig(/\w/, { a: 1 })).toEqual(/\w/);
      const sym = Symbol('a');
      expect(transformConfig(sym, { a: 1 })).toEqual(sym);
    });
    it('no ctx will return obj', () => {
      expect(
        transformConfig({ type: 'input', props: { placeholder: '#{holder}' } }, () => {}),
      ).toEqual({ type: 'input', props: { placeholder: '#{holder}' } });
    });
    it('function ctx will be run', () => {
      const fn = jest.fn((ctx) => ctx);
      expect(transformConfig(fn, 'a')).toEqual('a');
      expect(fn).toHaveBeenCalledWith('a');
    });

    it('template string && function props', () => {
      expect(
        transformConfig(
          {
            type: 'icon',
            props: {
              type: 'loading',
              disabled: '#{disabled}',
            },
            funcProps: {
              visible: (ctx) => ctx.visible,
            },
          },
          { disabled: true, visible: false },
        ),
      ).toEqual({
        type: 'icon',
        props: {
          type: 'loading',
          disabled: true,
        },
        funcProps: {
          visible: false,
        },
      });
    });

    it('skip function props', () => {
      const fn = jest.fn();
      expect(
        transformConfig(
          {
            type: 'text',
            props: {
              children: 't1',
              onClick: fn,
            },
          },
          { a: 1 },
          {
            skipFuncObjKeys: ['props'],
          },
        ),
      ).toEqual({ props: { children: 't1', onClick: fn }, type: 'text' });
      expect(fn).not.toHaveBeenCalled();
    });

    it('skip keys', () => {
      expect(
        transformConfig(
          {
            type: 'fetch',
            params: { id: '#{id}' },
            converter: {
              type: 't',
              id: '#{id}',
            },
          },
          {
            id: 1,
          },
          {
            skipKeys: ['converter'],
          },
        ),
      ).toEqual({
        converter: { id: '#{id}', type: 't' },
        params: { id: 1 },
        type: 'fetch',
      });
    });

    it('is array object', () => {
      expect(
        transformConfig(
          {
            type: 'text',
            action: [
              {
                type: 'a',
                ctx: '#{f}',
              },
              'b',
              {
                type: <div>123</div>,
              },
            ],
          },
          { f: 1 },
        ),
      ).toEqual({ action: [{ ctx: 1, type: 'a' }, 'b', { type: <div>123</div> }], type: 'text' });
    });

    it('is moment', () => {
      expect(transformConfig([moment('2020-11-01'), moment('2020-11-11')], {})).toEqual([
        moment('2020-11-01'),
        moment('2020-11-11'),
      ]);
    });

    it('is formData', () => {
      const formData = new FormData();
      formData.append('name', 'sula');
      expect(transformConfig(formData, {}).get('name')).toEqual('sula');
    });
  });

  describe('toArray', () => {
    it('basic', () => {
      expect(toArray(undefined)).toEqual([]);
      expect(toArray(null)).toEqual([]);
      expect(toArray([1, 2, 3])).toEqual([1, 2, 3]);
      expect(toArray(1)).toEqual([1]);
    });
  });

  describe('assign with defined', () => {
    it('basic', () => {
      expect(assignWithDefined({ a: 1 }, { b: 2, c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
      expect(assignWithDefined({ a: 1, b: 2, c: 3 }, { b: 3, c: undefined, d: 4 })).toEqual({
        a: 1,
        b: 3,
        c: 3,
        d: 4,
      });
    });
  });

  describe('transStore', () => {
    it('basic', () => {
      expect(transStore({ a: { b: 1 }, c: undefined }, [['a', 'b'], ['c'], ['d']])).toEqual([
        { name: ['a', 'b'], value: 1 },
        { name: ['c'], value: undefined },
      ]);
      expect(transStore({ a: { b: 1 }, c: 'c' }, [[], ['c']])).toEqual([
        { name: ['c'], value: 'c' },
      ]);
    });
  });

  describe('warning', () => {
    it('has warning', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      warning(false, 'scope', 'message');
      expect(errorSpy).toHaveBeenCalledWith('Warning: [sula: scope] message');
      errorSpy.mockRestore();
    });
    it('not warning', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      warning(true, 'scope', 'message');
      expect(errorSpy).not.toHaveBeenCalled();
      errorSpy.mockRestore();
    });
  });
});
