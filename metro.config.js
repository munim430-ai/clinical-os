/** @type {import('expo/metro-config').MetroConfig} */
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Resolve node_modules — in a git worktree the local node_modules dir doesn't
// exist; walk up until we find one that contains framer-motion.
const nodeModulesDir = (() => {
  const fs = require("fs");
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, "node_modules");
    if (fs.existsSync(path.join(candidate, "framer-motion"))) return candidate;
    dir = path.dirname(dir);
  }
  return path.resolve(__dirname, "node_modules");
})();

config.resolver.sourceExts.push("sql");

// Fix tslib import issues
config.resolver.extraNodeModules = {
  tslib: path.resolve(nodeModulesDir, "tslib"),
};

// Force framer-motion (pulled in by moti) to use its CJS build.
// The ESM .mjs build breaks Metro's tslib interop at static render time.
const _defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "framer-motion") {
    return {
      filePath: path.resolve(nodeModulesDir, "framer-motion/dist/cjs/index.js"),
      type: "sourceFile",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// If node_modules lives outside the project root (git worktree), Metro won't
// watch it by default — SHA-1 lookups fail. Add it explicitly.
if (!nodeModulesDir.startsWith(__dirname)) {
  config.watchFolders = [...(config.watchFolders ?? []), nodeModulesDir];
}

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
