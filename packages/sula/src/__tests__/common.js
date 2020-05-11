import Mock from 'mockjs';
import { act } from 'react-dom/test-utils';

import { registerRenderPlugins } from '../render-plugin';
import { registerFieldPlugins } from '../field-plugin';
import { registerActionPlugin } from '../action-plugin';

const { mock } = Mock;

beforeAll(() => {
  // https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  registerFieldPlugins();
  registerRenderPlugins();
  registerActionPlugin();
});

export const delay = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export async function actWait(callback = () => {}, timeout = 1000) {
  await act(async () => {
    await callback();
    await delay(timeout);
  });
}

export async function updateWrapper(wrapper, amount = 0) {
  await act(async () => {
    await delay(amount);
    wrapper.update();
  });
}

mock('/source.json', {
  success: true,
  code: 200,
  data: [{ text: 'a', value: 'a' }],
});

mock('/manage.json', {
  success: true,
  code: 200,
  data: {
    input: 'a',
  },
});

const dataSource = [];

for (let i = 0; i < 20; i += 1) {
  dataSource.push({
    id: i,
    name: `lily${i}`,
    age: i + 10,
  });
}

mock('/datasource.json', ({ body }) => {
  const { pageSize = 10, current, filters, sorter } = JSON.parse(body);
  return {
    success: true,
    code: 200,
    data: {
      pageSize,
      current,
      total: dataSource.length,
      filters,
      sorter,
      list: dataSource.slice(0, pageSize),
    },
  };
});

mock('/nopagination.json', {
  success: true,
  code: 200,
  data: dataSource,
});

mock('/success.json', {
  success: true,
  code: 200,
});

export { dataSource };
