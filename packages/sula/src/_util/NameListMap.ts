export class NameListMap<T, K> {
  private list: Array<{ nameList: T; value: any }> = [];

  public set(nameList: T, value: K) {
    for (let i = 0, len = this.list.length; i < len; i += 1) {
      const listItem = this.list[i];
      if (matchNameList(listItem.nameList, nameList)) {
        // 更新
        this.list[i].value = value;
        return;
      }
    }
    this.list.push({
      nameList,
      value,
    });
  }

  public get(nameList: T): K {
    for (let i = 0, len = this.list.length; i < len; i += 1) {
      const listItem = this.list[i];
      if (matchNameList(listItem.nameList, nameList)) {
        return listItem.value;
      }
    }
    return null;
  }

  public getNameLists(): T[] {
    return this.list.map(item => item.nameList)
  }
}

/**
 * ['a'] ['a'] = true
 * ['a'] ['a', 'b'] = false
 */
export function matchNameList(nameListA, nameListB) {
  if (nameListA.length !== nameListB.length) {
    return false;
  }

  return nameListA.every((nameUnit, index) => nameListB[index] === nameUnit);
}
