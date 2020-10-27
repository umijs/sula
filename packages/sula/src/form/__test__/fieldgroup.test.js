import React from 'react';
import { mount } from 'enzyme';
import { Form, FieldGroup, Field, FormAction } from '..';
import '../../__tests__/common';

function fieldGroupMount(props) {
  const wrapper = mount(
    <Form>
      <FieldGroup {...props} />
    </Form>,
  );
  return wrapper;
}

describe('fieldgroup', () => {
  describe('fieldgroup instance', () => {
    it('fieldgroup name', () => {
      const wrapper = fieldGroupMount({
        name: 'group1',
        fields: [{ name: 'input', label: 'input', field: 'input' }],
      });
      const instance = wrapper.find('FieldGroup').instance();
      expect(instance.getGroupName()).toEqual('group1');
      expect(instance.getName()).toEqual(['group1']);
    });

    it('fieldgroup visible ', () => {
      const wrapper = fieldGroupMount({
        fields: [{ name: 'input', label: 'input', field: 'input' }],
      });

      const instance = wrapper.find('FieldGroup').instance();
      expect(instance.getVisible()).toEqual(true);

      instance.setVisible(false);
      wrapper.update();
      expect(instance.getVisible()).toEqual(false);
      expect(wrapper).not.toBeNull();
    });
  });

  describe('fieldgroup container', () => {
    it('default container', () => {
      const wrapper = fieldGroupMount({
        fields: [{ name: 'input', label: 'input', field: 'input' }],
        className: 'sula-field-group-wrapper',
      });
      // fragment fieldgroup子组件为Field
      expect(wrapper.find('.sula-field-group-wrapper').childAt(0).type()).toEqual(Field);
    });

    it('default container with dependency', () => {
      const wrapper = fieldGroupMount({
        fields: [{ name: 'input', label: 'input', field: 'input' }],
        className: 'sula-field-group-wrapper',
        dependency: {
          visible: {
            relates: ['input'],
            inputs: [['hidden']],
            output: false,
            defaultOutput: true,
          },
        },
      });

      expect(wrapper.find('.sula-field-group-wrapper').childAt(0).type()).toEqual('div');
      wrapper.find('FieldGroup').instance().setVisible(false);
      wrapper.update();
      expect(wrapper.find('div').first().props().style.display).toEqual('none');
    });

    it('container', () => {
      const wrapper = fieldGroupMount({
        fields: [{ name: 'input', label: 'input', field: 'input' }],
        container: {
          type: 'card',
          props: {
            title: 'Title',
          },
        },
      });
      expect(wrapper.find('FieldGroup').find('Card').length).toBeTruthy();
    });
  });

  describe('fieldgroup fields', () => {
    it('fields', () => {
      const wrapper = fieldGroupMount({
        fields: [
          {
            container: 'div',
            fields: [{ name: 'input', label: 'input', field: 'input' }],
          },
        ],
      });
      expect(wrapper.find('input').length).toBeTruthy();
    });

    it('render', () => {
      const wrapper = fieldGroupMount({
        fields: [
          {
            render: {
              type: 'button',
              props: {
                children: 'btn',
              },
            },
          },
        ],
      });
      expect(wrapper.find('button').length).toBeTruthy();
    });

    it('children', () => {
      const wrapper = fieldGroupMount({
        children: <Field name="input" label="input" field="input" />,
      });
      expect(wrapper.find('input').length).toBeTruthy();
    });

    it('actionsRender', () => {
      const wrapper = fieldGroupMount({
        fields: [
          {
            container: 'div',
            fields: [{ name: 'input', label: 'input', field: 'input' }],
          },
        ],
        actionsRender: {
          type: 'button',
          props: {
            children: 'btn',
          },
        },
      });

      expect(wrapper.find('input').length).toBeTruthy();
      expect(wrapper.find('button').length).toBeTruthy();
    });
  });

  describe('fieldgroup layout', () => {
    it('span !== 24', () => {
      const wrapper = mount(
        <Form itemLayout={{ span: 12 }}>
          <FieldGroup itemLayout={{ span: 6 }}>
            <Field name="input" label="input" field="input" />
          </FieldGroup>
          <FieldGroup className="fieldgroup-1">
            <Field name="input2" label="input2" field="input" />
            <FieldGroup>
              <Field name="input2-1" label="input2" field="input" />
            </FieldGroup>
            <FieldGroup>
              <Field name="input2-2" label="input2" field="input" />
            </FieldGroup>
            <FieldGroup
              actionsRender={{ type: 'button', props: { children: 'btn' } }}
              actionsPosition="default"
            />
            <FieldGroup>
              <FormAction
                actionsRender={{ type: 'button', props: { children: 'btn' } }}
                actionsPosition="center"
              />
            </FieldGroup>
          </FieldGroup>
          <div>
            <Field name="input3" label="input2" field="input" />
          </div>
        </Form>,
      );

      expect(wrapper.find('.fieldgroup-1').children().length).toEqual(6);
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('willmount', () => {
    const wrapper = fieldGroupMount();
    const willUnmount = jest.spyOn(wrapper.find('FieldGroup').instance(), 'componentWillUnmount');
    wrapper.unmount();
    expect(willUnmount).toHaveBeenCalled();
  });
});
