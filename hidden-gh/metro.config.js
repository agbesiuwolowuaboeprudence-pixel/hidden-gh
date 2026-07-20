const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package.json "exports" field resolution so @expo/metro-runtime
// can resolve its rsc/runtime subpath export correctly.
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
