import React from 'react';
import { mount } from 'enzyme';
import { Form, Field } from '..';
import { delay } from '../../__tests__/common';

describe('field', () => {
  describe('field', () => {
    it('willmount', () => {
      const wrapper = mount(
        <Form>
          <Field name="test" label="test" field="input" />
        </Form>,
      );
      const willUnmount = jest.spyOn(wrapper.find(Field).instance(), 'componentWillUnmount');
      wrapper.unmount();
      expect(willUnmount).toHaveBeenCalled();
    });

    it('value and source change', async () => {
      let formRef;
      const wrapper = mount(
        <Form
          ref={(ref) => {
            formRef = ref;
          }}
        >
          <Field name="input" label="input" field="input" dependency={{}} />
          <Field
            name="select"
            label="select"
            field="select"
            remoteSource={{
              url: '/source.json',
              method: 'post',
            }}
            dependency={{
              source: {
                relates: ['input'],
                inputs: [['a']],
                output: [{ text: 'b', value: 'b' }],
                defaultOutput: [{ text: 'a', value: 'a' }],
              },
            }}
          />
        </Form>,
      );

      await delay(1000);
      await formRef.setFieldValue('input', 'a');
      await delay(1000);
      expect(formRef.getFieldsValue()).toEqual({ input: 'a' });
      wrapper.update();
      const instance = wrapper.find(Field).last().instance();
      expect(instance.getSource()).toEqual([{ text: 'b', value: 'b' }]);

      expect(wrapper.render()).toMatchSnapshot();
    });

    it('basic layout', async () => {
      let formRef;
      const wrapper = mount(
        <Form
          initialValues={{
            input: 'a',
          }}
          ref={(ref) => {
            formRef = ref;
          }}
        >
          <Field name="input" label="input" field="input" dependency={{}} />
          <Field
            name="select"
            label="select"
            field="select"
            itemLayout={{
              span: 24,
            }}
            dependency={{
              visible: {
                relates: ['input'],
                inputs: [['hidden']],
                output: false,
                defaultOutput: true,
              },
            }}
          />
        </Form>,
      );
      await formRef.setFieldValue('input', 'hidden');
      await delay(1000);
      wrapper.update();
      const instance = wrapper.find(Field).last().instance();
      expect(instance.getVisible()).toEqual(false);
    });
  });
});
