import React from 'react';
import { mount } from 'enzyme';
import { Form } from '..';
import { delay } from '../../__tests__/common';

function formMount(props = {}) {
  let formRef;
  const wrapper = mount(
    <Form
      {...props}
      ref={(ref) => {
        formRef = ref;
      }}
      layout="vertical"
      fields={[
        { name: 'username', label: '姓名', field: 'input' },
        {
          name: 'users',
          label: '动态信息',
          isList: true,
          type: 'dynamicdepfieldcomp',
          props: {
            fields: [
              {
                name: 'first',
                rules: [{ required: true, message: 'Missing first name' }],
                field: {
                  type: 'input',
                  props: {
                    className: 'input-test',
                  },
                },
              },
              {
                name: 'last',
                rules: [{ required: true, message: 'Missing last name' }],
                field: 'input',
                dependency: {
                  value: {
                    relates: ['first'],
                    inputs: [['95']],
                    output: '27',
                    defaultOutput: '98',
                  },
                },
              },
            ],
          },
        },
      ]}
    />,
  );
  return {
    wrapper,
    formRef,
  };
}

describe('form', () => {
  describe('form  props', () => {
    it('input number', () => {
      const { wrapper } = formMount({});

      let input = wrapper.find('input');
      let button = wrapper.find('button');
      expect(input.length).toEqual(1);
      expect(button.length).toEqual(1);
      expect(wrapper.render()).toMatchSnapshot();

      button.first().simulate('click');
      wrapper.update();

      expect(wrapper.find('input').length > 1).toBeTruthy();
    });

    it('values', async () => {
      const { wrapper, formRef } = formMount({});

      const button = wrapper.find('button');
      button.first().simulate('click');
      expect(formRef.getFieldsValue().users.length).toEqual(1);
      expect(formRef.getFieldsValue().users[0]).toEqual({ first: undefined, last: undefined });
      await delay(0);

      wrapper
        .find('.input-test')
        .at(0)
        .simulate('change', { target: { value: '9' } });

      expect(formRef.getFieldsValue().users[0].last).toEqual('98');

      wrapper
        .find('.input-test')
        .at(0)
        .simulate('change', { target: { value: '95' } });

      expect(formRef.getFieldsValue().users[0].last).toEqual('27');

      wrapper.update();
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('onValuesChange', async () => {
      const onValuesChange = jest.fn();
      const { wrapper, formRef } = formMount({
        onValuesChange,
      });

      wrapper.find('button').last().simulate('click');

      expect(onValuesChange).not.toHaveBeenCalled();
      await delay(0);

      expect(onValuesChange).toHaveBeenCalled();
      expect(onValuesChange).toHaveBeenCalledWith(
        { users: [undefined] },
        { username: undefined, users: [undefined] },
      );

      wrapper.find('button').last().simulate('click');
      await delay(0);

      expect(onValuesChange).toHaveBeenCalledWith(
        { users: [undefined, undefined] },
        { username: undefined, users: [undefined, undefined] },
      );

      wrapper
        .find('.input-test')
        .at(0)
        .simulate('change', { target: { value: '9' } });

      expect(onValuesChange).toHaveBeenCalledWith(
        { users: [{ first: '9' }] },
        { username: undefined, users: [{ first: '9' }, undefined] },
      );

      const delIcon = wrapper.find('.anticon-minus-circle').at(0);

      delIcon.simulate('click');
      await delay(0);

      expect(formRef.getFieldsValue()).toEqual(
        { username: undefined, users: [{ first: undefined, last: undefined }] },
      );

      expect(wrapper.render()).toMatchSnapshot();
    });
  });
});
