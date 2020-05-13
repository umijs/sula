import React from 'react';
import { mount } from 'enzyme';
import { StepForm } from '../index';
import { actWait, updateWrapper } from '../../__tests__/common';

const steps = [
  {
    title: 'Step1',
    fields: [
      {
        name: 'input1',
        label: 'Input1',
        field: 'input',
      },
    ],
  },
  {
    title: 'Step2',
    fields: [
      {
        name: 'input2',
        label: 'Input2',
        field: 'input',
      },
    ],
  },
  {
    title: 'Step3',
    fields: [
      {
        name: 'input3',
        label: 'Input3',
        field: 'input',
      },
    ],
  },
];


const submit = {
  url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
  method: 'GET',
  params: {
    name: 'sula',
  },
  finish: (ctx) => {
    return ctx.result;
  },
};

describe('stepForm', () => {
  it('basic create', () => {
    const wrapper = mount(
      <StepForm
        mode="view"
        direction="horizontal"
        steps={steps}
        submit={submit}
        result
      />
    );
    expect(wrapper.render()).toMatchSnapshot();
  })

  it('basic edit', () => {
    const wrapper = mount(
      <StepForm
        mode="edit"
        direction="vertical"
        steps={steps}
        submit={submit}
        result
      />
    );
    expect(wrapper.render()).toMatchSnapshot();
  })

  it('basic create', async() => {
    const wrapper = mount(
      <StepForm
        mode="create"
        direction="vertical"
        steps={steps}
        submit={submit}
        result
      />
    );
    const submitBtnList = [];
    wrapper.find('button').forEach(node => {
      if (node.text() === 'Next') {
        submitBtnList.push(node);
      }
    })

    submitBtnList[0].simulate('click');
    await actWait();
    submitBtnList[1].simulate('click');
    await actWait();
    wrapper.find('button').forEach(node => {
      if (node.text() === 'Submit') {
        node.simulate('click');
      }
    })
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.unmount();
  })

  it('basic edit', async() => {
    const wrapper = mount(
      <StepForm
        mode="edit"
        direction="vertical"
        steps={steps}
        submit={submit}
        result
      />
    );

    expect(wrapper.find('.ant-steps-item').at(0).props().className).toMatch('ant-steps-item-active');
    const submitBtnList = [];
    wrapper.find('button').forEach(node => {
      if (node.text() === 'Next') {
        submitBtnList.push(node);
      }
    })

    submitBtnList[0].simulate('click');
    await updateWrapper(wrapper);
    expect(wrapper.find('.ant-steps-item').at(1).props().className).toMatch('ant-steps-item-active')
    submitBtnList[1].simulate('click');
    await updateWrapper(wrapper);
    expect(wrapper.find('.ant-steps-item').at(2).props().className).toMatch('ant-steps-item-active');
    wrapper.find('button').forEach(node => {
      if (node.text() === 'Previous') {
        node.simulate('click');
      }
    });
    await updateWrapper(wrapper);
    expect(wrapper.render()).toMatchSnapshot();

    wrapper.unmount();
  })
})
