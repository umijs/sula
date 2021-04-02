import React from 'react';
import { Select as ASelect, DatePicker as ADatePicker, TimePicker as ATimePicker } from 'antd';
import moment from 'moment';
import { mount } from 'enzyme';
import MockDate from 'mockdate';
import { act } from 'react-dom/test-utils';
import sula from '../../core';
import { openPicker, selectCell, selectTimeCell, closePicker } from './utils';
import { delay } from '../../__tests__/common';

import {
  Select,
  CheckboxGroup,
  TimePicker,
  DatePicker,
  RangePicker,
  Cascader,
  RadioGroup,
  Upload,
  TreeSelect,
  registerFieldPlugin,
} from '..';

describe('field plugin', () => {
  describe('registerFieldPlugin', () => {
    function CustomInput(props) {
      if (props.ctx) {
        const { config = {}, ctx } = props;
        return <input {...config.props} style={{ display: ctx.visible ? '' : 'none' }} />;
      }

      return <input {...props} />;
    }
    registerFieldPlugin('customInput')(CustomInput);

    it('basic register', () => {
      const input = sula.field(
        'customInput',
        {},
        {
          props: {
            style: {
              fontSize: 16,
            },
          },
        },
      );

      expect(input).toEqual(<CustomInput style={{ fontSize: 16 }} />);
    });

    it('disabled', () => {
      const disabledInput = sula.field('customInput', { disabled: true });
      expect(disabledInput).toEqual(<CustomInput disabled />);
    });

    it('ctx', () => {
      registerFieldPlugin('customInputWithCtx')(CustomInput, false, true);
      const ctxInput = sula.field(
        'customInputWithCtx',
        {
          visible: false,
        },
        {},
      );
      expect(mount(ctxInput).find('input').props().style).toEqual({ display: 'none' });
    });

    it('has source', () => {
      function CustomSelect(props) {
        const { source = [] } = props;
        return (
          <ASelect>
            {source.map((item) => (
              <ASelect.Option value={item.value} key={item.key}>
                {item.text}
              </ASelect.Option>
            ))}
          </ASelect>
        );
      }

      registerFieldPlugin('customSelect')(CustomSelect, true);
      const select = sula.field(
        'customSelect',
        {
          source: [
            {
              text: 'a',
              value: 'a',
            },
          ],
        },
        {},
      );

      expect(select).toEqual(<CustomSelect source={[{ text: 'a', value: 'a' }]} />);
    });
  });

  // 检查antd组件接收属性正确
  it('cascader', () => {
    const source = [
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
    ];
    const wrapper = mount(<Cascader source={source} />);

    expect(wrapper.find('Cascader').at(1).props().options).toEqual(source);
    expect(wrapper.find('Cascader').at(1).props().fieldNames).toEqual({ label: 'text' });
  });

  it('checkboxgroup', () => {
    const source = [{ text: 'A', value: 'a' }];
    const wrapper = mount(<CheckboxGroup source={source} />);

    expect(wrapper.find('CheckboxGroup').props().options).toEqual([
      { text: 'A', value: 'a', label: 'A' },
    ]);
  });

  it('treeselect', () => {
    const source = [{ text: 'A', value: 'a', children: [{ text: 'B', value: 'b' }] }];
    const wrapper = mount(<TreeSelect source={source} />);

    expect(wrapper.props()).toEqual({ source });
  });

  it('radiogroup', () => {
    const source = [{ text: 'A', value: 'a' }];
    const wrapper = mount(<RadioGroup source={source} />);
    expect(wrapper.find('Radio').length).toEqual(1);
    expect(wrapper.find('Radio').props()).toMatchObject({ children: 'A', value: 'a' });
  });

  describe('select', () => {
    it('basic', () => {
      const source = [
        { text: 'A', value: 'a' },
        { text: 'B', value: 'b' },
      ];
      const wrapper = mount(<Select source={source} />);
      const dropdownWrapper = mount(wrapper.find('Trigger').instance().getComponent());
      expect(dropdownWrapper.find('.ant-select-item-option-content').length).toBe(2);
      expect(dropdownWrapper.find('.ant-select-item-option-content').first().text()).toEqual('A');
    });

    it('group', () => {
      const source = [
        {
          text: 'A',
          value: 'a',
          children: [
            { text: 'A-1', value: 'a-1' },
            { text: 'A-2', value: 'a-2' },
          ],
        },
      ];

      const wrapper = mount(<Select source={source} />);
      const dropdownWrapper = mount(wrapper.find('Trigger').instance().getComponent());
      expect(dropdownWrapper.find('.ant-select-item-group').text()).toEqual('A');
      expect(dropdownWrapper.find('.ant-select-item-option-content').length).toBe(2);
    });

    describe('datepicker', () => {
      beforeEach(() => {
        MockDate.set(moment('2020-6-23'));
      });

      afterEach(() => {
        MockDate.reset();
      });

      it('utc', () => {
        const onChange = jest.fn();
        const wrapper = mount(<DatePicker onChange={onChange} valueFormat="utc" />);
        openPicker(wrapper);
        selectCell(wrapper, 3);

        expect(moment(onChange.mock.calls[0][0]).isSame('2020-06-03', 'date')).toBeTruthy();
        expect(onChange.mock.calls[0][1]).toEqual('2020-06-03');
      });

      it('valueformat', () => {
        const onChange = jest.fn();
        const wrapper = mount(
          <DatePicker onChange={onChange} valueFormat format="YY-MM-DD HH:mm:ss" />,
        );
        openPicker(wrapper);
        selectCell(wrapper, 3);
        expect(onChange).toHaveBeenCalledWith('20-06-03 00:00:00', '20-06-03 00:00:00');
      });

      it('default format value', () => {
        const wrapper = mount(
          <DatePicker value="20-06-23 00:00:00" valueFormat format="YY-MM-DD HH:mm:ss" />,
        );
        expect(
          wrapper.find(ADatePicker).props().value.isSame(moment('2020-06-23'), 'date'),
        ).toBeTruthy();
      });

      it('defaultValue', () => {
        const wrapper = mount(<DatePicker value="2020-06-23 00:00:00" />);
        expect(
          wrapper.find(ADatePicker).props().value.isSame(moment('2020-06-23'), 'date'),
        ).toBeTruthy();
      });
    });

    describe('timepicker', () => {
      beforeEach(() => {
        MockDate.set(moment('2020-6-23 00:00:00'));
      });

      afterEach(() => {
        MockDate.reset();
      });

      it('value format', () => {
        const onChange = jest.fn();
        const wrapper = mount(<TimePicker onChange={onChange} valueFormat format="mm:ss" />);
        openPicker(wrapper);
        selectTimeCell(wrapper, '02', 1);
        act(() => {
          wrapper.update();
        });
        expect(onChange).toHaveBeenCalledWith('00:02', '00:02');
      });

      it('utc', () => {
        const onChange = jest.fn();
        const wrapper = mount(<TimePicker onChange={onChange} valueFormat="utc" />);
        openPicker(wrapper);
        selectTimeCell(wrapper, '02');
        act(() => {
          wrapper.update();
        });

        expect(
          moment(onChange.mock.calls[0][0]).isSame('2020-06-23 00:00:02', 'second'),
        ).toBeTruthy();
        expect(onChange.mock.calls[0][1]).toEqual('00:00:02');
      });

      it('default format value', () => {
        const wrapper = mount(<TimePicker value="00:00" valueFormat format="mm:ss" />);
        expect(
          wrapper.find(ATimePicker).props().value.isSame(moment('00:00:00', 'mm:ss'), 'date'),
        ).toBeTruthy();
      });

      it('default value', () => {
        const wrapper = mount(<TimePicker value="2020-6-23 00:00:00" format="mm:ss" />);
        expect(
          wrapper.find(ATimePicker).props().value.isSame(moment('2020-6-23 00:00:00')),
        ).toBeTruthy();
      });
    });

    describe('rangepicker', () => {
      beforeEach(() => {
        MockDate.set(moment('2020-6-23'));
      });

      afterEach(() => {
        MockDate.reset();
      });

      it('utc', () => {
        const onChange = jest.fn();
        const wrapper = mount(<RangePicker onChange={onChange} valueFormat="utc" />);
        openPicker(wrapper);
        selectCell(wrapper, 3);
        closePicker(wrapper);

        openPicker(wrapper, 1);
        selectCell(wrapper, 5, 1);
        closePicker(wrapper, 1);

        expect(moment(onChange.mock.calls[0][0][0]).isSame('2020-06-03', 'date')).toBeTruthy();
        expect(moment(onChange.mock.calls[0][0][1]).isSame('2020-07-05', 'date')).toBeTruthy();
        expect(onChange.mock.calls[0][1]).toEqual(['2020-06-03 00:00:00', '2020-07-05 00:00:00']);
      });

      it('value format', () => {
        const onChange = jest.fn();
        const wrapper = mount(
          <RangePicker onChange={onChange} valueFormat format="YY-MM-DD HH:mm:ss" />,
        );
        openPicker(wrapper);
        selectCell(wrapper, 3);
        closePicker(wrapper);

        openPicker(wrapper, 1);
        selectCell(wrapper, 5, 1);
        closePicker(wrapper, 1);
        expect(onChange).toHaveBeenCalledWith(
          ['20-06-03 00:00:00', '20-07-05 00:00:00'],
          ['20-06-03 00:00:00', '20-07-05 00:00:00'],
        );
      });

      it('default format value', () => {
        const wrapper = mount(
          <RangePicker
            value={['20-06-23 00:00:00', '20-06-24 00:00:00']}
            valueFormat
            format="YY-MM-DD HH:mm:ss"
          />,
        );
        expect(
          wrapper
            .find(ADatePicker.RangePicker)
            .props()
            .value[0].isSame(moment('2020-06-23'), 'date'),
        ).toBeTruthy();
        expect(
          wrapper
            .find(ADatePicker.RangePicker)
            .props()
            .value[1].isSame(moment('2020-06-24'), 'date'),
        ).toBeTruthy();
      });

      it('default  value', () => {
        const wrapper = mount(
          <RangePicker value={['2020-06-23 00:00:00', '2020-06-24 00:00:00']} />,
        );
        expect(
          wrapper
            .find(ADatePicker.RangePicker)
            .props()
            .value[0].isSame(moment('2020-06-23'), 'date'),
        ).toBeTruthy();
        expect(
          wrapper
            .find(ADatePicker.RangePicker)
            .props()
            .value[1].isSame(moment('2020-06-24'), 'date'),
        ).toBeTruthy();
      });
    });
  });

  describe('upload', () => {
    it('basic upload', async () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <Upload
          onChange={onChange}
          request={{
            url: '/success.json',
          }}
        >
          <input />
        </Upload>,
      );
      wrapper
        .find('input')
        .at(0)
        .simulate('change', {
          target: {
            files: [{ file: 'foo.png' }],
          },
        });

      await delay(1000);
      expect(onChange).toHaveBeenCalled();
    });

    it('default file list', async () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <Upload
          onChange={onChange}
          fileList={[
            {
              file: 'foo.png',
              name: undefined,
              originFileObj: { file: 'foo.png', uid: 'rc-upload-1592912949790-2' },
              percent: 0,
              status: 'uploading',
              uid: 'rc-upload-1592912949790-2',
            },
          ]}
          request={{
            url: '/success.json',
            params: {
              domain: 'sula',
            },
          }}
        >
          <input />
        </Upload>,
      );
      wrapper
        .find('input')
        .at(0)
        .simulate('change', {
          target: {
            files: [{ file: 'foo2.png' }],
          },
        });

      await delay(1000);
      expect(onChange.mock.calls[0][0].length).toEqual(2);
    });
  });
});
