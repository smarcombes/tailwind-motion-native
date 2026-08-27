/**
 * Only used by the jest render tests; the package itself is built by bob.
 *
 * The Reanimated plugin is here for the same reason it is in every Expo app
 * (`babel-preset-expo` includes it): without it Reanimated can't step its
 * animations. The library itself never relies on it — `useAnimatedStyle` is
 * always called with an explicit dependency array, and no worklets are written
 * by hand.
 */
module.exports = {
  presets: ["@react-native/babel-preset"],
  plugins: ["react-native-reanimated/plugin"],
};
