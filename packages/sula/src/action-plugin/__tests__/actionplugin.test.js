import React from 'react';
import { mount } from 'enzyme';
import { QueryTable } from '../../template-query-table';
import ConfigProvider from '../../config-provider';
import '../../__tests__/common';

let wrapper;
const history = {
  goForward: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
};
beforeEach(() => {
  wrapper = mount(
    <ConfigProvider history={history}>
      <QueryTable
        rowKey="id"
        initialDataSource={[]}
        columns={[
          {
            key: 'id',
            title: 'Id',
          },
        ]}
        actionsRender={[
          {
            type: 'button',
            props: {
              className: 'back',
              children: 'back',
            },
            action: 'back',
          },
          {
            type: 'button',
            props: {
              className: 'forward',
              children: 'forward',
            },
            action: 'forward',
          },
          {
            type: 'button',
            props: {
              className: 'route1',
              children: 'route',
            },
            action: {
              type: 'route',
              path: '#/a',
            },
          },
          {
            type: 'button',
            props: {
              className: 'route2',
              children: 'route',
            },
            action: {
              type: 'route',
              path: '#/a',
              search: false,
              query: {
                name: 'sula',
              },
            },
          },
          {
            type: 'button',
            props: {
              className: 'modalform',
              children: 'modalform',
            },
            action: {
              type: 'modalform',
              title: 'title',
              fields: [
                {
                  name: 'input',
                  label: 'input',
                  field: 'input',
                },
              ],
              submit: {},
            },
          },
          {
            type: 'button',
            props: {
              className: 'drawerform',
              children: 'drawerform',
            },
            action: {
              type: 'drawerform',
              title: 'title',
              fields: [
                {
                  name: 'input',
                  label: 'input',
                  field: 'input',
                },
              ],
              submit: {},
            },
          },
        ]}
      />
    </ConfigProvider>,
  );
});

afterEach(() => {
  wrapper.unmount();
});
describe('action plugin', () => {
  it('back', () => {
    wrapper.find('.back').last().simulate('click');
    expect(history.goBack).toHaveBeenCalled();
  });

  it('forward', () => {
    wrapper.find('.forward').last().simulate('click');
    expect(history.goForward).toHaveBeenCalled();
  });

  it('route', () => {
    wrapper.find('.route1').last().simulate('click');
    expect(history.push).toHaveBeenCalledWith('#/a');
  });

  it('route search', () => {
    wrapper.find('.route2').last().simulate('click');
    expect(history.push).toHaveBeenCalledWith({
      pathname: '#/a',
      search: '?name=sula',
    });
  });
});
