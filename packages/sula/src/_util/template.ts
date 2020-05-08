const compile = require('tplstr/compile');
const resolveToArray = require('tplstr/resolve-to-array');

export default function (
  stringTemplate: string,
  params: Record<string, string | number | boolean>,
) {
  if (typeof stringTemplate !== 'string' || stringTemplate === '') return stringTemplate;

  const compiled = compile(stringTemplate);
  const resolvedArray = resolveToArray(compiled, params);

  /**
   * ['', 123, ''] => 123
   * 存在解析变量
   */
  const resolvedArrayLength = resolvedArray.length;
  if (
    resolvedArrayLength === 3 &&
    resolvedArray[0] === '' &&
    resolvedArray[resolvedArrayLength - 1] === ''
  ) {
    return resolvedArray[1];
  }

  return resolvedArray.reduce((memo: string, item: string) => {
    memo += item;
    return memo;
  }, '');
}
