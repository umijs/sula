import { NameListMap, matchNameList } from '../NameListMap';

describe('namelistmap', () => {
  it('match name list', () => {
    expect(matchNameList([1], [])).toBeFalsy();
    expect(matchNameList(['a'], ['a'])).toBeTruthy();
  });

  it('namelist update list', () => {
    const map = new NameListMap();

    // set
    map.set(['user', 'name'], 'Bamboo');
    map.set(['user', 'age'], 14);
    expect(map.list).toEqual([
      {
        nameList: ['user', 'name'],
        value: 'Bamboo',
      },
      {
        nameList: ['user', 'age'],
        value: 14,
      },
    ]);

    expect(map.get(['user', 'name'])).toEqual('Bamboo');
    expect(map.get(['user', 'age'])).toEqual(14);
    expect(map.get(['user', 'address'])).toBeNull();
    expect(map.get(['user'])).toBeNull();

    // update
    map.set(['user', 'name'], 'Lucy');
    expect(map.list).toEqual([
      {
        nameList: ['user', 'name'],
        value: 'Lucy',
      },
      {
        nameList: ['user', 'age'],
        value: 14,
      },
    ]);

    map.set(['user', 'address'], 'hangzhou');
    map.set(['height'], '185cm');
    expect(map.getNameLists()).toEqual([
      ['user', 'name'],
      ['user', 'age'],
      ['user', 'address'],
      ['height'],
    ]);
    expect(map.get(['height'])).toEqual('185cm');

    // delete
    map.delete(['height']);
    expect(map.getNameLists()).toEqual([
      ['user', 'name'],
      ['user', 'age'],
      ['user', 'address'],
    ]);
  });
});
