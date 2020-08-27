import React from 'react';
import { mount } from 'enzyme';
import { InfoCircleOutlined } from '@ant-design/icons';
import { act } from 'react-dom/test-utils';
import { QueryTable } from '..';
import { delay } from '../../__tests__/common';

const config = {
  rowKey: 'id',
  fields: [
    {
      name: 'name',
      label: 'name',
      field: 'input',
      itemLayout: {
        span: 4,
      },
    },
  ],
  columns: [
    {
      key: 'id',
      title: 'id',
    },
    {
      key: 'name',
      title: 'name',
    },
    {
      key: 'age',
      title: 'age',
    },
  ],
  remoteDataSource: {
    url: '/datasource.json',
    method: 'post',
  },
};

function getFields(length) {
  return Array(length)
    .fill(0)
    .map((_, idx) => ({ name: `input${idx}`, label: `input${idx}`, field: 'input' }));
}

describe('querytable', () => {
  it('basic', () => {
    const wrapper = mount(<QueryTable {...config} />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  describe('layout', () => {
    const fields = [
      {
        name: 'age',
        label: 'age',
        field: 'input',
        itemLayout: {
          span: {
            xxl: 4,
            xl: 3,
            lg: 2,
            md: 2,
            sm: 1,
            xs: 1,
          },
        },
      },
    ];
    it('layout span number', () => {
      const wrapper = mount(<QueryTable {...config} />);
      expect(wrapper.find('.ant-col-4').length).toEqual(1);
    });

    it('layout span object', () => {
      const wrapper = mount(<QueryTable {...config} fields={fields} />);
      expect(wrapper.render()).toMatchSnapshot();
    });

  });

  describe('fields length', () => {
    it('fields length 3', () => {
      const wrapper = mount(<QueryTable {...config} fields={getFields(3)} />);
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('fields length > 3', () => {
      const wrapper = mount(<QueryTable {...config} fields={getFields(5)} />);
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('fields length > 6', () => {
      const wrapper = mount(<QueryTable {...config} fields={getFields(8)} />);

      let hiddenFieldCount = 0;
      wrapper
        .find('.ant-form')
        .find('.ant-row')
        .first()
        .children()
        .forEach((node) => {
          if (node.props().initialVisible === false) {
            hiddenFieldCount += 1;
          }
        });
      expect(hiddenFieldCount).toEqual(3);

      expect(wrapper.render()).toMatchSnapshot();

      wrapper.find('a').first().simulate('click');
      wrapper.update();
      expect(wrapper.find('.ant-form').find('.ant-row').first().children().length).toEqual(9);
    });
  });

  describe('table', () => {
    it('initialValue', async () => {
      let requsetParams;
      const wrapper = mount(
        <QueryTable
          {...config}
          initialValues={{ name: 'a' }}
          remoteDataSource={{
            ...config.remoteDataSource,
            convertParams: ({ params }) => {
              requsetParams = params;
              return params;
            },
          }}
        />,
      );

      expect(wrapper.find('input').props().value).toEqual('a');
      expect(requsetParams.filters.name).toEqual('a');

      wrapper
        .find('input')
        .first()
        .simulate('change', { target: { value: 'aaa' } });
      await act(async () => {
        await delay(1000);
      });
      wrapper.find('button').forEach((node) => {
        if (node.text() === 'Query') {
          node.simulate('click');
        }
      });
      await act(async () => {
        await delay(1000);
      });
      expect(requsetParams.filters.name).toEqual('aaa');

      wrapper.find('button').forEach((node) => {
        if (node.text() === 'Reset') {
          node.simulate('click');
        }
      });
      await act(async () => {
        await delay(1000);
      });
      expect(requsetParams.filters.name).toEqual('a');
    });

    it('rowSelectiion', async () => {
      const wrapper = mount(
        <QueryTable
          {...config}
          rowSelection={{}}
          remoteDataSource={{
            url: '/datasource.json',
            method: 'post',
          }}
        />,
      );

      await act(async () => {
        await delay(1000);
      });
      const checkboxes = wrapper.find('input').last();
      checkboxes.first().simulate('change', { target: { checked: true } });

      // rowSelection插件
      expect(wrapper.find(InfoCircleOutlined).length).toBeTruthy();
    });

    it('actions', () => {
      const fn = jest.fn();
      const action = {
        type: 'button',
        props: {
          children: 'button',
          className: 'actionBtn',
        },
        action: fn,
      };
      const wrapper = mount(<QueryTable {...config} actionsRender={action} />);
      wrapper.find('.actionBtn').last().simulate('click');
      const { table, dataSource } = fn.mock.calls[0][0];
      expect(table).not.toBeNull();
      expect(dataSource).toEqual([]);
    });
  });
});
