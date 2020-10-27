import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Form, Field } from '..';
import { delay } from '../../__tests__/common';

function fieldMount(props = {}) {
  return mount(
    <Form>
      <Field name="test" label="test" field="input" {...props} />
    </Form>,
  );
}

describe('field', () => {
  describe('field instance', () => {
    it('filed name will toArray', () => {
      const wrapper = mount(
        <Form>
          <Field name="name" label="withName" field="input" />
          <Field label="noName" field="input" />
        </Form>,
      );
      expect(wrapper.find('Field').first().instance().getName()).toEqual(['name']);
      expect(wrapper.find('Field').last().instance().getName()).toEqual(undefined);
      wrapper.unmount();
    });

    describe('field source', () => {
      it('init field source', () => {
        const wrapper = fieldMount({ field: 'select', initialSource: [{ text: 'a', value: 'a' }] });
        const instance = wrapper.find('Field').first().instance();
        expect(instance.getSource()).toEqual([{ text: 'a', value: 'a' }]);
        instance.setSource([{ text: 'b', value: 'b' }]);
        wrapper.update();
        expect(instance.getSource()).toEqual([{ text: 'b', value: 'b' }]);
      });

      it('remote field source', async () => {
        const wrapper = fieldMount({ field: 'select', remoteSource: { url: '/source.json' } });
        await delay(1000);
        const instance = wrapper.find('Field').first().instance();
        expect(instance.getSource()).toEqual([{ text: 'a', value: 'a' }]);
      });
    });

    it('field disabled', () => {
      const wrapper = fieldMount({ initialDisabled: true });

      const instance = wrapper.find('Field').first().instance();
      expect(instance.getDisabled()).toEqual(true);
      expect(wrapper.find('input').props().disabled).toEqual(true);

      instance.setDisabled(false);
      wrapper.update();
      expect(instance.getDisabled()).toEqual(false);
      expect(wrapper.find('input').props().disabled).toEqual(false);
    });

    describe('field visible', () => {
      it('instance', () => {
        const wrapper = fieldMount({ initialVisible: false });
        const instance = wrapper.find('Field').first().instance();
        expect(instance.getVisible()).toEqual(false);
        // 没有级联时 visible生效
        expect(wrapper.find('FormItem').props().style.display).toEqual('none');
      });

      it("col's visible will be false while span not 24", () => {
        const wrapper = fieldMount({ itemLayout: { span: 6 }, initialVisible: false });
        expect(wrapper.find('Col').first().props().style.display).toEqual('none');
        wrapper.find('Field').first().instance().setVisible(true);
        wrapper.update();
        expect(wrapper.find('Col').first().props().style.display).not.toEqual('none');
      });
    });

    describe('field collect', () => {
      it('field collect', () => {
        const wrapper = fieldMount({ collect: false });
        const instance = wrapper.find('Field').first().instance();
        expect(instance.getCollect()).toEqual(false);
      });

      it('field collect default true', () => {
        const wrapper = fieldMount();
        const instance = wrapper.find('Field').first().instance();
        expect(instance.getCollect()).toEqual(true);
      });
    });
  });

  describe('field layout', () => {
    it('validate element children', () => {
      const wrapper = mount(
        <Form>
          <Field>
            <input />
          </Field>
        </Form>,
      );
      expect(wrapper.find('input').length).toBeTruthy();
    });

    it('config children', () => {
      const wrapper = fieldMount({
        children: [
          {
            name: 'child-1',
            field: 'input',
          },
          {
            name: 'child-2',
            field: 'input',
          },
        ],
      });
      expect(wrapper.find('input').length).toBe(2);
    });

    it('config children', () => {
      const wrapper = fieldMount({
        children: [
          {
            name: 'child-1',
            field: 'input',
          },
          {
            name: 'child-2',
            field: 'input',
          },
          {
            render: {
              type: 'button',
              props: {
                children: 'btn',
                className: 'sula-field-children-btn',
              },
            },
          },
        ],
        childrenContainer: {
          type: 'div',
          props: {
            className: 'sula-field-children-wrapper',
          },
        },
      });
      expect(wrapper.find('.sula-field-children-btn').length).toBeTruthy();
      expect(wrapper.find('.sula-field-children-wrapper').find('input').length).toBe(2);
    });

    it('default span', () => {
      const wrapper = fieldMount({ itemLayout: { span: 12, offset: 1 } });
      const colProps = wrapper.find('Col').first().props();
      expect(colProps.span).toEqual(12);
      expect(colProps.offset).toEqual(1);
    });

    it('span 24', () => {
      const wrapper = fieldMount({
        itemLayout: { span: 24 },
        dependency: {
          visible: {
            relates: ['input'],
            inputs: [['hidden']],
            output: false,
            defaultOutput: true,
          },
        },
      });

      expect(wrapper.find('FormItem').props().style.display).not.toEqual('none');
      wrapper.find('Field').first().instance().setVisible(false);
      wrapper.update();
      expect(wrapper.find('FormItem').props().style.display).toEqual('none');
    });
  });

  describe('validator plugin', () => {
    const validatorMount = (validator) => {
      let formRef;
      const wrapper = mount(
        <Form
          ref={(ref) => {
            formRef = ref;
          }}
        >
          <Field
            name="test"
            label="test"
            field="input"
            rules={[
              {
                validator,
              },
            ]}
          />
        </Form>,
      );

      return { formRef, wrapper };
    };

    it('validator ctx', async () => {
      const fn = jest.fn(() => Promise.resolve());
      const { formRef, wrapper } = validatorMount(fn);
      wrapper
        .find('input')
        .first()
        .simulate('change', { target: { value: '1' } });

      await delay(1000);

      const { name, value, form } = fn.mock.calls[0][0];
      expect(name).toEqual('test');
      expect(value).toEqual('1');
      expect(form).not.toBeNull();

      expect(formRef.getFieldError('test').length).toBeFalsy();
    });

    it('validator error', async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      const fn = jest.fn(() => Promise.reject('value can not be 1'));
      const { formRef, wrapper } = validatorMount(fn);

      wrapper
        .find('input')
        .first()
        .simulate('change', { target: { value: '1' } });

      await act(async () => {
        await delay(1000);
      });
      expect(formRef.getFieldError('test')).toEqual(['value can not be 1']);
    });
  });

  describe('other', () => {
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
  });
});
