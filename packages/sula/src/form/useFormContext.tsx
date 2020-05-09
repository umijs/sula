import React from 'react';
import isUndefined from 'lodash/isUndefined';
import isBoolean from 'lodash/isBoolean';
import isArray from 'lodash/isArray';
import assign from 'lodash/assign';
import { FormInstance as AFormInstance } from 'antd/lib/form';
import FormDependency from './dependency';
import { HOOK_MARK, rootGroupName } from './FieldGroupContext';
import FieldGroup from './FieldGroup';
import Field from './Field';
import { FieldNameList, FormCtx, FieldNamePath, FieldValue } from '../types/form';
import { NameListMap, matchNameList } from '../_util/NameListMap';
import { FormProps } from './Form';
import { toArray } from 'antd/lib/form/util';
import transStore from '../_util/filterStore';

class ContextStore {
  private fieldsByGroup: Record<string, Field[]> = {};
  private fieldNameMap: NameListMap<FieldNameList, Field | FieldGroup> = new NameListMap();
  private groupsByParentGroup: Record<string, FieldGroup[]> = {};

  private formDependency: FormDependency;

  private formInstance: AFormInstance;

  private formProps: FormProps;

  constructor(formInstance: AFormInstance) {
    this.formInstance = formInstance;
  }

  public getContext = () => ({
    getForm: () => this.getForm(),
    getInternalHooks: this.getInternalHooks,
  });

  private getForm = () => {
    return {
      ...this.formInstance,
      /**
       * 覆盖的方法
       */
      validateFields: this.validateFields,
      /**
       * 扩展的方法
       */
      validateGroupFields: this.validateGroupFields,

      getFieldSource: this.getFieldSource,
      getFieldDisabled: this.getFieldDisabled,

      setFieldVisible: this.setFieldVisible,
      setFieldDisabled: this.setFieldDisabled,
      setFieldSource: this.setFieldSource,
      setFieldValue: this.setFieldValue,
      setFieldsValue: this.setFieldsValue,
      setFields: this.setFields,
    };
  };

  // ================= 实例 API ==================
  // true 不再过滤visible为false的值
  public validateFields = (nameList?: FieldNamePath[] | true) => {
    if (isBoolean(nameList) && nameList) {
      return this.formInstance.validateFields();
    }
    const visibleFieldsName = [] as FieldNameList[];
    // 从nameList剔除不显示的
    if (nameList) {
      this.getVisibleFieldsName(nameList, visibleFieldsName);
    } else {
      const rootFieldGroups = this.groupsByParentGroup[rootGroupName];
      this.getVisibleFieldsNameFromGroup(rootFieldGroups, visibleFieldsName);
    }

    return this.formInstance.validateFields(visibleFieldsName);
  };

  public validateGroupFields = (groupName: string) => {
    const visibleFieldsName = [] as FieldNameList[];

    const fieldGroup = this.fieldNameMap.get(toArray(groupName)) as FieldGroup;
    this.getVisibleFieldsNameFromGroup([fieldGroup], visibleFieldsName);
    return this.formInstance.validateFields(visibleFieldsName);
  };

  public getFieldSource = (name: FieldNamePath) => {
    const field = this.getField(name);
    return field.getSource();
  };

  public getFieldDisabled = (name: FieldNamePath) => {
    const field = this.getField(name);
    return field.getDisabled();
  };

  public setFieldVisible = (name: FieldNamePath, visible: boolean) => {
    const field = this.getField(name);

    field.setVisible(visible);
  };

  public setFieldDisabled = (name: FieldNamePath, disabled: boolean) => {
    const field = this.getField(name);

    field.setDisabled(disabled);
  };

  public setFieldSource = (name: FieldNamePath, source: any) => {
    const field = this.getField(name);

    field.setSource(source);
  };

  public setFieldValue = (name: FieldNamePath, value: FieldValue): void => {
    // 1. 设置值
    const fieldData = [
      {
        name: toArray(name),
        value,
        errors: [], // setFieldValue 使用 setFields 实现，需要显式clear errors
      },
    ];

    this.formInstance.setFields(fieldData);

    // 2. 触发级联
    this.cascade(fieldData);

    // 3. 通知更新
    this.notifyFieldReRender(fieldData);
  };

  public setFieldsValue = (store: any) => {
    // 1. 设置值
    this.formInstance.setFieldsValue(store);
    // 2. 触发级联
    this.cascade(store, { cascadeTrigger: 'setFieldsValue', cascadeStore: store });
    // 3. 触发值更新
    this.notifyFieldReRender(store);
  };

  public setFields = (store) => {
    this.formInstance.setFields(store);

    const finalStore = store.reduce((memo, item) => {
      if (item.hasOwnProperty('value')) {
        memo.push({
          name: toArray(item.name),
          value: item.value,
        });
      }
      return memo;
    }, []);

    if (finalStore.length) {
      // 2. 触发级联
      this.cascade(finalStore, { cascadeTrigger: 'setFieldsValue', cascadePayload: store });

      // 3. 通知更新
      this.notifyFieldReRender(finalStore);
    }
  };

  private getInternalHooks = (key: string) => {
    if (key === HOOK_MARK) {
      return {
        registerField: this.registerField,
        registerFieldGroup: this.registerFieldGroup,
        saveFormDependency: (formDependency: FormDependency) => {
          this.formDependency = formDependency;
        },
        getFormDependency: () => this.formDependency,
        saveFormProps: (formProps) => {
          this.formProps = formProps;
        },
        getCtx: this.getCtx,
        cascade: this.cascade,
      };
    }
  };

  // ================== Internal Hooks ===================
  private getCtx = (extraCtx = {}) => {
    const form = this.getForm();

    const finalCtx: FormCtx = assign(extraCtx, {
      form,
      mode: this.formProps.mode,
    });

    if (this.formProps.ctxGetter) {
      finalCtx.ctxGetter = this.formProps.ctxGetter;
    }
    return finalCtx;
  };

  /**
   * fieldNameMap: 以 fieldNameList 保存 field 或 支持依赖的 fieldGroup 实例
   * fieldsByGroup: 以 groupName(string) 保存直接子 Field 组
   */
  private registerField = (
    groupName: string,
    field: Field | FieldGroup,
    isFieldGroup: boolean = false,
  ) => {
    const fieldNameList = field.getName();
    // 如果没有name的field不放入到fieldMap中
    if (isUndefined(fieldNameList)) {
      return;
    }
    this.fieldNameMap.set(fieldNameList as FieldNameList, field);

    if (isFieldGroup) {
      return;
    }

    if (this.fieldsByGroup[groupName]) {
      this.fieldsByGroup[groupName].push(field as Field);
    } else {
      this.fieldsByGroup[groupName] = [field as Field];
    }
  };

  /**
   * 构造 FieldGroup 树
   */
  private registerFieldGroup = (parentGroupName: string, fieldGroup: FieldGroup) => {
    if (this.groupsByParentGroup[parentGroupName]) {
      this.groupsByParentGroup[parentGroupName].push(fieldGroup);
    } else {
      this.groupsByParentGroup[parentGroupName] = [fieldGroup];
    }
  };

  private cascade = (store: any, cascadePayload = {}) => {
    const cascades: FieldNameList[] = this.formDependency.getCascades();
    if (cascades && cascades.length) {
      let finalStore = store;
      // setFieldsValue的场景
      if (!isArray(store)) {
        finalStore = transStore(store, cascades);
      }

      const cascadeStore = finalStore.filter((item: { name: FieldNameList; value: FieldValue }) =>
        cascades.some((cascade) => {
          const fieldNameList = item.name;
          return matchNameList(fieldNameList, cascade);
        }),
      );

      if (cascadeStore.length) {
        this.formDependency.cascade(this.getCtx(), cascadeStore, cascadePayload);
      }
    }
  };

  // 通知 Field 组件更新
  private notifyFieldReRender(store) {
    let finalStore = store;
    if (!isArray(store)) {
      finalStore = transStore(store, this.fieldNameMap.getNameLists());
    }

    finalStore.forEach(({ name }) => {
      const field = this.getField(name);
      field.reRender();
    });
  }

  // ==================== Helper ===================
  private getField = (name: FieldNamePath): Field => {
    return this.fieldNameMap.get(toArray(name)) as Field;
  };

  // 过滤掉不显示的或不收集的
  private getVisibleFieldsName = (
    fieldsName: FieldNamePath[],
    visibleFieldsName: FieldNameList[],
  ) => {
    fieldsName.forEach((fieldName) => {
      if (isUndefined(fieldName)) {
        return;
      }
      const fieldNameList = toArray(fieldName);
      const field = this.getField(fieldNameList);
      if (field.getVisible() === false || field.getCollect() === false) {
        return;
      }
      visibleFieldsName.push(fieldNameList);
    });
  };

  private getVisibleFieldsNameFromGroup = (
    fieldGroups: FieldGroup[] = [],
    visibleFieldsName: FieldNameList[],
  ) => {
    fieldGroups.forEach((fieldGroup) => {
      if (fieldGroup.getVisible() === false) {
        return;
      }

      // 处理 group 的子 group
      this.getVisibleFieldsNameFromGroup(
        this.groupsByParentGroup[fieldGroup.getGroupName()],
        visibleFieldsName,
      );

      // 处理 group 的子 fields
      const fieldNameLists: FieldNameList[] = (
        this.fieldsByGroup[fieldGroup.getGroupName()] || []
      ).map((field) => {
        return field.getName() as FieldNameList;
      });

      this.getVisibleFieldsName(fieldNameLists, visibleFieldsName);
    });
  };
}

export default function useFormContext(formInstance) {
  const contextRef = React.useRef(null);

  if (!contextRef.current) {
    const contextStore = new ContextStore(formInstance);
    contextRef.current = contextStore.getContext();
  }

  return [contextRef.current];
}
