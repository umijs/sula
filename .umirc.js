import { join } from 'path';

export default {
  plugins: [join(__dirname, './packages/umi-plugin-sula/src')],
  sula: {},
  outputPath: '.doc',
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
    '@sula/charts': join(__dirname, './packages/sula-charts/src'),
  },
  title: 'Sula',
  resolve: {
    includes: ['docs'],
  },
  styles: [`a[title='站长统计'] { display: none; }`],
  headScripts: ['https://v1.cnzz.com/z_stat.php?id=1278602214&web_id=1278602214'],
};
