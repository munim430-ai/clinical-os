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
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@/components": "./components",
            "@/lib": "./lib",
            "@/hooks": "./hooks",
            "@/constants": "./constants",
            "@/assets": "./assets",
            "@/types": "./types",
            "@/server": "./server",
            "@/db": "./db",
            "@insforge/sdk": "./lib/insforge.web.ts",
          },
        },
      ],
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
