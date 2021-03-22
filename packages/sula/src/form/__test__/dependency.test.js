import DepStore, {
  hasOwnPropWithNameList,
  singleMatch,
  allMatch,
  equal,
} from '../dependency/DepStore';
import FormDependency from '../dependency';
import '../../__tests__/common';

const getName = (name) => [name];

describe('depstore', () => {
  describe('store', () => {
    let store;

    beforeEach(() => {
      store = new DepStore();
    });

    it('basic', () => {
      const fields = [
        {
          name: 'input',
          label: 'input',
          field: 'input',
        },
        {
          name: 'input2',
          label: 'input2',
          field: 'input',
          remoteSource: {
            url: '/source.json',
            method: 'post',
          },
          dependency: {
            value: {
              relates: ['input'],
              inputs: [['aaa']],
              output: 'one',
              defaultOutput: '',
            },
            visible: {
              relates: ['input'],
              inputs: [['hidden']],
              output: false,
              defaultOutput: true,
            },
            disabled: {
              relates: ['input'],
              inputs: [['disabled']],
              output: true,
              defaultOutput: false,
            },
            source: {
              relates: ['input'],
              inputs: [['source']],
              output: [],
              defaultOutput: [],
            },
          },
        },
      ];

      store.parse(fields[1], fields[1].dependency, getName);
      expect(store.depsByFieldNameList.getNameLists()).toEqual([['input']]);
      const inputType = store.depsByFieldNameList.get(['input']);
      expect(inputType).toMatchSnapshot();

      const depForm = {
        getFieldValueByFieldKey: jest.fn(() => 'aaa'),
        setFieldValueByFieldKey: jest.fn(),
        getFieldKeyByFieldName: jest.fn((a) => a),
        getFieldNameByFieldKey: jest.fn((a) => a),
      };

      const form = {
        setFieldDisabled: jest.fn(),
        setFieldVisible: jest.fn(),
        setFieldValue: jest.fn(),
        setFieldSource: jest.fn(),
        getFieldValue: jest.fn(() => 'aaa'),
        getFieldVisible: jest.fn(),
        getFieldDisabled: jest.fn(),
        getInternalHooks: () => {
          return depForm;
        },
      };
      store.triggerDependency({ form }, inputType, {});
      expect(form.setFieldValue).not.toHaveBeenCalled();
      expect(depForm.setFieldValueByFieldKey).toHaveBeenCalledWith(['input2'], 'one');
      expect(form.setFieldDisabled).toHaveBeenCalledWith(['input2'], false);
      expect(form.setFieldVisible).toHaveBeenCalledWith(['input2'], true);
      expect(form.setFieldSource).toHaveBeenCalledWith(['input2'], []);
    });

    it('not value dep while fileName in store', () => {
      const field = [
        {
          name: 'input',
          label: 'input',
          field: 'input',
        },
        {
          name: 'select',
          label: 'select',
          field: 'select',
          dependency: {
            value: {
              relates: ['input'],
              inputs: [['aaa']],
              output: 'one',
              defaultOutput: '',
            },
          },
        },
      ];

      store.parse(field[1], field[1].dependency, getName);
      const depForm = {
        getFieldValueByFieldKey: jest.fn(() => 'aaa'),
        setFieldValueByFieldKey: jest.fn(),
        getFieldKeyByFieldName: jest.fn((a) => a),
        getFieldNameByFieldKey: jest.fn((a) => a),
      };

      const form = {
        setFieldDisabled: jest.fn(),
        setFieldVisible: jest.fn(),
        setFieldValue: jest.fn(),
        setFieldSource: jest.fn(),
        getFieldValue: jest.fn(() => 'aaa'),
        getInternalHooks: () => {
          return depForm;
        },
      };
      const selectType = store.depsByFieldNameList.get(['input']);
      store.triggerDependency({ form }, selectType, {
        cascadeTrigger: 'setFieldsValue',
        cascadeStore: { select: 'a' },
      });
      expect(form.setFieldValue).not.toHaveBeenCalled();
    });

    it('source function type', () => {
      const field = {
        name: 'select',
        label: 'select',
        field: 'select',
        dependency: {
          source: {
            relates: ['input'],
            autoResetValue: false,
            type: () => {},
          },
        },
      };

      store.parse(field, field.dependency, getName);
      const depForm = {
        getFieldValueByFieldKey: jest.fn(() => 'aaa'),
        setFieldValueByFieldKey: jest.fn(),
        getFieldKeyByFieldName: jest.fn((a) => a),
        getFieldNameByFieldKey: jest.fn((a) => a),
      };

      const form = {
        setFieldDisabled: jest.fn(),
        setFieldVisible: jest.fn(),
        setFieldValue: jest.fn(),
        setFieldSource: jest.fn(),
        getFieldValue: jest.fn(() => 'aaa'),
        getInternalHooks: () => {
          return depForm;
        },
      };
      const selectType = store.depsByFieldNameList.get(['input']);
      store.triggerDependency({ form }, selectType, {});
      expect(depForm.setFieldValueByFieldKey).toHaveBeenCalledWith(['select'], undefined);
    });

    it('remoteSource', async () => {
      const field = {
        name: 'select',
        label: 'select',
        field: 'select',
        remoteSource: {
          url: '/source.json',
          method: 'post',
        },
        dependency: {
          source: {
            relates: ['input'],
            defaultOutput: [],
          },
        },
      };

      store.parse(field, field.dependency, getName);
      const depForm = {
        getFieldValueByFieldKey: jest.fn(() => 'input'),
        setFieldValueByFieldKey: jest.fn(),
        getFieldKeyByFieldName: jest.fn((a) => a),
        getFieldNameByFieldKey: jest.fn((a) => a),
      };

      const form = {
        setFieldDisabled: jest.fn(),
        setFieldVisible: jest.fn(),
        setFieldValue: jest.fn(),
        setFieldSource: jest.fn(),
        getFieldValue: jest.fn(() => 'input'),
        getInternalHooks: () => {
          return depForm;
        },
      };
      await store.triggerDependency({ form }, store.depsByFieldNameList.get(['input']), {});

      return store
        .cascadeSource(
          { form },
          {
            name: ['select'],
            relates: [['input']],
            autoResetValue: true,
            remoteSource: {
              url: '/source.json',
              method: 'post',
            },
          },
          {},
        )
        .then(() => {
          expect(form.setFieldValue).toHaveBeenCalledWith(['select'], undefined);
          expect(form.setFieldSource).toHaveBeenCalledWith(['select'], [{ text: 'a', value: 'a' }]);
        });
    });

    it('not remoteSource dep', () => {
      const depForm = {
        getFieldValueByFieldKey: jest.fn(() => 'input'),
        setFieldValueByFieldKey: jest.fn(),
        getFieldKeyByFieldName: jest.fn((a) => a),
        getFieldNameByFieldKey: jest.fn((a) => a),
      };

      const form = {
        setFieldDisabled: jest.fn(),
        setFieldVisible: jest.fn(),
        setFieldValue: jest.fn(),
        setFieldSource: jest.fn(),
        getFieldValue: jest.fn(() => 'input'),
        getInternalHooks: () => {
          return depForm;
        },
      };

      const res = store.cascadeSource(
        { form },
        {
          name: ['select'],
          type: () => false,
          relates: [['input']],
          autoResetValue: true,
          remoteSource: {
            url: '/source.json',
            method: 'post',
          },
        },
        {},
      );
      expect(form.setFieldSource).not.toHaveBeenCalled();
      expect(res).toBeUndefined();
    });

    it('ignore inputs', () => {
      const field = {
        name: 'select',
        label: 'select',
        field: 'select',
        dependency: {
          source: {
            relates: ['input'],
            autoResetValue: false,
            inputs: ['aaa'],
            ignores: [['a']],
            defaultOutput: [],
            output: [{ text: 'a', value: 'a' }],
          },
        },
      };

      store.parse(field, field.dependency, getName);
      const depForm = {
        getFieldValueByFieldKey: jest.fn(() => 'a'),
        setFieldValueByFieldKey: jest.fn(),
        getFieldKeyByFieldName: jest.fn((a) => a),
        getFieldNameByFieldKey: jest.fn((a) => a),
      };

      const form = {
        setFieldDisabled: jest.fn(),
        setFieldVisible: jest.fn(),
        setFieldValue: jest.fn(),
        setFieldSource: jest.fn(),
        getFieldValue: jest.fn(() => 'a'),
        getFieldVisible: jest.fn(),
        getInternalHooks: () => {
          return depForm;
        },
      };
      const selectType = store.depsByFieldNameList.get(['input']);
      store.triggerDependency({ form }, selectType, {});
      expect(form.setFieldValue).not.toHaveBeenCalled();
      expect(form.setFieldSource).toHaveBeenCalledWith(['select'], []);
    });

    it('cases', () => {
      const fields = [
        {
          name: 'input',
          label: 'input',
          field: 'input',
        },
        {
          name: 'input2',
          label: 'input2',
          field: 'input',
          dependency: {
            value: {
              relates: ['input'],
              cases: [
                {
                  inputs: [['aaa']],
                  output: 'one',
                },
                {
                  inputs: [['bbb']],
                  output: 'two',
                },
              ],
              defaultOutput: '',
            },
          },
        },
        {
          name: 'input3',
          label: 'input3',
          field: 'input',
          dependency: {
            value: {
              relates: ['input'],
              cases: [
                {
                  inputs: [['aaa']],
                  output: 'one',
                },
                {
                  inputs: [['bbb']],
                  output: 'two',
                },
              ],
              defaultOutput: '',
            },
          },
        },
        {
          name: 'input4',
          label: 'input4',
          field: 'input4',
          dependency: {
            value: {
              relates: ['input'],
              inputs: [['aaa']],
              output: '4',
              defaultOutput: '',
            },
            visible: {
              relates: ['input'],
              inputs: [['aaa']],
              output: true,
              defaultOutput: false,
            },
          },
        },
      ];

      store.parse(fields[1], fields[1].dependency, getName);
      store.parse(fields[2], fields[2].dependency, getName);
      store.parse(fields[3], fields[3].dependency, getName);

      const inputType = store.depsByFieldNameList.get(['input']);

      const depForm = {
        getFieldValueByFieldKey: jest.fn(() => 'aaa'),
        setFieldValueByFieldKey: jest.fn(),
        getFieldKeyByFieldName: jest.fn((a) => a),
        getFieldNameByFieldKey: jest.fn((a) => a),
      };

      const form = {
        setFieldDisabled: jest.fn(),
        setFieldVisible: jest.fn(),
        setFieldValue: jest.fn(),
        setFieldSource: jest.fn(),
        getFieldValue: jest.fn(() => 'aaa'),
        getFieldVisible: jest.fn(),
        getInternalHooks: () => {
          return depForm;
        },
      };
      store.triggerDependency({ form }, inputType, {});
      expect(depForm.setFieldValueByFieldKey.mock.calls).toEqual([
        [['input2'], 'one'],
        [['input3'], 'one'],
        [['input4'], '4'],
      ]);
      expect(form.getFieldVisible).toHaveBeenCalledWith(['input4']);
      expect(form.setFieldVisible).toHaveBeenCalledWith(['input4'], true);
    });
  });

  describe('utils', () => {
    it('hasOwnPropWithNameList', () => {
      expect(hasOwnPropWithNameList(['input'], { input: 'aaa' })).toBeTruthy();
      expect(hasOwnPropWithNameList(['input'], { input2: 'aaa' })).toBeFalsy();
    });

    it('equal', () => {
      expect(equal('*', [1, 2, 3])).toBeTruthy();
      expect(equal([1, 2, 3], 1)).toBeTruthy();
      expect(equal([1, 2, 3], 0)).toBeFalsy();
    });

    it('single match', () => {
      expect(
        singleMatch(
          [
            [1, 2],
            [2, 3],
          ],
          [1, 4],
        ),
      ).toBeTruthy();
      expect(
        singleMatch(
          [
            [1, 2],
            [2, 3],
          ],
          [4],
        ),
      ).toBeFalsy();
    });

    it('all match', () => {
      expect(
        allMatch(
          [
            [1, 2],
            [2, 3],
          ],
          [2, 2],
        ),
      ).toBeTruthy();
      expect(
        allMatch(
          [
            [1, 2],
            [2, 3],
          ],
          [1, 4],
        ),
      ).toBeFalsy();
    });
  });

  describe('FormDependency', () => {
    let formDependency;
    beforeEach(() => {
      formDependency = new FormDependency();
    });

    it('parseFormDependency', () => {
      expect(
        formDependency.parseFormDependency(
          {
            name: 'input2',
            label: 'input2',
            field: 'input',
            dependency: {
              value: {
                relates: ['input'],
                inputs: [['aaa']],
                output: 'one',
                defaultOutput: '',
              },
            },
          },
          getName,
        ),
      ).toEqual({ name: 'input2', label: 'input2', field: 'input' });
      expect(formDependency.depStore.depsByFieldNameList.getNameLists()).toEqual([['input']]);
      expect(formDependency.getCascades()).toEqual([['input']]);
      const depForm = {
        getFieldValueByFieldKey: jest.fn(() => 'aaa'),
        setFieldValueByFieldKey: jest.fn(),
        getFieldKeyByFieldName: jest.fn((a) => a),
        getFieldNameByFieldKey: jest.fn((a) => a),
      };

      const form = {
        setFieldDisabled: jest.fn(),
        setFieldVisible: jest.fn(),
        setFieldValue: jest.fn(),
        setFieldSource: jest.fn(),
        getFieldValue: jest.fn(() => 'aaa'),
        getInternalHooks: () => {
          return depForm;
        },
      };
      formDependency.cascade({ form }, [{ name: ['select'], value: 'a' }], {});
      expect(form.setFieldValue).not.toHaveBeenCalled();
      form.setFieldValue.mockRestore();

      formDependency.cascade({ form }, [{ name: ['input'], value: 'aaa' }], {});
      expect(depForm.setFieldValueByFieldKey).toHaveBeenCalledWith(['input2'], 'one');
      form.setFieldValue.mockRestore();
    });

    it('empty dependency', () => {
      expect(
        formDependency.parseFormDependency(
          {
            name: 'input2',
            label: 'input2',
            field: 'input',
            dependency: {},
          },
          getName,
        ),
      ).toEqual({ name: 'input2', label: 'input2', field: 'input', dependency: {} });
      expect(formDependency.depStore.depsByFieldNameList.getNameLists()).toEqual([]);
    });
  });
});
