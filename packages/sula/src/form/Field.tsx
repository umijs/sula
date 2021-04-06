import React from 'react';
import isUndefined from 'lodash/isUndefined';
import uniqueId from 'lodash/uniqueId';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { Rule } from 'antd/lib/form';
import { FieldPlugin, ValidatorPlugin, RenderPlugin } from '../types/plugin';
import { FieldNamePath, FieldNameList, FieldSource } from '../types/form';
import { RequestConfig } from '../types/request';
import { Dependencies } from '../types/dependency';
import { toArray, assignWithDefined } from '../_util/common';
import FieldGroupContext, { HOOK_MARK } from './FieldGroupContext';
import {
  triggerFieldPlugin,
  triggerActionPlugin,
  triggerRenderPlugin,
  triggerPlugin,
} from '../rope/triggerPlugin';
import { Form as AForm, Col } from 'antd';
import { needWrapCols } from './utils/layoutUtil';
import FormDependency from './dependency';
import { ItemLayout, Layout } from './FieldGroup';
import { matchNameList } from '../_util/NameListMap';

const FormItem = AForm.Item;

export interface FieldProps
  extends Omit<FormItemProps, 'children' | 'wrapperCol' | 'labelCol' | 'rules'> {
  field: FieldPlugin;
  name?: FieldNamePath;
  collect?: boolean;
  initialDisabled?: boolean;
  initialVisible?: boolean;
  initialSource?: FieldSource;
  initialValue?: any;
  remoteSource?: RequestConfig;
  dependency?: Dependencies;
  children?: React.ReactElement;
  itemLayout?: ItemLayout;
  layout?: Layout;
  rules?: Array<
    Rule & {
      validator?: ValidatorPlugin;
    }
  >;
  childrenContainer?: RenderPlugin;
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

  private cancelRegisterField: () => void | null = null;

  private prevName: FieldNamePath;

  public mountedAndNeverUpdate: boolean = false;

  componentDidMount() {
    this.mountedAndNeverUpdate = true;

    if (!this.props.name) {
      return;
    }
    const {
      registerField,
      getFormDependency,
      getCtx,
      linkFieldNameAndFieldKey,
    } = this.context.formContext.getInternalHooks(HOOK_MARK);

    this.initFieldSource(getCtx());

    const { parentGroupName } = this.context;
    this.cancelRegisterField = registerField(parentGroupName, this);
    linkFieldNameAndFieldKey(this.getName(), this.getName(true));

    if (!this.props.dependency) {
      return;
    }

    // field 依赖
    const formDependency: FormDependency = getFormDependency();

    formDependency.parseFormDependency(this.props, this.getFieldNameList);
  }

  componentDidUpdate(prevProps: FieldProps) {
    this.mountedAndNeverUpdate = false;
    if (!this.props.name) {
      return;
    }

    /**
     * fieldKey 代表是动态表单项，如果更新前后两次name不一样，说明只是在values的位置上发生改变（上面增加了，或者删除了）
     */
    if (this.props.fieldKey && !matchNameList(toArray(this.props.name), toArray(prevProps.name))) {
      this.prevName = prevProps.name!;
      const {
        linkFieldNameAndFieldKey,
        unlinkFieldNameAndFieldKey,
      } = this.context.formContext.getInternalHooks(HOOK_MARK);

      // 动态添加
      unlinkFieldNameAndFieldKey(this.getName());
      linkFieldNameAndFieldKey(this.getName(), this.getName(true));
    }
  }

  componentWillUnmount() {
    if (!this.props.name) {
      return;
    }
    const {
      getFormDependency,
      unlinkFieldNameAndFieldKey,
    } = this.context.formContext.getInternalHooks(HOOK_MARK);
    if (this.props.dependency) {
      const formDependency: FormDependency = getFormDependency();
      formDependency.removeDependency(this.getName());
    }

    // 动态删除
    unlinkFieldNameAndFieldKey(this.getName());

    this.cancelRegister();
    this.destroy = true;
  }

  private cancelRegister = () => {
    if (this.cancelRegisterField) {
      this.cancelRegisterField();
    }
    this.cancelRegisterField = null;
  };

  private initFieldSource = (ctx) => {
    if (this.props.remoteSource && this.props.remoteSource.init !== false) {
      triggerActionPlugin(ctx, this.props.remoteSource).then((data: any) => {
        /**
         * 如果有fieldKey，则使用fieldKey注册
         */
        ctx.form.setFieldSource(this.getName(), data);
      });
    }
  };

  public getFieldNameList = (name: FieldNamePath) => {
    const { isList, parentGroupName } = this.context;

    if (isList) {
      /**
       * name 是加了rc formList 数字的
       * paranGroupName 是 FormList的name
       */
      return getFieldName(parentGroupName, name);
    }
    return toArray(name);
  };

  public getName = (needFieldNameList?: boolean): FieldNameList | undefined => {
    /** fieldKey 只在动态增减使用，此时fieldKey是确定的，name是变化的 */
    const { name, fieldKey } = this.props;
    const finalName = (!isUndefined(fieldKey) && !needFieldNameList
      ? fieldKey
      : name) as FieldNamePath;
    if (isUndefined(finalName)) {
      return;
    }

    return this.getFieldNameList(finalName);
  };

  public getPrevName = () => {
    return this.prevName ? this.getFieldNameList(this.prevName) : this.getName(true);
  };

  public getSource() {
    return this.source;
  }

  public getDisabled() {
    return this.disabled;
  }

  public setSource = (source: any) => {
    this.source = source;
    this.reRender();
  };

  public setVisible = (visible: boolean) => {
    this.visible = visible;
    this.reRender();
  };

  public setDisabled = (disabled: boolean) => {
    this.disabled = disabled;
    this.reRender();
  };

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
    const { itemLayout, visible, childrenContainer, formItemProps, isList } = extraConf;

    const { children, valuePropName = 'value', noStyle } = formItemProps;

    /** 如果是 isList 可能没有 itemLayout */
    const { wrapperCol, labelCol } = itemLayout;

    let fieldElem;

    if (children) {
      if (React.isValidElement(children)) {
        fieldElem = children;
      } else {
        // 配置型children
        fieldElem = this.transChildrenToElems(ctx, children);
        if (childrenContainer) {
          const childrenContainerElem = triggerRenderPlugin(ctx, childrenContainer);
          fieldElem = React.cloneElement(childrenContainerElem as React.ReactElement, {
            children: fieldElem,
          });
        }
      }
    } else {
      fieldElem = triggerFieldPlugin(ctx, fieldConfig, valuePropName);
    }

    const fieldItemElem = (
      <FormItem
        labelCol={isList ? labelCol || { span: 0 } : labelCol}
        wrapperCol={isList ? wrapperCol || { span: 24 } : wrapperCol}
        {...formItemProps}
      >
        {fieldElem}
      </FormItem>
    );

    if (noStyle !== true && !isList && (needWrapCols(itemLayout.span) || itemLayout.offset)) {
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
      const display = formItemProps.style ? formItemProps.style.display : '';
      return React.cloneElement(fieldItemElem, {
        style: assign({}, fieldItemElem.props.style, {
          display: visible === false ? 'none' : display,
        }),
      });
    }
  }

  render() {
    const {
      field: fieldProps,
      initialSource,
      initialVisible = true,
      initialDisabled = false,
      collect,
      remoteSource,
      itemLayout, // 无cols
      childrenContainer,
      ...restProps
    } = this.props;

    const { formContext, layout, isList, parentGroupName } = this.context;

    if (!this.inited) {
      this.inited = true;
      this.fieldName = getFieldName(parentGroupName, this.props.name).join('-');
      this.collect = collect !== false;
      this.source = initialSource;
      this.visible = initialVisible;
      this.disabled = initialDisabled;
    }

    const formItemProps = restProps as FormItemProps;

    if (restProps.rules && restProps.rules.length) {
      formItemProps.rules = restProps.rules.map((rule) => {
        if (rule.validator) {
          return {
            validator: (_, value): Promise<void> | void => {
              const validatorCtx = getCtx({
                value,
                name: this.props.name,
              });
              return triggerPlugin('validator', validatorCtx, rule.validator);
            },
          };
        }
        return rule;
      });
    }

    const { getCtx } = formContext.getInternalHooks(HOOK_MARK);
    const ctx = getCtx({ disabled: this.disabled, source: this.source, name: this.props.name });

    const extraConfig = {
      layout,
      itemLayout: isList
        ? itemLayout || {}
        : assignWithDefined({}, this.context.itemLayout, itemLayout),
      visible: this.visible,
      childrenContainer,
      formItemProps,
      isList,
    };

    const fieldNode = this.renderField(ctx, fieldProps, extraConfig);

    const subFormContext = {
      formContext,
      parentGroupName,
      layout,
    };

    return (
      <FieldGroupContext.Provider value={subFormContext}>{fieldNode}</FieldGroupContext.Provider>
    );
  }
}

function getFieldName(parentName: string, name?: string | string[]) {
  const finalName = name ? toArray(name) : [uniqueId('fieldName_')];
  return [parentName, ...finalName];
}
