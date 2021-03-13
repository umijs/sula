import { FieldNameList } from "../../types/form";

export default function get(entity: any, path: (string | number)[]) {
  let current = entity;

  for (let i = 0; i < path.length; i += 1) {
    if (current === null || current === undefined) {
      return undefined;
    }

    current = current[path[i]];
  }

  return current;
}

export function getStoreValue(store: Record<string, any>, namePath: FieldNameList) {
  const value = get(store, namePath);
  return value;
}