import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Form, { Field } from '..';
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
    it('get value', async () => {
      let formRef;
      const form = (
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
        </Form>
      );

      expect(renderer.create(form).toJSON()).toMatchSnapshot();
      await formRef.setFieldValue('input', 'a');
      await delay(1000);
      expect(formRef.getFieldsValue()).toEqual({ input: 'a' });
      const wrapper = mount(form);
      wrapper.update();
      const instance = wrapper.find(Field).last().instance();
      expect(instance.getSource()).toEqual([{ text: 'b', value: 'b' }]);
      expect(instance.getVisible()).toEqual(undefined);
    });
  });
});
