const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * Blocks the library's peerDependencies at the root and aliases them to the
 * versions in the example's node_modules so only one copy is ever bundled.
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
  // The repo is not a yarn workspaces monorepo, so list the packages manually
  workspaces: ['example'],
});

module.exports = config;
