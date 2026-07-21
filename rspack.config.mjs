import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Re.Pack config for the `account_dashboard` federated remote.
 * Exposes "./Entry"; the host downloads and mounts it on demand (Bolt 4).
 * Shared singletons MUST stay compatible with what the host provides.
 */
export default Repack.defineRspackConfig({
  context: __dirname,
  entry: './src/Entry.tsx',
  resolve: {
    ...Repack.getResolveOptions(),
  },
  module: {
    rules: [
      {
        test: /\.[cm]?[jt]sx?$/,
        type: 'javascript/auto',
        use: {
          loader: '@callstack/repack/babel-swc-loader',
          parallel: true,
          options: {},
        },
      },
      ...Repack.getAssetTransformRules(),
    ],
  },
  plugins: [
    new Repack.RepackPlugin(),
    new Repack.plugins.ModuleFederationPluginV2({
      name: 'account_dashboard',
      filename: 'account_dashboard.container.js.bundle',
      exposes: {
        './Entry': './src/Entry.tsx',
      },
      // NOT eager on a remote; consumed from the host's shared scope.
      shared: {
        react: { singleton: true, eager: false, requiredVersion: '18.3.1' },
        'react-native': { singleton: true, eager: false, requiredVersion: '0.76.6' },
        '@tanstack/react-query': { singleton: true, requiredVersion: '^5.0.0' },
        '@shopify/flash-list': { singleton: true, requiredVersion: '^1.7.0' },
        // Stateful/context lib (ThemeProvider/useTheme): MUST be a singleton so the
        // miniapp consumes the HOST's copy and its ThemeProvider, not a private one.
        '@dentvega/ui-kit': { singleton: true, eager: false, requiredVersion: '^0.1.0' },
      },
    }),
  ],
});
