import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { Form, FieldGroup, Field } from '..';
import '../../__tests__/common';


describe('fieldgroup', () => {
  it('dependency', () => {
    const form = (
      <Form
        fields={[
          {
            name: 'group1',
            fields: [
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
            ],
          },
          {
            name: 'group2',
            dependency: {
              visible: {
                relates: ['input1'],
                inputs: [['hidden']],
                output: false,
                defaultOutput: true,
              },
            },
            fields: [
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
            ],
          },
          {
            dependency: {
              visible: {
                relates: ['input1'],
                inputs: [['hidden']],
                output: false,
                defaultOutput: true,
              },
            },
            fields: [
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
            ],
          },
        ]}
      />
    );

    const wrapper = mount(form);
    wrapper
      .find('input')
      .first()
      .simulate('change', { target: { value: 'hidden' } });

    const getFieldGroupInstance = (idx = 0) => wrapper.find(FieldGroup).at(idx).instance();

    expect(getFieldGroupInstance(1).visible).toEqual(true);
    expect(getFieldGroupInstance(2).visible).toEqual(false);
    expect(getFieldGroupInstance(3).visible).toEqual(false);
  });

  it('actions', () => {
    const form = (
      <Form
        fields={[
          {
            name: 'group1',
            fields: [
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
            ],
          },
          {
            name: 'group2',
            actionsRender: [
              {
                type: 'button',
                props: {
                  children: 'Btn',
                },
              },
            ],
            fields: [
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
                name: 'group2-1',
                fields: [
                  {
                    name: 'input5',
                    label: 'input5',
                    field: 'input',
                  },
                ],
              },
            ],
          },
        ]}
      />
    );

    const wrapper = renderer.create(form).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it('component fieldgroup', () => {
    const form = (
      <Form itemLayout={{ span: 12 }}>
        <FieldGroup>
          <Field name="input" label="input" field="input" initialVisible={false} />
        </FieldGroup>
        <FieldGroup>
          <Field name="input2" label="input2" field="input" />
          <FieldGroup>
            <Field name="input2-1" label="input2" field="input" />
          </FieldGroup>
          <FieldGroup itemLayout={{ span: 6 }}>
            <Field name="input2-2" label="input2" field="input" />
          </FieldGroup>
          <FieldGroup
            actionsRender={{ type: 'button', props: { children: 'btn' } }}
            actionsPosition="default"
          />
          <FieldGroup
            actionsRender={{ type: 'button', props: { children: 'btn' } }}
            actionsPosition="center"
          />
        </FieldGroup>
        <div>
          <Field name="input3" label="input2" field="input" />
        </div>
      </Form>
    );
    expect(renderer.create(form)).toMatchSnapshot();
  });
});
