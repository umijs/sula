import React from 'react';
import { mount } from 'enzyme';
import { Form, Field } from '..';
import '../../__tests__/common';

const formMount = (fields) => {
  let formRef;
  const wrapper = mount(
    <Form
      ref={(ref) => {
        formRef = ref;
      }}
      fields={fields}
    />,
  );

  return {
    wrapper,
    formRef,
  };
};

describe('use form context', () => {
  describe('validate fields', () => {
    let formRef;
    let wrapper;

    beforeEach(() => {
      const { wrapper: validateWrapper, formRef: validateFormRef } = formMount([
        {
          name: 'input',
          label: 'input',
          field: 'input',
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
          name: 'noColllect',
          label: 'noCollect',
          field: 'input',
          collect: false,
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
          name: 'groupName2',
          container: 'div',
          initialVisible: false,
          fields: [
            {
              name: 'group2',
              label: 'group2',
              field: 'input',
            },
          ],
        },
      ]);

      wrapper = validateWrapper;
      formRef = validateFormRef;
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('validate fields error', (done) => {
      return formRef.validateFields().catch((error) => {
        // visible: false, collect: false, gorupVisible: false 不会校验
        expect(error.errorFields).toEqual([
          { errors: ['error'], name: ['input'] },
          { errors: ['error'], name: ['group'] },
        ]);
        done();
      });
    });

    it('validate fields success', async (done) => {
      await formRef.setFieldsValue({
        input: 'aaa',
        group: 'a',
      });
      wrapper.update();
      // 校验全部
      return formRef.validateFields(true).catch((error) => {
        expect(error.errorFields).toEqual([
          { errors: ['error'], name: ['hiddenInput'] },
          { errors: ['error'], name: ['noColllect'] },
        ]);
        done();
      });
    });

    it('validate nameList fields', async (done) => {
      await formRef.setFieldsValue({
        input: 'a',
        hiddenInput: 'a',
      });
      wrapper.update();
      // visible: false 和 collect: false不校验
      return formRef.validateFields(['input', 'hiddenInput']).then((res) => {
        expect(res).toEqual({ input: 'a' });
        done();
      });
    });

    it('validate group', async (done) => {
      await formRef.setFieldsValue({
        group: 'a',
      });
      wrapper.update();
      return formRef.validateGroupFields('groupName').then((res) => {
        expect(res).toEqual({ group: 'a' });
        done();
      });
    });
  });

  describe('control property', () => {
    it('field value', () => {
      const { wrapper, formRef } = formMount([
        {
          name: 'input',
          label: 'input',
          field: 'input',
        },
        {
          name: 'select',
          label: 'select',
          field: 'select',
          initialSource: [{ text: 'A', value: 'a' }],
          dependency: {
            value: {
              relates: [['input']],
              inputs: [['aaa']],
              output: ['a'],
              defaultOutput: null,
            },
          },
        },
      ]);

      formRef.setFieldValue('input', 'aaa');
      wrapper.update();
      expect(formRef.getFieldsValue()).toEqual({ input: 'aaa', select: ['a'] });
      expect(wrapper.find('.ant-input').first().props().value).toEqual('aaa');
      expect(wrapper.find('.ant-select-selection-item').text()).toEqual('A');

      formRef.resetFields();
      wrapper.update(); // resetFields后清空视图中表单值
      formRef.setFieldsValue({ input: 'aaa' });
      wrapper.update();
      expect(formRef.getFieldsValue()).toEqual({ input: 'aaa', select: ['a'] });
      expect(wrapper.find('.ant-input').first().props().value).toEqual('aaa');
      expect(wrapper.find('.ant-select-selection-item').text()).toEqual('A');

      formRef.resetFields();
      wrapper.update();
      formRef.setFields([
        {
          name: 'input',
          value: 'aaa',
          error: [],
        },
      ]);
      wrapper.update();
      expect(formRef.getFieldsValue()).toEqual({ input: 'aaa', select: ['a'] });
      expect(wrapper.find('.ant-input').first().props().value).toEqual('aaa');
      expect(wrapper.find('.ant-select-selection-item').text()).toEqual('A');
    });

    it('field source', () => {
      const { wrapper, formRef } = formMount([
        {
          name: 'select',
          label: 'select',
          field: 'select',
          initialSource: [{ text: 'A', value: 'a' }],
        },
      ]);
      expect(formRef.getFieldSource('select')).toEqual([{ text: 'A', value: 'a' }]);
      formRef.setFieldSource('select', [
        { text: 'A', value: 'a' },
        { text: 'B', value: 'b' },
      ]);
      expect(formRef.getFieldSource('select')).toEqual([
        { text: 'A', value: 'a' },
        { text: 'B', value: 'b' },
      ]);

      // store更新，检测视图是否变化
      wrapper.find('.ant-select-selector').simulate('mousedown');
      expect(wrapper.find('.ant-select-item-option').length).toBe(2);
    });

    it('field visible', () => {
      const { wrapper, formRef } = formMount([
        {
          name: 'input',
          label: 'input',
          field: 'input',
          initialVisible: false,
        },
      ]);

      const instance = wrapper.find(Field).first().instance();
      expect(instance.getVisible()).toEqual(false);
      formRef.setFieldVisible('input', true);
      expect(instance.getVisible()).toEqual(true);
    });

    it('field disabled', () => {
      const { wrapper, formRef } = formMount([
        {
          name: 'input',
          label: 'input',
          field: 'input',
          initialDisabled: true,
        },
      ]);
      expect(formRef.getFieldDisabled('input')).toEqual(true);
      expect(wrapper.find('input').props().disabled).toEqual(true);
      formRef.setFieldDisabled('input', false);
      wrapper.update();
      expect(formRef.getFieldDisabled('input')).toEqual(false);
      expect(wrapper.find('input').props().disabled).toEqual(false);
    });
  });
});
