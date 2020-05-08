import PubSub from '../pubsub';

describe('pubsub', () => {
  it('pubsub test', () => {
    const fn = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();
    const unsub = PubSub.sub('error', fn);
    const unsub2 = PubSub.sub('error', fn2);
    PubSub.pub('error', 'error params');
    expect(fn).toHaveBeenCalledWith('error params');
    expect(PubSub.subscribes.error.length).toBe(2);
    unsub2();
    expect(PubSub.subscribes.error.length).toBe(1);

    PubSub.sub('error', fn3);
    PubSub.pub('error', 'error params 2');
    expect(fn.mock.calls).toEqual([['error params'], ['error params 2']]);
    expect(fn3).toHaveBeenCalledWith('error params 2');
    expect(fn3.mock.calls.length).toBe(1);
    unsub();
  });

  it('not error while pub & unsub type', () => {
    PubSub.pub('log', 'a');
    PubSub.unsub('log');
    expect(Object.keys(PubSub.subscribes).indexOf('log') === -1).toBeTruthy();
  });
});
