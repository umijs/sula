import Rope, { STOP, rejectSTOP } from '../index';

let rope;
let logSpy;

beforeEach(() => {
  process.env.SULA_LOGGER = 'action';
  const trigger = jest.fn((ctx, config) => {
    if (typeof config.type === 'function') {
      return config.type(ctx);
    }
    return config.type;
  });
  rope = new Rope({ trigger });
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  logSpy.mockRestore();
});

function loggerMatch(typeList) {
  typeList.forEach((type, idx) => {
    expect(logSpy.mock.calls[idx][0]).toMatch(type);
  });
}

describe('sula rope', () => {
  it('have before && not promise && return false', async () => {
    const fn = jest.fn();
    const beforeFn = jest.fn(() => false);
    await rope.use({ type: fn, before: beforeFn, final: fn }).use({ type: fn, final: fn }).proxy()({
      a: 1,
    });
    loggerMatch(['action', 'before stop']);
    await expect(beforeFn).toHaveBeenCalledWith({ a: 1 });
    await expect(fn).not.toHaveBeenCalled();
  });

  it('have before && not promise && not return false', () => {
    const fn = jest.fn();
    const beforeFn = jest.fn();
    const fn2 = jest.fn();
    const beforeFn2 = jest.fn();

    const action = {
      type: fn,
      before: beforeFn,
    };
    const action2 = {
      type: fn2,
      before: beforeFn2,
    };

    rope.use(action).use(action2).proxy()({ a: 1 });
    loggerMatch(['action', 'before pass', 'success', 'action', 'before pass', 'success']);
    expect(beforeFn).toHaveBeenCalledWith({ a: 1, result: undefined, results: {} });
    expect(fn).toHaveBeenCalledWith({ a: 1, result: undefined, results: {} });
    expect(beforeFn2).toHaveBeenCalledWith({ a: 1, result: undefined, results: {} });
    expect(fn2).toHaveBeenCalledWith({ a: 1, result: undefined, results: {} });
  });

  it('have before && is reject promise', async () => {
    const fn = jest.fn();
    const beforeFn = jest.fn(() => Promise.reject());
    await rope.use({ type: fn, before: beforeFn }).use({ type: fn, final: fn }).proxy()({ a: 1 });
    loggerMatch(['action', 'before stop']);
    await expect(beforeFn).toHaveBeenCalledWith({ a: 1 });
    await expect(fn).not.toHaveBeenCalled();
  });

  it('have before && is resolve promise', async () => {
    const fn = jest.fn(() => Promise.resolve());
    const fn2 = jest.fn();
    const beforeFn = jest.fn(() => Promise.resolve());
    await rope.use({ type: fn, before: beforeFn }).use({ type: fn2 }).proxy()({ a: 1 });
    loggerMatch(['action', 'before pass']);
    expect(beforeFn).toHaveBeenCalledWith({ a: 1 });
    await expect(fn).toHaveBeenCalledWith({ a: 1 });
    await expect(fn2).toHaveBeenCalledWith({ a: 1, result: undefined, results: {} });
  });

  it('not have before && not promise', () => {
    const fn1 = jest.fn((ctx) => ({ ...ctx, b: 2 }));
    const fn2 = jest.fn((ctx) => ({ ...ctx, c: 3 }));
    const fn3 = jest.fn();
    const fn4 = jest.fn();
    rope
      .use({ type: fn1, resultPropName: 'res' })
      .use({ type: fn2, final: fn3 })
      .use({ type: fn4 })
      .use({ type: 'fn5' })
      .proxy()({ a: 1 });

    loggerMatch(['action', 'success', 'action', 'success', 'action', 'success', 'fn5', 'success']);
    expect(fn1).toHaveBeenCalledWith({ a: 1, result: undefined, results: { res: { a: 1, b: 2 } } });
    expect(fn2).toHaveBeenCalledWith({
      a: 1,
      result: undefined,
      results: { res: { a: 1, b: 2 } },
    });
    expect(fn3).toHaveBeenCalledWith({
      a: 1,
      result: undefined,
      results: { res: { a: 1, b: 2 } },
    });
    expect(fn4).toHaveBeenCalledWith({
      a: 1,
      result: undefined,
      results: { res: { a: 1, b: 2 } },
    });
  });

  it('not have before && is resolve promise', async () => {
    const fn = jest.fn(() => Promise.resolve('fn1'));
    const fn2 = jest.fn(() => Promise.resolve('fn2'));
    await rope.use({ type: fn }).use({ type: fn2 }).proxy()({ a: 1 });
    loggerMatch(['action', 'success', 'action']);
    await expect(fn).toHaveBeenCalledWith({ a: 1, result: 'fn1', results: {} });
    await expect(fn2).toHaveBeenCalledWith({ a: 1, result: 'fn1', results: {} });
  });

  it('not have before && is reject promise', async () => {
    const fn = jest.fn(() => Promise.reject(new Error('fn error')));
    const fn2 = jest.fn();
    const errorFn = jest.fn();
    const errorFn2 = jest.fn();
    await rope.use({ type: fn, error: errorFn }).use({ type: fn2, error: errorFn2 }).proxy()({
      a: 1,
    });
    loggerMatch(['action', 'error']);
    await expect(fn).toHaveBeenCalledWith({ a: 1 });
    await expect(fn2).not.toHaveBeenCalled();
    await expect(errorFn).toHaveBeenCalledWith({ a: 1 });
    await expect(errorFn2).not.toHaveBeenCalled();
  });

  it('not have before && is reject promise', async () => {
    const fn = jest.fn();
    const fn2 = jest.fn(() => Promise.reject(new Error('fn error')));
    const fn3 = jest.fn();
    await rope.use({ type: fn }).use({ type: fn2 }).use({ type: fn3 }).proxy()({
      a: 1,
    });
    await expect(fn).toHaveBeenCalledWith({ a: 1, result: undefined, results: {} });
    await expect(fn2).toHaveBeenCalled();
    await expect(fn3).not.toHaveBeenCalled();
  });

  it('rejectSTOP', async () => {
    const fn = jest.fn();
    try {
      await rejectSTOP();
    } catch (s) {
      expect(s).toEqual(STOP);
      fn();
    }

    expect(fn).toHaveBeenCalled();
  });
});
