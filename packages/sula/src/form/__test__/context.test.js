import React from 'react';
import { mount } from 'enzyme';
import Form, { Field } from '..';
import '../../__tests__/common';

describe('use form context', () => {
  let formRef;
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <Form
        ref={(ref) => {
          formRef = ref;
        }}
        fields={[
          {
            name: 'input',
            label: 'input',
            field: 'input',
            rules: [{ required: true, message: 'error' }],
          },
          {
            name: 'select',
            label: 'select',
            field: 'select',
            initialSource: [{ text: 'A', value: 'a' }],
            rules: [{ required: true, message: 'error' }],
            dependency: {
              value: {
                relates: ['input'],
                inputs: [['aaa']],
                output: 'a',
                defaultOutput: undefined,
              },
            },
          },
          {
            name: 'disabledInput',
            label: 'disabled',
            field: 'input',
            initialDisabled: true,
            rules: [{ required: true, message: 'error' }],
          },
          {
            name: 'hiddenInput',
            label: 'hidden',
            field: 'input',
            initialVisible: false,
            rules: [{ required: true, message: 'error' }],
          },
          {
            name: 'groupName',
            container: 'div',
            fields: [
              {
                name: 'group',
                label: 'group',
                field: 'input',
                rules: [{ required: true, message: 'error' }],
              },
            ],
          },
          {
            render: {
              type: 'button',
              props: {
                children: 'Btn',
              },
            },
          },
          {
            name: 'groupName2',
            container: 'div',
            initialVisible: false,
            fields: [
              {
                name: 'group2',
                label: 'group2',
                field: 'input',
                initialVisible: false,
              },
            ],
          },
        ]}
      />,
    );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('validate fields', () => {
    it('validate fields error', (done) => {
      return formRef.validateFields().catch((error) => {
        expect(error.errorFields).toEqual([
          { errors: ['error'], name: ['input'] },
          { errors: ['error'], name: ['select'] },
          { errors: ['error'], name: ['disabledInput'] },
          { errors: ['error'], name: ['group'] },
        ]);
        done();
      });
    });

    it('validate fields success', async (done) => {
      await formRef.setFieldsValue({
        input: 'aaa',
        select: 'a',
        disabledInput: 'a',
        hiddenInput: 'a',
        group: 'a',
      });
      wrapper.update();
      return formRef.validateFields(true).then((res) => {
        expect(res).toEqual({
          disabledInput: 'a',
          input: 'aaa',
          select: 'a',
          hiddenInput: 'a',
          group: 'a',
        });
        done();
      });
    });

    it('validate nameList fields', async (done) => {
      await formRef.setFieldsValue({
        input: 'a',
        select: 'a',
        disabledInput: 'a',
        hiddenInput: 'a',
      });
      wrapper.update();
      return formRef.validateFields(['input', 'hiddenInput']).then((res) => {
        expect(res).toEqual({ input: 'a' });
        done();
      });
    });

    it('validate group', async (done) => {
      await formRef.setFieldsValue({
        group: 'a',
      });
      await wrapper.update();
      return formRef.validateGroupFields('groupName').then((res) => {
        expect(res).toEqual({ group: 'a' });
        done();
      });
    });
  });

  describe('control property', () => {
    const getInstance = (idx = 0) => {
      return wrapper.find(Field).at(idx).instance();
    };
    it('getFieldSource', () => {
      expect(formRef.getFieldSource('select')).toEqual([{ text: 'A', value: 'a' }]);
    });
    it('setFieldVisible', () => {
      const instance = getInstance(3);
      expect(instance.getVisible()).toEqual(false);
      formRef.setFieldVisible('hiddenInput', true);
      expect(instance.getVisible()).toEqual(true);
    });
    it('getFieldDisabled', () => {
      expect(formRef.getFieldDisabled('disabledInput')).toEqual(true);
      formRef.setFieldDisabled('disabledInput', false);
      expect(formRef.getFieldDisabled('disabledInput')).toEqual(false);
    });
  });

  describe('setFields', () => {
    it('setFields', () => {
      formRef.setFields([
        {
          name: 'input',
          value: 'aaa',
          error: [],
        },
      ]);
      wrapper.update();
      expect(formRef.getFieldsValue()).toMatchObject({ input: 'aaa', select: 'a' });
    });
  });
});
