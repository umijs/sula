import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { FieldNameList, FieldNamePath } from '../../types/form';
import { FieldProps } from '../Field';
import DepStore from './DepStore';

const DEP_NAME = 'dependency';

export default class FormDependency {
  private depStore: DepStore;

  constructor() {
    this.depStore = new DepStore();
  }

  public parseFormDependency = (
    fieldConfig: FieldProps,
    getName?: (name: FieldNamePath) => FieldNameList,
  ) => {
    const dependencies = fieldConfig[DEP_NAME];
    if (isEmpty(dependencies)) {
      return fieldConfig;
    }
    this.depStore.parse(fieldConfig, dependencies!, getName);
    return omit(fieldConfig, [DEP_NAME]);
  };

  public getCascades = (): FieldNameList[] => this.depStore.depsByFieldNameList.getNameLists();

  public cascade = (ctx, store, cascadePayload) => {
    store.forEach((item) => {
      const cascadeFieldNameList = item.name;
      const depsOfType = this.depStore.depsByFieldNameList.get(cascadeFieldNameList);
      if (depsOfType) {
        this.depStore.triggerDependency(ctx, depsOfType, cascadePayload);
      }
    });
  };
}
