import React from 'react';
import { Swicth, Button } from 'antd';
import moment from 'moment';
import { mount } from 'enzyme';
import sula from '../../core';
import { fieldPlugin } from '../plugin';
import { setMockDate, resetMockDate, datepickerValueChange, rangepickerValueChange } from './utils';

import Select from '../select';
import SulaCheckboxGroup from '../checkboxgroup';
import Datepicker from '../datepicker';
import RangePicker from '../rangepicker';
import TimePicker from '../timepicker';
import Cascader from '../cascader';
import RadioGroup from '../radiogroup';
import Upload from '../upload';

const selectTreeSource = [
  {
    text: '水果',
    children: [
      {
        text: '苹果',
        value: 'apple',
      },
      {
        text: '桃子',
        value: 'peach',
      },
    ]
  },
  {
    text: '蔬菜',
    children: [
      {
        text: '西红柿',
        value: 'tomato',
      },
    ]
  },
]
const cascaderoptions = [
  {
    value: 'zhejiang',
    text: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        text: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            text: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    text: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        text: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            text: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]

const selectSource = [
  {
    text: '苹果',
    value: 'apple'
  }, {
    text: '桃子',
    value: 'peach'
  }
]

describe('plugin', () => {
  beforeEach(() => {
    setMockDate();
  });

  afterEach(() => {
    resetMockDate();
  });

  describe('fieldPlugin test', () => {
    fieldPlugin('select')(Select, true, true);
    fieldPlugin('switch')(Swicth);
  
    it('select test', () => {
      expect(sula.field(
        'select',
        {
          source: selectTreeSource,
          mode: 'view'
        },
        {}
      )).toEqual(<Select source={selectTreeSource} ctx={{ source: selectTreeSource, mode: 'view' }} disabled />)
    });
  
    it('switch test', () => {
      expect(sula.field(
        'switch',
        {
          mode: 'view',
        },
      )).toEqual(<Swicth disabled />)
    })
  })

  describe('select', () => {
    it('select basic source', () => {
      const wrapper = mount(<Select source={selectSource} />);
      expect(wrapper.render()).toMatchSnapshot();
    });
    it('select tree source', () => {
      const wrapper = mount(<Select source={selectTreeSource} />);
      expect(wrapper.render()).toMatchSnapshot();
    })
  })

  describe('SulaCheckboxGroup', () => {
    it('SulaCheckboxGroup has source', () => {
      const wrapper = mount(<SulaCheckboxGroup source={selectSource} />);
      expect(wrapper.render()).toMatchSnapshot();
    });
    it('SulaCheckboxGroup source null', () => {
      const wrapper = mount(<SulaCheckboxGroup />);
      expect(wrapper.render()).toMatchSnapshot();
    })
  });

  describe('datepicker', () => {
    it('no props', () => {
      const wrapper = mount(<Datepicker />);
      expect(wrapper.render()).toMatchSnapshot();
    });
    it('valueFormat props is utc', () => {
      const value = moment('2020-01-01', 'YYYY-MM-DD');
      const wrapper = mount(<Datepicker valueFormat="utc" value={value} />);
      expect(wrapper.render()).toMatchSnapshot();
    });
    it('has value, valueFormat props is true', () => {
      const value = moment('2020-02-01', 'YYYY-MM-DD');
      const wrapper = mount(<Datepicker valueFormat value={value} />);
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('datepicker change', () => {
      const utcDatepicker = mount(<Datepicker valueFormat="utc" />);
      const unixDatepicker = mount(<Datepicker valueFormat="unix" />);
      const basicDatepicker = mount(<Datepicker valueFormat />);

      datepickerValueChange(utcDatepicker);
      datepickerValueChange(unixDatepicker);
      datepickerValueChange(basicDatepicker);
    })
  })

  describe('RangePicker', () => {
    const start = moment('2020-01-01', 'YYYY-MM-DD');
    const end = moment('2000-05-01', 'YYYY-MM-DD');
    it('no props', () => {
      const wrapper = mount(<RangePicker />);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    });
    it('valueFormat is utc, has value', () => {
      const wrapper = mount(<RangePicker value={[start,end]} valueFormat="utc"/>);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    });
    it('valueFormat is true, has value', () => {
      const wrapper = mount(<RangePicker value={[start,end]} valueFormat />);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    })
  
    it('RangePicker change', () => {
      const unixRangePicker = mount(<RangePicker valueFormat />);
      rangepickerValueChange(unixRangePicker);
    })
    it('RangePicker change && valueFormat is utc', () => {
      const utcRangePicker = mount(<RangePicker valueFormat="utc" />);
      rangepickerValueChange(utcRangePicker);
    })
  })

  describe('timepicker', () => {
    const times = moment('03:20:23', 'HH:mm:ss');
    it('no props', () => {
      const wrapper = mount(<TimePicker />);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    })
    it('valueFormat is true, has value', () => {
      const wrapper = mount(<TimePicker valueFormat value={times} />);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    })
    it('valueFormat is utc, has value', () => {
      const wrapper = mount(<TimePicker valueFormat="utc" value={times} />);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.unmount();
    })
  })

  describe('Cascader', () => {
    it('basic Cascader', () => {
      const wrapper = mount(<Cascader source={cascaderoptions} />);
      expect(wrapper.render()).toMatchSnapshot();
    })
    it('no source', () => {
      const wrapper = mount(<Cascader />);
      expect(wrapper.render()).toMatchSnapshot();
    })
  })

  describe('RadioGroup', () => {
    it('basic RadioGroup', () => {
      const wrapper = mount(<RadioGroup source={selectSource} />)
      expect(wrapper.render()).toMatchSnapshot();
    })
    it('no source', () => {
      const wrapper = mount(<RadioGroup />)
      expect(wrapper.render()).toMatchSnapshot();
    })
  })

  describe('upload', () => {
    it('basic upload', () => {
      const wrapper = mount(
        <Upload
          onChange={() => jest.fn()}
          request={{
            params: {
              id: 1
            }
          }}
        >
          <Button>上传</Button>
        </Upload>
      )
      wrapper.find('input').at(0).simulate('change', {
        target: {
          files: [{ file: 'foo.png' }],
        },
      });
      expect(wrapper.render()).toMatchSnapshot();
    })
  })
  
})

