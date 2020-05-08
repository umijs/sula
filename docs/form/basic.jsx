import React from 'react';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Form } from 'sula';

const initialSource = [
  {
    text: '苹果 🍎',
    value: 'apple',
  },
  {
    text: '桃子 🍑',
    value: 'peach',
  },
];

const cascaderSource = [
  {
    value: 'fruits',
    text: '水果',
    children: initialSource,
  },
];

export default class BasicDemo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <Form
        initialValues={{ radiogroup: 'peach' }}
        onFinish={(values) => {
          console.log('Success:', values);
        }}
        fields={[
          { name: 'input', label: 'input', field: 'input' },
          {
            name: 'inputnumber',
            label: 'inputnumber',
            field: {
              type: 'inputnumber',
              props: {
                style: {
                  width: 300,
                },
              },
            },
          },
          {
            name: 'checkbox',
            label: 'checkbox',
            field: 'checkbox',
            valuePropName: 'checked',
          },
          {
            name: 'radio',
            label: 'radio',
            field: 'radio',
            valuePropName: 'checked',
          },
          {
            name: 'switch',
            label: 'switch',
            field: 'switch',
            valuePropName: 'checked',
          },
          {
            name: 'select',
            label: 'select',
            field: 'select',
            initialSource,
          },
          {
            name: 'cascader',
            label: 'cascader',
            field: 'cascader',
            initialSource: cascaderSource,
          },
          {
            name: 'checkboxgroup',
            label: 'checkboxgroup',
            field: 'checkboxgroup',
            initialSource,
            initialValue: ['peach'] // antd 4.2.0开始支持
          },
          {
            name: 'radiogroup',
            label: 'radiogroup',
            field: 'radiogroup',
            initialSource,
          },
          {
            name: 'slider',
            label: 'slider',
            field: 'slider',
          },
          {
            name: 'rate',
            label: 'rate',
            field: 'rate',
          },
          {
            name: 'timepicker',
            label: 'timepicker',
            field: {
              type: 'timepicker',
              props: {
                valueFormat: 'utc',
              },
            },
          },
          {
            name: 'datepicker',
            label: 'datepicker',
            field: {
              type: 'datepicker',
              props: {
                valueFormat: 'utc',
              },
            },
          },
          {
            name: 'rangepicker',
            label: 'rangepicker',
            field: {
              type: 'rangepicker',
              props: {
                valueFormat: 'utc',
              },
            },
          },
          {
            name: 'upload',
            label: 'upload',
            field: {
              type: 'upload',
              props: {
                request: {
                  url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
                  params: {
                    name: 'sula',
                  },
                  converter: (ctx) => {
                    // 可以访问ctx
                    return ctx.data;
                  },
                },
                multiple: true,
                children: <Button icon={<UploadOutlined />}>Click to upload</Button>,
              },
            },
            valuePropName: 'fileList',
          },
          {
            label: ' ',
            colon: false,
            render: {
              type: 'button',
              props: {
                htmlType: 'submit',
                type: 'primary',
                children: 'submit',
              },
            },
          },
        ]}
      />
    );
  }
}
