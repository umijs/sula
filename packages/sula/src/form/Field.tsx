import React from 'react';
import isUndefined from 'lodash/isUndefined';
import uniqueId from 'lodash/uniqueId';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { FieldPlugin } from '../types/plugin';
import { FieldNamePath, FieldSource, FieldValue, FieldNameList } from '../types/form';
import { RequestConfig } from '../types/request';
import { Dependencies } from '../types/dependency';
import { toArray, assignWithDefined } from '../_util/common';
import FieldGroupContext, { HOOK_MARK } from './FieldGroupContext';
import {
  triggerFieldPlugin,
  triggerActionPlugin,
  triggerRenderPlugin,
} from '../rope/triggerPlugin';
import { Form as AForm, Col } from 'antd';
import { needWrapCols } from './utils/layoutUtil';
import FormDependency from './dependency';

const FormItem = AForm.Item;

export interface FieldProps extends Exclude<FormItemProps, 'children'> {
  field: FieldPlugin;
  name?: FieldNamePath;
  collect?: boolean;
  initialDisabled?: boolean;
  initialVisible?: boolean;
  initialSource?: FieldSource;
  initialValue?: FieldValue;
  remoteSource?: RequestConfig;
  dependency?: Dependencies;
  children?: React.ReactElement;
}

export default class Field extends React.Component<FieldProps> {
  static contextType = FieldGroupContext;

  private inited: boolean = false;

  private destroy = false;

  /**
   * 以下三个值，是针对field-form的扩展，主要是应用于render插件中的。
   */
  private source: FieldSource;

  private disabled: boolean;

  // 收集表单值相关
  private visible: boolean;

  private collect: boolean;

  // 如果不设置则给一个唯一值，并不会作为 FormItem 的 name
  private fieldName: string;

  componentDidMount() {
    const { registerField, getFormDependency, getCtx } = this.context.formContext.getInternalHooks(
      HOOK_MARK,
    );

    this.initFieldSource(getCtx());

    const { parentGroupName } = this.context;
    registerField(parentGroupName, this);

    if (!this.props.dependency) {
      return;
    }

    // field 依赖
    const formDependency: FormDependency = getFormDependency();

    formDependency.parseFormDependency(this.props);
  }

  componentWillUnmount() {
    this.destroy = true;
  }

  private initFieldSource = (ctx) => {
    if (this.props.remoteSource && this.props.remoteSource.init !== false) {
      triggerActionPlugin(ctx, this.props.remoteSource).then((data: any) => {
        ctx.form.setFieldSource(this.getName(), data);
      });
    }
  };

  public getName(): FieldNameList | undefined {
    if (!isUndefined(this.props.name)) {
      return toArray(this.props.name);
    }
  }

  public getSource() {
    return this.source;
  }

  public getDisabled() {
    return this.disabled;
  }

  public setSource(source: any) {
    this.source = source;
    this.reRender();
  }

  public setVisible(visible: boolean) {
    this.visible = visible;
    this.reRender();
  }

  public setDisabled(disabled: boolean) {
    this.disabled = disabled;
    this.reRender();
  }

  public getVisible() {
    return this.visible;
  }

  public getCollect() {
    return this.collect;
  }

  public reRender() {
    if (this.destroy) return;
    this.forceUpdate();
  }

  /**
   *
   */
  private transChildrenToElems = (ctx, children) => {
    const childrenElems = [];
    // 配置方式全部转换为组件
    children.forEach((childConfig, index) => {
      const childKey = childConfig.name || `${this.fieldName}-child-${index}`;
      let childElem;
      if (childConfig.field) {
        childElem = <Field {...childConfig} key={childKey} />;
      } else if (childConfig.render) {
        // 认为是render
        const renderPlugin = childConfig.render;
        const finalChildConfig = omit(childConfig, ['render']);
        childElem = (
          <Field key={childKey} {...finalChildConfig}>
            {triggerRenderPlugin(ctx, renderPlugin)}
          </Field>
        );
      }

      childrenElems.push(childElem);
    });

    return childrenElems;
  };

  private renderField(ctx, fieldConfig: FieldPlugin, extraConf) {
    const { itemLayout, visible, formItemProps } = extraConf;

    const { wrapperCol, labelCol } = formItemProps;

    const { children, valuePropName = 'value' } = formItemProps;

    let fieldElem;

    if (children) {
      if (React.isValidElement(children)) {
        fieldElem = children;
      } else {
        // 配置型childrne
        fieldElem = this.transChildrenToElems(ctx, children);
        if (formItemProps.childrenContainer) {
          const childrenContainerElem = triggerRenderPlugin(ctx, formItemProps.childrenContainer);
          fieldElem = React.cloneElement(childrenContainerElem as React.ReactElement, {
            children: fieldElem,
          });
        }
      }
    } else {
      fieldElem = triggerFieldPlugin(ctx, fieldConfig, valuePropName);
    }

    const fieldItemElem = (
      <FormItem labelCol={labelCol} wrapperCol={wrapperCol} {...formItemProps}>
        {fieldElem}
      </FormItem>
    );

    if (needWrapCols(itemLayout.span)) {
      return (
        <Col
          style={{ display: visible === false ? 'none' : '' }}
          span={itemLayout.span}
          offset={itemLayout.offset}
        >
          {fieldItemElem}
        </Col>
      );
    } else {
      if (this.props.dependency && this.props.dependency.visible) {
        return React.cloneElement(fieldItemElem, {
          style: assign({}, fieldItemElem.props.style, {
            display: visible === false ? 'none' : '',
          }),
        });
      }
      return fieldItemElem;
    }
  }

  render() {
    const {
      field: fieldProps,
      initialSource,
      initialVisible,
      initialDisabled,
      collect,
      remoteSource,
      itemLayout, // 无cols
      ...restProps
    } = this.props;

    if (!this.inited) {
      this.inited = true;
      this.fieldName = getFieldName(this.props.name);
      this.collect = collect !== false;
      this.source = initialSource;
      this.visible = initialVisible;
      this.disabled = initialDisabled;
    }

    const { formContext, layout } = this.context;

    const { getCtx } = formContext.getInternalHooks(HOOK_MARK);
    const ctx = getCtx({ disabled: this.disabled, source: this.source });

    const extraConfig = {
      layout,
      itemLayout: assignWithDefined({}, this.context.itemLayout, itemLayout),
      visible: this.visible,
      formItemProps: restProps,
    };

    const fieldNode = this.renderField(ctx, fieldProps, extraConfig);

    return fieldNode;
  }
}

function getFieldName(fieldName) {
  return fieldName || uniqueId('fieldName_');
}
