// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const con = getDefaultConfig(__dirname);

// Let Metro treat .wasm files as assets.
if (!con.resolver.assetExts.includes('wasm')) {
  con.resolver.assetExts.push('wasm');
}

// Keep package exports enabled so Metro can resolve conditional exports.
// This is the default in newer Metro versions, but older/custom configs may disable it.
con.resolver.unstable_enablePackageExports = true;

module.exports = con;