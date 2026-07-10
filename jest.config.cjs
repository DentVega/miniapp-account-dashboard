/** @type {import('jest').Config} */
module.exports = {
  preset: "react-native",
  testMatch: ["**/*.test.tsx", "**/*.test.ts"],
  // Standalone repo uses npm's flat node_modules — transform the RN family, ignore the rest.
  transformIgnorePatterns: [
    // @org/* incluido: en dev se consume ui-kit como fuente TS (file:); en registry es dist JS (no-op).
    "node_modules/(?!(?:react-native|@react-native|@react-native-community|@react-navigation|@testing-library|@shopify/flash-list|@org)/)",
  ],
  // The mocked fetch uses a short timer; forceExit avoids a hang if one is still pending.
  forceExit: true,
};
