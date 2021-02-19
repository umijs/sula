import React from 'react';
import {QueryResults} from 'react-media';
import { FormInstance } from '../types/form';
import { NormalizedItemLayout, Layout } from './FieldGroup';


export const HOOK_MARK = 'SULA_FORM_INTERNAL_HOOKS';

export const rootGroupName = '@@root_group_name';

export interface FieldGroupContextProps {
  formContext: {
    getInternalHooks: () => any;
  },
  itemLayout: NormalizedItemLayout;
  layout: Layout;
  parentGroupName: string;
  isList?: boolean;
  matchedPoint?: QueryResults; 
}

const FieldGroupContext = React.createContext<FieldGroupContextProps>({
} as FieldGroupContextProps);

export default FieldGroupContext;