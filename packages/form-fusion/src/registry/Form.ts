import Field, { FieldOption } from '@alifd/field';
import { NamePath, Store } from '@sula-form/core';
import { warning, RecursivePartial } from '@sula/shared';
import { InternalFormInstance, InternalHooks } from '../types';

export const HOOK_MARK = 'FUSION_FORM_INTERNAL_HOOKS';

export class RegistryForm {
  private form: Field = null!;

  private getFieldsValue = (nameList?: NamePath[]): Store => {
    /** nameList 格式转一下，然后把数据拿出来 */
    return this.form.getValues<Store>(nameList);
  }

  private setFieldsValue = (fieldsValue: RecursivePartial<Store>): void => {

  }

  private validateFields = (nameList?: NamePath[]) : Promise<Store> => {
    
  };
  private validateFieldGroup = (groupName: NamePath) : Promise<Store> => {

  };

  public getForm = () : InternalFormInstance => {
    return {
      getFieldsValue: this.getFieldsValue,
      setFieldsValue: this.setFieldsValue,
      validateFields: this.validateFields,
      validateFieldGroup: this.validateFieldGroup,

      getInternalHooks: this.getInternalHooks,
    }
  }

  // ============== Internal Hooks =================
  private getInternalHooks = (secret: string): InternalHooks => {
    if(secret === HOOK_MARK) {

      return {
        createForm: this.createForm,
        getInnerForm: this.getInnerForm,
      }
    }

    warning(false, '`getInternalHooks` is internal usage. Should not call directly.' ,'Form')
    
    return null!;
  }

  private createForm = (options: FieldOption) => {
    this.form = Field.create({setState: () => {}}, options);
  }

  private getInnerForm = (): Field => {
    return this.form;
  }
}

