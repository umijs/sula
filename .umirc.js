import { join } from 'path';

export default {
  plugins: [
    require.resolve(join(__dirname, './packages/umi-plugin-sula/src')),
  ],
  history: {
    type: 'hash',
  },
  sula: {},
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  alias: {
    sula: process.env.DOC_ENV === 'prod' ? 'sula' : join(__dirname, './packages/sula/src/index.ts'),
  },
  title: 'Sula',
  resolve: {
    includes:
      process.env.DOC_ENV === 'prod' || process.env.DOC_ENV === 'dev'
        ? ['docs']
        : process.env.DOC_ENV === 'new'
        ? ['newDocs']
        : ['packages/sula/src'],
  },
  styles: [`a[title='站长统计'] { display: none; }`],
  headScripts: ['https://v1.cnzz.com/z_stat.php?id=1278602214&web_id=1278602214'],
};
