import React from 'react';
import { mount } from 'enzyme';
import { Form } from '..';
import { delay } from '../../__tests__/common';

function formMount(props = {}) {
  let formRef;
  const { fields = [], ...restProps } = props;
  const wrapper = mount(
    <Form
      ref={(ref) => {
        formRef = ref;
      }}
      fields={[
        {
          name: 'users',
          label: 'Users',
          isList: true,
          field: {
            type: 'editable',
            props: {
              fields: [{ name: 'province', label: 'Province', width: 200, field: 'input' }],
            },
          },
        },
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
        ...fields,
      ]}
      {...restProps}
    />,
  );
  return {
    wrapper,
    formRef,
  };
}

describe('form', () => {
  describe('form  props', () => {
    it('form render ctx', () => {
      const fieldFn = jest.fn(() => <input />);
      const renderFn = jest.fn(() => <button type="button">click</button>);
      formMount({
        fields: [
          { name: 'field', label: 'field', field: fieldFn },
          {
            render: renderFn,
          },
        ],
      });

      expect(fieldFn.mock.calls[0][0].form).not.toBeNull();
      expect(renderFn.mock.calls[0][0].form).not.toBeNull();
    });

    it('onValueChange cascade', () => {
      const onValuesChange = jest.fn();
      const { wrapper, formRef } = formMount({
        fields: [{ name: 'input3', label: 'input3', field: 'input' }],
        initialValues: { input3: 'ccc' },
        onValuesChange,
      });

      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: 'a' } });

      wrapper.find('button').at(0).simulate('click');
      wrapper.update();
      expect(formRef.getFieldsValue()).toEqual({
        input: 'a',
        input2: 'aaa',
        input3: 'ccc',
        users: [{ province: undefined }],
      });
      expect(onValuesChange).toHaveBeenCalledWith({ input: 'a' }, { input: 'a', input3: 'ccc' });
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('remoteValues', async () => {
      const startFn = jest.fn();
      const endFn = jest.fn();
      const { wrapper, formRef } = formMount({
        mode: 'edit',
        remoteValues: {
          url: '/manage.json',
          method: 'post',
        },
        onRemoteValuesStart: startFn,
        onRemoteValuesEnd: endFn,
      });

      await delay(1000);
      wrapper.update();
      expect(startFn).toHaveBeenCalled();
      expect(endFn).toHaveBeenCalled();
      expect(formRef.getFieldsValue()).toEqual({ input: 'a', input2: 'aaa' });
      expect(wrapper.find('input').first().props().value).toEqual('a');
      expect(wrapper.find('input').at(1).props().value).toEqual('aaa');

      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: 'x' } });
      wrapper.update();
      expect(formRef.getFieldsValue()).toEqual({ input: 'x', input2: 'xxx' });
      expect(wrapper.find('input').first().props().value).toEqual('x');
      expect(wrapper.find('input').at(1).props().value).toEqual('xxx');
    });

    it('remoteValues Error', async () => {
      const startFn = jest.fn();
      const endFn = jest.fn();
      const { wrapper, formRef } = formMount({
        mode: 'edit',
        remoteValues: {
          url: '/error.json', // 模拟请求报错
          method: 'post',
        },
        onRemoteValuesStart: startFn,
        onRemoteValuesEnd: endFn,
      });

      await delay(1000);
      wrapper.update();
      expect(formRef.getFieldsValue()).toEqual({ input: undefined, input2: undefined });
      expect(startFn).toHaveBeenCalled();
      expect(endFn).toHaveBeenCalled();
    });
  });

  describe('form mode', () => {
    it('create', async () => {
      const { formRef } = formMount({
        remoteValues: {
          url: '/manage.json',
          method: 'post',
        },
        mode: 'create',
      });

      await delay(1000);
      // create模式下无请求值
      expect(formRef.getFieldsValue()).toEqual({ input: undefined, input2: undefined });
    });

    it('edit', async () => {
      const { wrapper, formRef } = formMount({
        remoteValues: {
          url: '/manage.json',
          method: 'post',
        },
        mode: 'edit',
      });

      await delay(1000);
      wrapper.update();
      expect(formRef.getFieldsValue()).toEqual({ input: 'a', input2: 'aaa' });
      expect(wrapper.find('input').first().props().value).toEqual('a');
      expect(wrapper.find('input').last().props().value).toEqual('aaa');
    });

    it('view', async () => {
      const { wrapper, formRef } = formMount({
        remoteValues: {
          url: '/manage.json',
          method: 'post',
        },
        mode: 'view',
      });

      await delay(1000);
      wrapper.update();
      // view模式下 disabled
      expect(formRef.getFieldsValue()).toEqual({ input: 'a', input2: 'aaa' });
      expect(wrapper.find('input').first().props().value).toEqual('a');
      expect(wrapper.find('input').first().props().disabled).toEqual(true);
      expect(wrapper.find('input').last().props().value).toEqual('aaa');
      expect(wrapper.find('input').last().props().disabled).toEqual(true);
    });
  });

  describe('form container', () => {
    it('container', () => {
      const { wrapper } = formMount({
        container: {
          type: 'card',
          props: {
            title: 'Title',
          },
        },
      });
      expect(wrapper.find('Card').children().find('input').length).toEqual(2);
    });
  });

  describe('form size', () => {
    it('size small', () => {
      const { wrapper } = formMount({
        size: 'small',
      });
      expect(wrapper.find('.ant-input-sm').length).toEqual(2);
    });
  });

  describe('form layout', () => {
    function colsMount(cols) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: true,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      const wrapper = mount(
        <Form
          itemLayout={{
            cols,
          }}
          fields={[
            {
              name: 'input1',
              label: 'input1',
              field: 'input',
            },
            {
              name: 'input2',
              label: 'input2',
              field: 'input',
            },
            {
              name: 'input3',
              label: 'input3',
              field: 'input',
            },
            {
              name: 'input4',
              label: 'input4',
              field: 'input',
            },
            {
              name: 'input5',
              label: 'input5',
              field: 'input',
            },
            {
              name: 'input6',
              label: 'input6',
              field: 'input',
            },
          ]}
        />,
      );
      return wrapper;
    }

    it('cols', () => {
      const wrapper = colsMount({
        xxl: 4,
        xl: 3,
        lg: 2,
        md: 2,
        sm: 1,
        xs: 1,
      });
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('cols span', () => {
      const wrapper = colsMount(3);
      expect(wrapper.find('Col').first().props().span).toEqual(8);
      wrapper.unmount();

      const wrapper2 = colsMount(2);
      expect(wrapper2.find('Col').first().props().span).toEqual(12);
      wrapper2.unmount();
    });
  });

  describe('dynamic form', () => {
    it('should not error', () => {
      const fn = jest.fn();
      class DynamicForm extends React.Component {
        state = {
          templates: [
            {
              name: 'input1',
              label: 'input1',
              field: {
                type: 'input',
                props: {
                  className: 'defaultInput',
                },
              },
            },
          ],
        };
        componentDidMount() {}
        render() {
          const { templates } = this.state;
          return (
            <div>
              <button
                className="changeBtn"
                onClick={() => {
                  this.setState({
                    templates: [
                      {
                        name: 'input2',
                        label: 'input2',
                        field: {
                          type: 'input',
                          props: {
                            className: 'changedInput',
                          },
                        },
                      },
                    ],
                  });
                }}
              >
                change
              </button>
              <Form
                fields={[
                  ...templates,
                  {
                    render: {
                      type: 'button',
                      props: {
                        children: 'getValues',
                        className: 'getValuesBtn',
                      },
                      action: (ctx) => {
                        const values = ctx.form.getFieldsValue();
                        fn(values);
                      },
                    },
                  },
                ]}
              />
            </div>
          );
        }
      }

      const wrapper = mount(<DynamicForm />);
      wrapper.find('.getValuesBtn').first().simulate('click');
      expect(fn.mock.calls[0][0]).toEqual({ input1: undefined });

      wrapper.find('.changeBtn').first().simulate('click');
      wrapper.find('.getValuesBtn').first().simulate('click');
      expect(fn.mock.calls[1][0]).toEqual({ input2: undefined });

      expect(wrapper.find('.defaultInput').length).toBeFalsy();
      expect(wrapper.find('.changedInput').length).toBeTruthy();
    });
  });

  describe('dependency scenes', () => {
    it('field_2 value clear while field_1 cleared', async () => {
      let formRef;
      const wrapper = mount(
        <Form
          ref={(ref) => {
            formRef = ref;
          }}
          initialValues={{
            a: {
              x: 'customize',
            },
            b: '123',
          }}
          fields={[
            {
              name: ['a', 'x'],
              label: 'field_1',
              field: 'input',
            },
            {
              name: 'b',
              label: 'field_2',
              field: 'input',
              dependency: {
                value: {
                  relates: [['a', 'x']],
                  inputs: ['*'],
                  output: 'abc',
                  ignores: [['', 'customize']],
                  defaultOutput: '',
                },
                disabled: {
                  relates: [['a', 'x']],
                  inputs: ['*'],
                  output: true,
                  ignores: [['', 'customize']],
                  defaultOutput: false,
                },
              },
            },
          ]}
        />,
      );

      await delay(100);
      expect(formRef.getFieldDisabled('b')).toBeFalsy();

      wrapper
        .find('input')
        .first()
        .simulate('change', { target: { value: 'a' } });
      await delay(100);

      expect(formRef.getFieldDisabled('b')).toBeTruthy();
      expect(formRef.getFieldValue('b')).toEqual('abc');
      expect(wrapper.find('input').last().props().value).toEqual('abc');

      wrapper
        .find('input')
        .first()
        .simulate('change', { target: { value: '' } });
      await delay(100);
      expect(formRef.getFieldDisabled('b')).toBeFalsy();
      expect(formRef.getFieldValue('b')).toEqual('');
      expect(wrapper.find('input').last().props().value).toEqual('');

      wrapper
        .find('input')
        .first()
        .simulate('change', { target: { value: 'customize' } });
      await delay(100);
      expect(formRef.getFieldDisabled('b')).toBeFalsy();
      expect(formRef.getFieldValue('b')).toEqual('');
      expect(wrapper.find('input').first().props().value).toEqual('customize');
      expect(wrapper.find('input').last().props().value).toEqual('');
    });

    it('CNY and USD conversion', () => {
      let formRef = null;
      const onValuesChange = (values) => {
        const changeKey = Object.keys(values)[0];
        if (changeKey === 'usd') {
          formRef.setFieldValue('cny', values[changeKey] * 7);
        } else if (changeKey === 'cny') {
          formRef.setFieldValue('usd', values[changeKey] / 7);
        }
      };
      const wrapper = mount(
        <Form
          ref={(ref) => {
            formRef = ref;
          }}
          fields={[
            {
              name: 'cny',
              label: 'CNY',
              field: 'input',
            },
            {
              name: 'usd',
              label: 'USD',
              field: 'input',
            },
          ]}
          onValuesChange={onValuesChange}
        />,
      );

      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: 7 } });
      expect(formRef?.getFieldsValue()).toEqual({ cny: 7, usd: 1 });
      expect(wrapper.find('input').first().props().value).toEqual(7);
      expect(wrapper.find('input').last().props().value).toEqual(1);

      wrapper
        .find('input')
        .at(1)
        .simulate('change', { target: { value: 2 } });
      expect(formRef?.getFieldsValue()).toEqual({ cny: 14, usd: 2 });
      expect(wrapper.find('input').first().props().value).toEqual(14);
      expect(wrapper.find('input').last().props().value).toEqual(2);
    });

    it('container dependency', () => {
      const wrapper = mount(
        <Form
          fields={[
            {
              name: 'name',
              label: 'name',
              field: {
                type: 'input',
                props: {
                  className: 'input-test',
                },
              },
            },
            {
              container: {
                type: 'card',
                props: {
                  title: 'card',
                  className: 'container-card',
                },
              },
              initialVisible: false,
              dependency: {
                visible: {
                  relates: ['name'],
                  inputs: [['a']],
                  output: true,
                  defaultOutput: false,
                },
              },
              fields: [
                {
                  name: 'others',
                  label: 'others',
                  field: 'input',
                },
              ],
            },
          ]}
        />,
      );

      expect(wrapper.find('.container-card').first().props().style.display).toEqual('none');
      wrapper
        .find('.input-test')
        .at(0)
        .simulate('change', { target: { value: 'a' } });

      expect(wrapper.find('.container-card').first().props().style.display).toEqual('');
      wrapper
        .find('.input-test')
        .at(0)
        .simulate('change', { target: { value: 'aa' } });

      expect(wrapper.find('.container-card').first().props().style.display).toEqual('none');
    });

    it('combination dependency', () => {
      const wrapper = mount(
        <Form
          fields={[
            {
              name: 'name',
              label: 'name',
              field: {
                type: 'input',
              },
            },
            {
              name: 'age',
              label: 'age',
              field: 'input',
            },
            {
              name: 'others',
              label: 'others',
              field: 'input',
              className: 'input-others',
              initialVisible: false,
              dependency: {
                visible: {
                  relates: ['name', 'age'],
                  inputs: [['a'], ['b']],
                  output: true,
                  defaultOutput: false,
                },
              },
            },
          ]}
        />,
      );

      expect(wrapper.find('.input-others').last().props().style.display).toEqual('none');

      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: 'a' } });
      wrapper
        .find('input')
        .at(1)
        .simulate('change', { target: { value: 'b' } });

      expect(wrapper.find('.input-others').last().props().style.display).toEqual('');
      wrapper
        .find('input')
        .at(1)
        .simulate('change', { target: { value: 'bb' } });

      expect(wrapper.find('.input-others').last().props().style.display).toEqual('none');
    });
  });
});
