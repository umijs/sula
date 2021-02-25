import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { delay } from '../../__tests__/common';
import { QueryTable } from '../../template-query-table';
import Memorize from '../memorize';
import { StepQueryTable } from '..';

const config = {
  rowKey: 'id',
  fields: [
    {
      name: 'name',
      label: 'name',
      field: 'input',
    },
  ],
  columns: [
    {
      key: 'id',
      title: 'Id',
    },
    {
      key: 'name',
      title: 'name',
    },
  ],
  steps: [
    {
      title: 'Steps1',
    },
    {
      title: 'Steps2',
    },
    {
      title: 'Steps3',
    },
  ],
  remoteDataSource: {
    url: '/datasource.json',
    method: 'post',
  },
};

describe('step query table', () => {
  describe('step query table', () => {
    function getMemorizeStyle(wrapper, idx = 0) {
      return wrapper.find('Memorize').children().childAt(idx).props().style;
    }

    async function changeStep(wrapper, idx) {
      wrapper.find('.ant-steps-item-container').at(idx).simulate('click');

      await act(async () => {
        await delay(1000);
        wrapper.update();
      });
    }

    function isActionStep(wrapper, idx) {
      expect(
        wrapper.find('.ant-steps-item').at(idx).hasClass('ant-steps-item-active'),
      ).toBeTruthy();
    }

    it('step', async () => {
      const wrapper = mount(<StepQueryTable {...config} />);

      expect(wrapper.find(QueryTable).length).toBe(1);

      await changeStep(wrapper, 1);
      isActionStep(wrapper, 1);
      wrapper.update();
      expect(wrapper.find(QueryTable).length).toBe(2);
      expect(getMemorizeStyle(wrapper)).toEqual({ display: 'none' });

      await changeStep(wrapper, 2);
      isActionStep(wrapper, 2);
      expect(wrapper.find(QueryTable).length).toBe(3);
      expect(getMemorizeStyle(wrapper, 1)).toEqual({ display: 'none' });
    });

    it('different step', async () => {
      const wrapper = mount(
        <StepQueryTable
          {...config}
          steps={[
            {
              title: 'Steps1',
              columns: [
                {
                  key: 'id',
                  title: 'Id',
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
            },
            {
              title: 'Steps2',
            },
          ]}
        />,
      );

      expect(wrapper.find('.ant-table-thead').find('tr').children().length).toEqual(3);

      await changeStep(wrapper, 1);
      expect(wrapper.find('.ant-table-thead').last().find('tr').children().length).toEqual(2);
    });

    it('autoRefresh', async () => {
      let times = 0;
      const wrapper = mount(
        <StepQueryTable
          {...config}
          remoteDataSource={{
            url: '/datasource.json',
            method: 'post',
            convertParams: ({ params }) => {
              times += 1;
              return params;
            },
          }}
        />,
      );

      await changeStep(wrapper, 1);
      await changeStep(wrapper, 0);

      expect(times).toEqual(3);
    });
  });

  describe('memorize', () => {
    it('memorize', () => {
      expect(mount(<Memorize.Item />).html()).toBeNull();
    });
  });

  it('snapshot', () => {
    const wrapper = mount(<StepQueryTable {...config} />);
    expect(wrapper.render()).toMatchSnapshot();
  });
});
