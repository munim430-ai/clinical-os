/** @type {import('expo/metro-config').MetroConfig} */
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql");

// Fix tslib import issues
config.resolver.extraNodeModules = {
  tslib: path.resolve(__dirname, "node_modules/tslib"),
};

// Add wasm asset support
config.resolver.assetExts.push("wasm");

config.resolver.unstable_conditionNames = [
  "browser",
  "require",
  "react-native",
];

// Add COEP and COOP headers to support SharedArrayBuffer
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    middleware(req, res, next);
  };
};

module.exports = withNativeWind(config, {
  input: "./app/global.css",
  configPath: "./tailwind.config.ts",
});
