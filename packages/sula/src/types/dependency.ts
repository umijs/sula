import { FieldNamePath, FieldNameList } from './form';
import { DependencyPlugin } from './plugin';

export type DependencyType = 'source' | 'value' | 'visible' | 'disabled';

export interface Dependency {
  relates: FieldNamePath[];
  inputs?: any[][];
  ignores?: any[][];
  output?: any;
  defaultOutput?: any;
  type?: DependencyPlugin;
  cases?: Dependency[];
  autoResetValue?: boolean; // 只有在source关联有效，默认为true
}

export interface TransedDependency extends Dependency {
  name: FieldNameList;
}


type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type TransedDependencies = PartialRecord<DependencyType, TransedDependency[][]>;

export type Dependencies = PartialRecord<DependencyType, Dependency>;
