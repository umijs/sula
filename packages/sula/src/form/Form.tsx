import React from 'react';
import { Form as AForm } from 'antd';
import omit from 'lodash/omit';
import { FormProps as AFormProps, FormInstance as AFormInstance } from 'antd/lib/form';
import { FieldGroupProps } from './FieldGroup';
import FieldGroupContext, { rootGroupName, HOOK_MARK } from './FieldGroupContext';
import { getItemLayout } from './utils/layoutUtil';
import { NormalizedItemLayout } from './FieldGroup';
import { FieldGroup } from '.';
import useFormContext from './useFormContext';
import FormDependency from './dependency';
import { triggerActionPlugin } from '../rope/triggerPlugin';
import MediaQueries from './MediaQueries';
import { RequestConfig } from '../types/request';
import { FieldNamePath, Mode } from '../types/form';

export interface FormProps
  extends Omit<AFormProps, 'children' | 'fields' | 'form'>,
    Omit<FieldGroupProps, 'name' | 'initialVisible' | 'dependency'> {
  remoteValues?: RequestConfig;
  onRemoteValuesStart?: () => void;
  onRemoteValuesEnd?: () => void;
  ctxGetter?: () => Record<string, any>;
  form?: FormInstance;
  mode?: Mode;
}

export interface FormInstance extends Omit<AFormInstance, 'validateFields'> {
  validateFields: (nameList?: FieldNamePath[] | true) => Promise<any>;
  validateGroupFields: (groupName: string) => Promise<any>;
  setFieldValue: (name: FieldNamePath, value: any) => void;
  setFieldSource: (name: FieldNamePath, source: any) => void;
  setFieldVisible: (name: FieldNamePath, visible: boolean) => void;
  setFieldDisabled: (name: FieldNamePath, disabled: boolean) => void;
  getFieldSource: (name: FieldNamePath) => any;
  getFieldDisabled: (name: FieldNamePath) => any;
}

const Form: React.FunctionComponent<FormProps> = (props, ref) => {
  const [formInstance] = useFormContext(props.form);

  React.useImperativeHandle(ref, () => formInstance);

  const {
    saveFormProps,
    saveFormDependency,
    cascade,
    getCtx,
    getAFormInstance,
    getAsyncCascade,
    setAsyncCascade,
  } = formInstance.getInternalHooks(HOOK_MARK);

  const formDependencyRef = React.useRef(new FormDependency());

  saveFormDependency(formDependencyRef.current);

  saveFormProps(props);

  const {
    layout = 'horizontal',
    itemLayout,
    mode = 'create',
    remoteValues,
    initialValues,
    container,
    fields,
    children,
    actionsRender,
    actionsPosition,
    onRemoteValuesStart,
    onRemoteValuesEnd,
  } = props;

  React.useEffect(() => {
    const ctx = getCtx();
    if (initialValues) {
      ctx.form.setFieldsValue(initialValues);
    }

    if (mode !== 'create' && remoteValues && remoteValues.init !== false) {
      onRemoteValuesStart && onRemoteValuesStart();
      triggerActionPlugin(ctx, remoteValues)
        .then((fieldsValue: any) => {
          ctx.form.setFieldsValue(fieldsValue);
          onRemoteValuesEnd && onRemoteValuesEnd();
        })
        .catch(() => {
          onRemoteValuesEnd && onRemoteValuesEnd();
        });
    }
  }, []);

  const finalChildren = fields ? (
    <FieldGroup
      fields={fields}
      container={container}
      actionsRender={actionsRender}
      actionsPosition={actionsPosition}
    />
  ) : (
    children
  );

  const formProps = omit(props, [
    'itemLayout',
    'mode',
    'remoteValues',
    'container',
    'fields',
    'children',
    'actionsRender',
    'actionsPosition',
    'ctxGetter',
    'onRemoteValuesStart',
    'onRemoteValuesEnd',
  ]);

  const originValuesChange = formProps.onValuesChange;

  const prevAllValuesRef = React.useRef<any>({});

  formProps.onValuesChange = (changedValue, allValues) => {
    function onValuesChange() {
      cascade(changedValue, {
        cascadeTrigger: 'setFieldsValue',
        cascadeStore: changedValue,
        cascadePrevStore: prevAllValuesRef.current,
      });
      prevAllValuesRef.current = allValues;

      if (originValuesChange) {
        originValuesChange(changedValue, allValues);
      }
    }
    /**
     * Promise.resolve 原因，需要动态field有机会更新 fieldName和fieldKey link，
     * 那么才能用新的fieldName 找到 fieldKey，然后再找到depOfType去进行关联
     */
    const needAsyncCascade = getAsyncCascade();
    if (needAsyncCascade) {
      Promise.resolve().then(() => {
        onValuesChange();
        setAsyncCascade(false);
      });
    } else {
      onValuesChange();
    }
  };

  return (
    <MediaQueries>
      {(matchedPoint) => {
        const normalizedItemLayout: NormalizedItemLayout = getItemLayout(
          itemLayout,
          layout,
          matchedPoint,
        );
        const fieldGroupContext = {
          formContext: {
            getInternalHooks: formInstance.getInternalHooks,
          },
          layout,
          itemLayout: normalizedItemLayout,
          parentGroupName: rootGroupName,
          matchedPoint,
        };
        const wrapperChildren = (
          <FieldGroupContext.Provider value={fieldGroupContext}>
            {finalChildren}
          </FieldGroupContext.Provider>
        );

        return (
          <AForm
            {...formProps}
            wrapperCol={normalizedItemLayout.wrapperCol}
            labelCol={normalizedItemLayout.labelCol}
            children={wrapperChildren}
            form={getAFormInstance()}
          />
        );
      }}
    </MediaQueries>
  );
};

export default Form;
