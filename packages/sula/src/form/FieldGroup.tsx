import React from 'react';
import uniqueId from 'lodash/uniqueId';
import isUndefined from 'lodash/isUndefined';
import assign from 'lodash/assign';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { ColProps } from 'antd/lib/col';
import { Row } from 'antd';
import Field, { FieldProps } from './Field';
import { FieldNameList } from '../types/form';
import FieldGroupContext, { HOOK_MARK } from './FieldGroupContext';
import FormDependency from './dependency';
import { Dependencies } from '../types/dependency';
import { getItemLayout, needWrapCols } from './utils/layoutUtil';
import { triggerRenderPlugin, normalizeConfig, triggerFieldPlugin } from '../rope/triggerPlugin';
import { toArray } from '../_util/common';
import FormAction from './FormAction';
import { RenderPlugin } from '../types/plugin';
import FormList from './FormList';

export type Layout = 'horizontal' | 'vertical' | 'inline';

export type ItemLayout = {
  cols?: number; // 1列，2列，...  cols 可以看成span的简写
  span?: number;
  offset?: number;
  gutter?: number; // 默认24
  wrapperCol?: ColProps | undefined;
  labelCol?: ColProps | undefined;
};

export type NormalizedItemLayout = Omit<ItemLayout, 'cols'> & {
  span?: number | undefined;
};

export interface FieldGroupProps {
  name?: string; // 获取分组值
  layout?: Layout;
  itemLayout?: ItemLayout;
  initialVisible?: boolean;
  children?: React.ReactFragment;
  fields?: FieldProps[];
  dependency?: Pick<Dependencies, 'visible'>;
  container?: RenderPlugin;
  actionsRender?: RenderPlugin | RenderPlugin[];
  actionsPosition?: 'center' | 'right' | 'bottom';
  isList?: boolean;
}

export default class FieldGroup extends React.Component<FieldGroupProps> {
  static contextType = FieldGroupContext;

  private destory = false;

  private inited = false;

  private hasDependency = false;

  // 收集值相关
  private visible: boolean;

  private groupName: string;

  private cancelRegisterField: () => void | null = null;

  private cancelRegisterFieldGroup: () => void | null = null;

  componentDidMount() {
    this.inited = true;

    const {
      registerField,
      registerFieldGroup,
      getFormDependency,
    } = this.context.formContext.getInternalHooks(HOOK_MARK);

    this.cancelRegisterFieldGroup = registerFieldGroup(this.context.parentGroupName, this);

    this.cancelRegisterField = registerField(this.getName(), this, true);

    // visible级联
    if (!this.props.dependency) {
      return;
    }

    const formDependency: FormDependency = getFormDependency();
    const groupFieldPropsWithName = pick(this.props, ['dependency', 'name']);
    if (!groupFieldPropsWithName.name) {
      groupFieldPropsWithName.name = this.groupName;
    }
    formDependency.parseFormDependency(groupFieldPropsWithName as FieldProps, (name) =>
      toArray(name),
    );
  }

  componentWillUnmount() {
    this.cancelRegister();
    this.destory = true;
  }

  private cancelRegister = () => {
    if (this.cancelRegisterField) {
      this.cancelRegisterField();
    }
    this.cancelRegisterField = null;

    if (this.cancelRegisterFieldGroup) {
      this.cancelRegisterFieldGroup();
    }
    this.cancelRegisterFieldGroup = null;
  };

  // ================ 对外 API ================
  public setVisible(visible: boolean) {
    this.visible = visible;
    this.reRender();
  }

  public getVisible() {
    return this.visible;
  }

  // 放入 NameListMap
  public getName = (): FieldNameList => {
    return toArray(this.groupName);
  };

  public getGroupName(): string {
    return this.groupName;
  }

  public reRender() {
    if (!this.destory) {
      this.forceUpdate();
    }
  }

  // =============== 配置转换 =================

  /**
   * 1. 如果是单列或者是inline，直接渲染即可
   * 2. 如果是多列且非inline，则使用 Col 包裹
   * 3. 如果存在 actionsRender，则放到最后
   */
  private transFieldToElems = (ctx, fields) => {
    const fieldsElems = [];
    // 配置方式全部转换为组件
    fields.forEach((fieldConfig, index) => {
      const fieldKey = fieldConfig.name || `${this.groupName}-field-${index}`;
      let fieldElem;
      if (fieldConfig.container || fieldConfig.fields) {
        fieldElem = <FieldGroup {...fieldConfig} key={fieldKey} />;
      } else if (fieldConfig.render) {
        // 认为是render
        const renderPlugin = fieldConfig.render;
        const finalFieldConfig = omit(fieldConfig, ['render']);
        fieldElem = (
          <Field key={fieldKey} {...finalFieldConfig}>
            {triggerRenderPlugin(ctx, renderPlugin)}
          </Field>
        );
      } else if (fieldConfig.isList) {
        /**
         * fields: [
         *   {
         *     name: "users", type: "dynamicList", props: { listFields: [...]},
         *   }
         * ]
         */
        const formListName = fieldConfig.name;
        const formListLabel = fieldConfig.label;
        const formListPlugin = normalizeConfig(fieldConfig.field);
        const listRenderPlugin = omit(fieldConfig, ['isList', 'name', 'label', 'field']);
        fieldElem = (
          <FormList {...listRenderPlugin} name={formListName} label={formListLabel} key={fieldKey}>
            {(...listArgs: any[]) => {
              return triggerFieldPlugin(
                ctx,
                // @ts-ignore
                assign({}, formListPlugin, {
                  props: assign({}, formListPlugin.props, {
                    /** list插件可以通过name加序号获取整行数据做拷贝 */
                    name: formListName,
                    list: asyncWrap(listArgs, ctx),
                  }),
                }),
              );
            }}
          </FormList>
        );
      } else {
        fieldElem = <Field {...fieldConfig} key={fieldKey} />;
      }

      fieldsElems.push(fieldElem);
    });

    return fieldsElems;
  };

  private renderChildren = (ctx, props, extraConf) => {
    const { itemLayout } = extraConf;
    const { fields } = props;
    const { span, gutter } = itemLayout || {};

    const children = fields ? this.transFieldToElems(ctx, fields) : props.children;

    let actionsElem;
    let actionsPosition = props.actionsPosition;
    if (props.actionsRender) {
      actionsElem = (
        <FormAction
          key={`${this.groupName}-form-action`}
          actionsRender={props.actionsRender}
          actionsPosition={actionsPosition}
        />
      );
    }

    const isNeedWrapCols = needWrapCols(span);

    if (!isNeedWrapCols) {
      if (actionsElem) {
        return (
          <React.Fragment>
            {children}
            {actionsElem}
          </React.Fragment>
        );
      } else {
        return children;
      }
    }

    // a b c | d e f | g
    const finalChildren = [];
    let groupFieldsElem: React.ReactElement<Field>[] = [];
    let groupRowIndex = 0;

    React.Children.forEach(children, (child) => {
      let childElem;
      if (child.type === FieldGroup) {
        if (groupFieldsElem.length) {
          const rowKey = `${this.groupName}-row-${groupRowIndex}`;
          childElem = (
            <Row gutter={gutter} key={rowKey}>
              {groupFieldsElem}
            </Row>
          );
          groupFieldsElem = [];
          groupRowIndex += 1;
        }

        finalChildren.push(childElem);
        finalChildren.push(child);
      } else if (child.type === FormAction) {
        actionsElem = child;
        actionsPosition = child.props.actionsPosition;
      } else {
        groupFieldsElem.push(child);
      }
    });

    const rowKey = `${this.groupName}-row-${groupRowIndex}`;
    const isDefaultPosition = !actionsPosition || actionsPosition === 'default';

    if (!actionsElem) {
      finalChildren.push(
        <Row gutter={gutter} key={rowKey}>
          {groupFieldsElem}
        </Row>,
      );
    } else {
      if (isDefaultPosition) {
        finalChildren.push(
          <Row gutter={gutter} key={rowKey}>
            {groupFieldsElem}
            {actionsElem}
          </Row>,
        );
      } else {
        finalChildren.push(
          <Row gutter={gutter} key={rowKey}>
            {groupFieldsElem}
          </Row>,
        );
        finalChildren.push(actionsElem);
      }
    }

    return finalChildren;
  };

  private renderFieldGroup = (ctx, props, extraConf) => {
    const { container, isList } = props;
    let finalContainer = container || {
      type: () => (this.hasDependency ? <div /> : <React.Fragment />),
    };

    if (this.hasDependency) {
      finalContainer = normalizeConfig(finalContainer);
    }

    let containerNode = triggerRenderPlugin(ctx, finalContainer);

    const children = isList ? props.children : this.renderChildren(ctx, props, extraConf);

    containerNode = React.cloneElement(containerNode as React.ReactElement, {
      children,
      style: assign({}, containerNode.props.style, {
        display: this.visible === false ? 'none' : '',
      }),
    });

    return containerNode;
  };

  render() {
    const { layout, itemLayout, formContext, matchedPoint } = this.context;

    const { getCtx } = formContext.getInternalHooks(HOOK_MARK);

    const { isList } = this.props;

    if (!this.inited) {
      this.hasDependency = !isUndefined(this.props.dependency);
      this.visible = this.props.initialVisible !== false;
      this.groupName = getGroupName(this.props.name);
    }

    const finalLayout = isList ? this.props.layout : this.props.layout || layout;
    const finalItemLayout = isList
      ? this.props.itemLayout
      : this.props.itemLayout
      ? getItemLayout(this.props.itemLayout, finalLayout, matchedPoint)
      : itemLayout;

    const fieldGroupExtraConf = {
      layout: finalLayout,
      itemLayout: finalItemLayout,
    };

    const ctx = getCtx();

    const fieldGroupNode = this.renderFieldGroup(ctx, this.props, fieldGroupExtraConf);

    const fieldGroupContext = {
      formContext,
      layout: finalLayout,
      itemLayout: finalItemLayout,
      parentGroupName: this.groupName,
      isList,
    };

    return (
      <FieldGroupContext.Provider value={fieldGroupContext}>
        {fieldGroupNode}
      </FieldGroupContext.Provider>
    );
  }
}

function getGroupName(groupName) {
  return groupName || uniqueId('groupName_');
}

function asyncWrap(list, ctx) {
  const actions = list[1];
  const newActions = Object.keys(actions).reduce((memo, actionName) => {
    const action = actions[actionName];

    memo[actionName] = (...args: any[]) => {
      const { setAsyncCascade } = ctx.form.getInternalHooks(HOOK_MARK);
      setAsyncCascade(true);
      action(...args);
    };

    return memo;
  }, {});

  const newList = [...list];
  newList[1] = newActions;
  return newList;
}
