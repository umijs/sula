import { join } from 'path';

export default {
  plugins: [
    require.resolve(join(__dirname, './packages/umi-plugin-sula/lib'))
  ],
  history: {
    type: 'hash',
  },
  sula: {},
  extraBabelPlugins: [[
    'babel-plugin-import',
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    },
  ]],
  alias: {
    sula: join(__dirname, './packages/sula/src/index.ts')
  },
  title: 'Sula',
  resolve: {
    includes: process.env.DOC_ENV === 'prod' ? ['docs'] : ['packages/sula/src'],
  },
  styles: [
    `a[title='站长统计'] { display: none; }`,
  ],
  headScripts: [
    'https://v1.cnzz.com/z_stat.php?id=1278602214&web_id=1278602214'
  ],
}
