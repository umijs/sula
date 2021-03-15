export default {
  cjs: { type: "babel", lazy: true },
  esm: {
    type: "babel",
    importLibToEs: true,
  },
  pkgs: [],
  extraBabelPlugins: [
    [
      "babel-plugin-import",
      { libraryName: "antd", libraryDirectory: "es", style: true },
      "antd",
    ],
  ],
};
