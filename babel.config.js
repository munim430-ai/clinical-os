module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
          unstable_transformImportMeta: true,
        },
      ],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin",
      ["inline-import", { extensions: [".sql"] }],
      ["@babel/plugin-transform-runtime", {
        "regenerator": true,
        "helpers": true,
        "useESModules": false
      }],
    ],
  };
};
