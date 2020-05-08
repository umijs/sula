import get from 'lodash/get';
import isObject from 'lodash/isObject';
import { FieldNameList } from '../types/form';
/**
 * store {a: { b: 1}, m: undefined }  filterList [['a', 'b'], ['m'], ['n']] =>
 * [{name: ['a', 'b'], value: 1}, {name: ['m'], value: undefined}]
 */
export default function transStore(store: any, filterList: FieldNameList[]) {
  const newStore = [];
  filterList.forEach((name) => {
    if (!name.length) return;

    if (name.length === 1) {
      if (store.hasOwnProperty(name[0])) {
        newStore.push({
          name,
          value: get(store, name),
        });
      }
    } else {
      const subNamePath = name.slice(0, name.length - 1);
      const subValue = get(store, subNamePath);
      if (subValue && isObject(subValue) && subValue.hasOwnProperty(name[name.length - 1])) {
        newStore.push({
          name,
          value: get(store, name),
        });
      }
    }
  });

  return newStore;
}
