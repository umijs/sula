import Field, { FieldOption } from '@alifd/field';
import { FormInstance } from '@sula-form/core';

export interface InternalHooks {
  createForm: (options: FieldOption) => void;
  getInnerForm: () => Field;
}

export type InternalFormInstance = FormInstance & {
  /**
   * Form component should register some content into store.
   * We pass the `HOOK_MARK` as key to avoid user call the function.
   */
  getInternalHooks(secret: string): InternalHooks;
};
