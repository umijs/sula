import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { FieldNameList, FieldNamePath } from '../../types/form';
import { FieldProps } from '../Field';
import { HOOK_MARK } from '../FieldGroupContext';
import DepStore from './DepStore';

const DEP_NAME = 'dependency';

export default class FormDependency {
  private depStore: DepStore;

  constructor() {
    this.depStore = new DepStore();
  }

  public parseFormDependency = (
    fieldConfig: FieldProps,
    getName: (name: FieldNamePath) => FieldNameList,
  ) => {
    const dependencies = fieldConfig[DEP_NAME];
    if (isEmpty(dependencies)) {
      return fieldConfig;
    }
    this.depStore.parse(fieldConfig, dependencies!, getName);
    return omit(fieldConfig, [DEP_NAME]);
  };

  public removeDependency = (fieldNameList) => {
    this.depStore.depsByFieldNameList.delete(fieldNameList);
  }

  public getCascades = (): FieldNameList[] => this.depStore.depsByFieldNameList.getNameLists();

  public cascade = (ctx, store, cascadePayload) => {
    const { getFieldKeyByFieldName } = ctx.form.getInternalHooks(HOOK_MARK);
    store.forEach((item) => {
      const cascadeFieldNameList = getFieldKeyByFieldName(item.name);
      const depsOfType = this.depStore.depsByFieldNameList.get(cascadeFieldNameList);
      if (depsOfType) {
        this.depStore.triggerDependency(ctx, depsOfType, cascadePayload);
      }
    });
  };
}
