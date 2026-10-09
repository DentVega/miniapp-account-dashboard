/** @type {import('jest').Config} */
module.exports = {
  preset: "react-native",
  testMatch: ["**/*.test.tsx", "**/*.test.ts"],
  // Transform the RN family, ignore the rest. `\\.pnpm` keeps pnpm's store path
  // (node_modules/.pnpm/<pkg>/node_modules/<pkg>) from being ignored at its first segment.
  transformIgnorePatterns: [
    // @dentvega/* incluido: el dist de ui-kit es ESM (`export`) y jest corre en CJS.
    "node_modules/(?!(?:\\.pnpm|react-native|@react-native|@react-native-community|@react-navigation|@testing-library|@shopify/flash-list|@dentvega)/)",
  ],
  // The mocked fetch uses a short timer; forceExit avoids a hang if one is still pending.
  forceExit: true,
};
