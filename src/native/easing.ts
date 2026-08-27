import {
  Easing,
  withSpring,
  withTiming,
  type EasingFunctionFactory,
  type WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";
import type { MotionEasing } from "../core/types.js";

const toEasingFunction = (
  easing: MotionEasing
): EasingFunctionFactory | ((value: number) => number) => {
  switch (easing.type) {
    case "linear":
      return Easing.linear;
    case "bezier":
      return Easing.bezier(...easing.points);
    case "steps":
      return Easing.steps(easing.count, easing.position === "start");
    case "bounce":
      return Easing.bounce;
    default:
      return Easing.out(Easing.cubic);
  }
};

/**
 * Builds the Reanimated animation for one resolved animation step.
 *
 * CSS spring easings become real Reanimated springs: `duration` already carries
 * tailwindcss-motion's perceptual multiplier, which is the same "time until it
 * settles" that `withSpring` expects.
 */
export const buildAnimation = (
  toValue: number,
  easing: MotionEasing,
  duration: number
): number => {
  if (easing.type === "spring") {
    const config: WithSpringConfig = {
      duration: Math.max(duration, 1),
      dampingRatio: easing.dampingRatio,
    };
    return withSpring(toValue, config);
  }

  const config: WithTimingConfig = {
    duration: Math.max(duration, 0),
    easing: toEasingFunction(easing) as WithTimingConfig["easing"],
  };
  return withTiming(toValue, config);
};
