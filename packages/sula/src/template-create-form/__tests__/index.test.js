import React from 'react';
import { mount } from 'enzyme';
import { CreateForm } from '..';
import { Form } from '../../form';
import { delay } from '../../__tests__/common';

const fields = [
  {
    name: 'input1',
    label: 'label1',
    field: 'input',
  },
  {
    name: 'input2',
    label: 'label2',
    field: 'input',
  },
  {
    name: 'input3',
    label: 'label3',
    field: 'input',
  },
];

const submit = {
  url: '/submit.json',
  method: 'post',
};

describe('createForm', () => {
  it('createForm view', () => {
    const wrapper = mount(<CreateForm fields={fields} mode="view" />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('createForm props', () => {
    const wrapper = mount(
      <CreateForm
        fields={fields}
        actionsPosition="bottom"
        submitButtonProps={{
          children: 'SubmitTest',
        }}
        backButtonProps={{
          children: 'CancelTest',
          disabled: true,
        }}
        submit={submit}
      />,
    );
    expect(wrapper.find('.sula-form-action-bottom').length).toEqual(1);
    expect(wrapper.find('button').first().text()).toEqual('SubmitTest');
    expect(wrapper.find('button').at(1).text()).toEqual('CancelTest');
    expect(wrapper.find('button').at(1).props().disabled).toEqual(true);
  });

  it('createForm back', () => {
    const fn = jest.fn();
    const wrapper = mount(<CreateForm fields={fields} back={fn} submit={submit} />);
    wrapper.find('button').at(1).simulate('click');
    expect(fn).toHaveBeenCalled();
  });

  it('createForm itemLayout cols', () => {
    const wrapper = mount(
      <CreateForm
        fields={fields}
        itemLayout={{
          cols: 1,
        }}
        submit={submit}
      />,
    );
    expect(wrapper.find(Form).props().actionsPosition).toEqual('default');

    wrapper.setProps({ itemLayout: { cols: 3 } });
    expect(wrapper.find(Form).props().actionsPosition).toEqual('center');
  });

  it('createForm itemLayout cols auto', () => {
    const wrapper = mount(
      <CreateForm
        itemLayout={{
          cols: {
            xl: 3,
            sm: 2,
          },
        }}
        fields={fields}
        submit={submit}
      />,
    );
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('createForm actionsRender', () => {
    const wrapper = mount(
      <CreateForm
        fields={fields}
        actionsRender={[
          {
            type: 'button',
            props: {
              children: 'button',
            },
            action: jest.fn(),
          },
        ]}
      />,
    );
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('loading', async () => {
    const remoteValues = async () => {
      await delay(2000);
      return Promise.resolve({
        input1: 'a',
        input2: 'b',
      });
    };
    const wrapper = mount(
      <CreateForm fields={fields} submit={submit} mode="edit" remoteValues={remoteValues} />,
    );
    await delay(1000);
    wrapper.update();
    expect(wrapper.find('Spin').props().spinning).toEqual(true);

    await delay(2500);
    wrapper.update();
    expect(wrapper.find('Spin').props().spinning).toEqual(false);
  });

  it('createForm submit', async (done) => {
    const initialValues = {
      input1: 'input1',
      input2: 'input2',
      input3: 'input3',
    };
    const wrapper = mount(
      <CreateForm
        fields={fields}
        initialValues={initialValues}
        submit={{
          ...submit,
          converter: ({ data }) => {
            expect(data).toEqual(initialValues);
            done();
          },
        }}
      />,
    );
    await wrapper.find('button').first().simulate('click');
  });
});
