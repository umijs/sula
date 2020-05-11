import React from 'react';
import renderer from 'react-test-renderer';
import { Form } from '..';
import '../../__tests__/common';

describe('layout', () => {
  it('itemlayout', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    const form = (
      <Form
        itemLayout={{
          cols: {
            xxl: 4,
            xl: 3,
            lg: 2,
            md: 2,
            sm: 1,
            xs: 1,
          },
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
            initialVisible: false,
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
      />
    );

    expect(renderer.create(form).toJSON()).toMatchSnapshot();
  });

  it('item span 24', () => {
    const form = (
      <Form
        itemLayout={{
          span: 24,
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
            name: 'group',
            fields: [
              {
                name: 'input4',
                label: 'input4',
                field: 'input',
              },
            ],
          },
          {
            name: 'group2',
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

    expect(renderer.create(form).toJSON()).toMatchSnapshot();
  });
});
