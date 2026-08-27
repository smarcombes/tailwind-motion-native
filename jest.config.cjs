/**
 * Renders the `Motion.*` primitives on the native code path (`react-native`'s
 * jest preset targets iOS), which is the one place the Nativewind interop and
 * the Reanimated wrapper have to agree with each other.
 */
module.exports = {
  preset: "react-native",
  testMatch: ["<rootDir>/test/**/*.test.tsx"],
  setupFiles: ["<rootDir>/test/setup.cjs"],
  // The sources use ESM-style `.js` specifiers, which resolve to `.ts`/`.tsx`.
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|nativewind|react-native-css-interop|react-native-reanimated)/)",
  ],
};
