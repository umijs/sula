import React from 'react';
import { mount } from 'enzyme';
import StepForm from '../index';
import '../../__tests__/common';

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
    console.log('ctx: ', ctx);
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
        resultr
      />
    );
    expect(wrapper.render()).toMatchSnapshot();
    const submitBtnList = [];
    wrapper.find('button').forEach(node => {
      if (node.text() === 'Next') {
        submitBtnList.push(node);
      }
    })

    await submitBtnList[0].simulate('click');
    await submitBtnList[1].simulate('click');
    wrapper.find('button').forEach(node => {
      if (node.text() === 'Submit') {
        node.simulate('click');
      }
    })

    wrapper.unmount();
  })

  it('basic edit', async() => {
    const wrapper = mount(
      <StepForm
        mode="edit"
        direction="vertical"
        steps={steps}
        submit={submit}
        resultr
      />
    );
    expect(wrapper.render()).toMatchSnapshot();
    const submitBtnList = [];
    wrapper.find('button').forEach(node => {
      if (node.text() === 'Next') {
        submitBtnList.push(node);
      }
    })

    await submitBtnList[0].simulate('click');
    await submitBtnList[1].simulate('click');

    wrapper.find('button').forEach(node => {
      if (node.text() === 'Previous') {
        node.simulate('click');
      }
    });

    wrapper.unmount();
  })
})