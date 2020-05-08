import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Form from '..';
import { delay } from '../../__tests__/common';

describe('form', () => {
  describe('form props', () => {
    it('onValueChange cascade', async () => {
      let formRef;
      const onValuesChange = jest.fn();
      const form = (
        <Form
          ref={(ref) => {
            formRef = ref;
          }}
          onValuesChange={onValuesChange}
          fields={[
            { name: 'input', label: 'input', field: 'input' },
            {
              name: 'input2',
              label: 'inpt2',
              field: 'input',
              dependency: {
                value: {
                  relates: ['input'],
                  inputs: [['a']],
                  output: 'aaa',
                  defaultOutput: 'xxx',
                },
              },
            },
          ]}
        />
      );

      const wrapper = mount(form);
      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: 'a' } });
      await wrapper.update();
      expect(formRef.getFieldsValue()).toEqual({ input: 'a', input2: 'aaa' });
      expect(onValuesChange).toHaveBeenCalled();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('remoteValues', async () => {
      let formRef;
      const form = (
        <Form
          ref={(ref) => {
            formRef = ref;
          }}
          remoteValues={{
            url: '/manage.json',
            method: 'post',
          }}
          fields={[
            { name: 'input', label: 'input', field: 'input' },
            {
              name: 'input2',
              label: 'inpt2',
              field: 'input',
              dependency: {
                value: {
                  relates: ['input'],
                  inputs: [['a']],
                  output: 'aaa',
                  defaultOutput: 'xxx',
                },
              },
            },
          ]}
        />
      );

      const wrapper = mount(form);
      await delay(1000);
      expect(formRef.getFieldsValue()).toEqual({ input: 'a', input2: 'aaa' });
      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: 'x' } });
      wrapper.update();
      expect(formRef.getFieldsValue()).toEqual({ input: 'x', input2: 'xxx' });
    });

    it('remoteValues Error', async () => {
      let formRef;
      const form = (
        <Form
          ref={(ref) => {
            formRef = ref;
          }}
          remoteValues={{
            url: '/error.json', // 模拟请求报错
            method: 'post',
          }}
          fields={[
            { name: 'input', label: 'input', field: 'input' },
            {
              name: 'input2',
              label: 'inpt2',
              field: 'input',
              dependency: {
                value: {
                  relates: ['input'],
                  inputs: [['a']],
                  output: 'aaa',
                  defaultOutput: 'xxx',
                },
              },
            },
          ]}
        />
      );

      const wrapper = mount(form);
      await delay(1000);
      expect(formRef.getFieldsValue()).toEqual({ input: undefined, input2: undefined });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('children container', () => {
    it('children container', () => {
      let formRef;
      const form = (
        <Form
          ref={(ref) => {
            formRef = ref;
          }}
          fields={[
            {
              label: 'Inputgroup',
              childrenContainer: {
                type: 'inputgroup',
                props: {
                  compact: true,
                },
              },
              children: [
                {
                  name: 'input1',
                  field: {
                    type: 'input',
                    props: {
                      style: { width: '50%' },
                    },
                  },
                },
                {
                  name: 'input2',
                  field: {
                    type: 'input',
                    props: {
                      style: { width: '50%' },
                    },
                  },
                },
              ],
            },
            {
              label: 'childrenbtn',
              childrenContainer: 'div',
              children: [
                {
                  label: 'btn1',
                  render: {
                    type: 'button',
                    props: {
                      children: 'button1',
                    },
                  },
                },
                {
                  label: 'btn2',
                  render: {
                    type: 'button',
                    props: {
                      children: 'button2',
                    },
                  },
                },
              ],
            },
          ]}
        />
      );

      expect(renderer.create(form).toJSON()).toMatchSnapshot();
    });
  });
});
