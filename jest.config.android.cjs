const base = require("./jest.config.cjs");

/**
 * The same render tests, resolved as Android instead of iOS: React Native's jest
 * preset defaults to iOS, so `.android.js` files (Platform, Nativewind's native
 * modules, Reanimated's internals) are only exercised by a second run.
 *
 *   npm run test:native:android
 */
module.exports = {
  ...base,
  haste: {
    defaultPlatform: "android",
    platforms: ["android", "native"],
  },
};
