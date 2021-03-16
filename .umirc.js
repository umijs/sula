export default {
  outputPath: '.doc',
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
    [
      'babel-plugin-import',
      {
        libraryName: '@alifd/next',
        style: true,
      },
      'fusion',
    ],
  ],
  title: 'sula-next',
  exportStatic: {},
  // resolve: {
  //   includes: ['docs'],
  // },
  styles: [`a[title='站长统计'] { display: none; }`],
  headScripts: ['https://v1.cnzz.com/z_stat.php?id=1278602214&web_id=1278602214'],
};
