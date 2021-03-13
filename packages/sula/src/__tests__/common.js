import Mock from 'mockjs';

import { registerRenderPlugins } from '../render-plugin';
import { registerFieldPlugins, registerFieldPlugin } from '../field-plugin';
import { registerActionPlugins } from '../action-plugin';
import '../../../../global.tsx';

const { mock } = Mock;

Mock.setup({
  timeout: 800,
});

// https://github.com/nodejs/node/issues/35232
process.on('unhandledRejection', (e, p) => {
  p.catch((e) => {
    if (process.domain === self._domain) {
      self._domain.emit('error', e);
    }
  });
});

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
  registerActionPlugins();
});

export const delay = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

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

mock('/submit.json', ({ body }) => {
  const data = JSON.parse(body);
  return {
    success: true,
    code: 200,
    data,
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

mock('/values.json', {
  success: true,
  code: 200,
  data: {
    test: '123',
  },
});

export { dataSource };
