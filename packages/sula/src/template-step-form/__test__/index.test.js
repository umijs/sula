import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { StepForm } from '../index';
import Memorize from '../memorize';
import { delay } from '../../__tests__/common';

const config = {
  mode: 'create',
  steps: [
    {
      title: 'Step1',
      subTitle: '',
      fields: [
        {
          name: 'input1',
          label: 'input1',
          field: 'input',
        },
      ],
    },
    {
      title: 'Step2',
      subTitle: '',
      fields: [
        {
          name: 'input2',
          label: 'input2',
          field: 'input',
        },
      ],
    },
    {
      title: 'Step3',
      subTitle: '',
      fields: [
        {
          name: 'input3',
          label: 'input3',
          field: 'input',
        },
      ],
    },
  ],
  submit: {
    url: '/success.json',
    method: 'post',
  },
};

async function buttonClick(wrapper, text, idx = 0) {
  wrapper
    .find('Memorize')
    .children()
    .childAt(idx)
    .find('button')
    .forEach((node) => {
      if (node.text() === text) {
        node.simulate('click');
      }
    });

  await act(async () => {
    await delay(1000);
    wrapper.update();
  });
}

describe('step form', () => {
  describe('step', () => {
    function getMemorizeItemStyle(wrapper, idx) {
      return wrapper.find('Memorize').children().childAt(idx).props().style;
    }

    function isActiveStep(wrapper, idx) {
      expect(
        wrapper.find('.ant-steps-item').at(idx).hasClass('ant-steps-item-active'),
      ).toBeTruthy();
    }

    it('step change', async () => {
      const wrapper = mount(<StepForm {...config} />);

      expect(getMemorizeItemStyle(wrapper, 0)).toEqual({});
      expect(getMemorizeItemStyle(wrapper, 1)).toEqual({ display: 'none' });
      expect(getMemorizeItemStyle(wrapper, 2)).toEqual({ display: 'none' });
      isActiveStep(wrapper, 0);

      await buttonClick(wrapper, 'Next');
      expect(getMemorizeItemStyle(wrapper, 0)).toEqual({ display: 'none' });
      expect(getMemorizeItemStyle(wrapper, 1)).toEqual({});
      isActiveStep(wrapper, 1);

      await buttonClick(wrapper, 'Next', 1);
      isActiveStep(wrapper, 2);

      expect(getMemorizeItemStyle(wrapper, 1)).toEqual({ display: 'none' });
      expect(getMemorizeItemStyle(wrapper, 2)).toEqual({});

      await buttonClick(wrapper, 'Previous', 2);
      isActiveStep(wrapper, 1);
      expect(getMemorizeItemStyle(wrapper, 0)).toEqual({ display: 'none' });
      expect(getMemorizeItemStyle(wrapper, 1)).toEqual({});
    });

    it('loading', async () => {
      const remoteValues = async () => {
        await delay(2000);
        return Promise.resolve({
          input1: 'a',
          input2: 'b',
        });
      };
      const wrapper = mount(<StepForm {...config} mode="edit" remoteValues={remoteValues} />);
      await delay(1000);
      wrapper.update();
      expect(wrapper.find('Spin').props().spinning).toEqual(true);

      await delay(2500);
      wrapper.update();
      expect(wrapper.find('Spin').props().spinning).toEqual(false);
    });

    it('result page', () => {
      const wrapper = mount(<StepForm {...config} result />);
      const memorizeItems = wrapper.find('Memorize').children();
      expect(memorizeItems.children().length).toEqual(4);
    });

    it('submit', async (done) => {
      const initialValues = {
        input1: 'a',
        input2: 'b',
      };
      const wrapper = mount(
        <StepForm
          {...config}
          submit={{
            url: '/submit.json',
            method: 'post',
            converter: ({ data }) => {
              expect(data).toEqual(initialValues);
              done();
            },
          }}
          initialValues={initialValues}
        />,
      );

      await buttonClick(wrapper, 'Next');
      await buttonClick(wrapper, 'Next', 1);
      await buttonClick(wrapper, 'Submit', 2);
    });

    it('deriction', () => {
      const wrapper = mount(<StepForm {...config} />);
      expect(wrapper.find('.sula-template-step-form-horizontal-steps').length).toBeTruthy();

      wrapper.setProps({ direction: 'vertical' });
      expect(wrapper.find('.sula-template-step-form-vertical-steps').length).toBeTruthy();
    });

    it('style', () => {
      const wrapper = mount(<StepForm {...config} />);
      wrapper.setProps({ stepsStyle: { fontSize: 16 } });
      expect(wrapper.find('.sula-template-step-form-horizontal-steps').props().style).toEqual({
        fontSize: 16,
      });

      wrapper.setProps({ formStyle: { fontSize: 16 } });
      expect(wrapper.find('.sula-template-step-form-horizontal-form').props().style).toEqual({
        fontSize: 16,
      });
    });
  });

  describe('memorize', () => {
    it('memorize', () => {
      expect(mount(<Memorize.Item />).html()).toBeNull();
    });
  });

  it('snapshot', () => {
    const wrapper = mount(<StepForm {...config} mode="view" />);
    expect(wrapper.render()).toMatchSnapshot();
  });
});
