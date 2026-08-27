/**
 * tailwind-motion-native
 *
 * tailwindcss-motion animation classes, resolved at runtime and played through
 * Reanimated, for Expo + Nativewind apps.
 */
export {
  Motion,
  MotionImage,
  MotionScrollView,
  MotionText,
  MotionView,
} from "./native/components.js";
export {
  motion,
  type MotionComponent,
  type MotionOnlyProps,
  type MotionProps,
} from "./native/motion.js";
export { useMotion, type UseMotionOptions } from "./native/useMotion.js";
export { resolveMotiProps, type MotiMotionProps } from "./native/moti.js";
export {
  configureMotion,
  getMotionConfig,
  type MotionConfig,
} from "./native/config.js";
export * from "./core/index.js";
