/**
 * The dependency-free half of the library: everything needed to turn
 * tailwindcss-motion classes into animation data, with no React Native imports.
 * Useful for tests, tooling and codegen.
 */
export { resolveMotion, type ResolveMotionOptions } from "./resolve.js";
export { createEngine, getEngine, type MotionEngine } from "./engine.js";
export { KEYFRAMES, getKeyframe } from "./keyframes.js";
export { parseAnimationShorthand, splitAnimations } from "./animation.js";
export { parseEasing, SPRING_VAR_NAMES, isSpringVar } from "./easing.js";
export { evaluateCalc, resolveVars, parseMeasure, splitTopLevel } from "./css.js";
export { lookupColor, inferBaseColors } from "./colors.js";
export { UPSTREAM_VERSION } from "./plugin/index.js";
export type {
  MotionAnimation,
  MotionEasing,
  MotionLoopMode,
  MotionPhase,
  MotionProperty,
  MotionSpec,
  MotionValue,
} from "./types.js";
