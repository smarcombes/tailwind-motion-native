/** Style properties tailwindcss-motion animations can drive on React Native. */
export type MotionProperty =
  | "translateX"
  | "translateY"
  | "scaleX"
  | "scaleY"
  | "rotate"
  | "opacity"
  | "blur"
  | "grayscale"
  | "backgroundColor"
  | "color";

export type MotionPhase = "enter" | "exit" | "loop";

/** `mirror` goes there and back, `reset` snaps back and starts over. */
export type MotionLoopMode = "mirror" | "reset";

export type MotionNumberValue = {
  kind: "number";
  value: number;
  /** `%` is relative to the element's own size, matching CSS `translate`. */
  unit: "" | "%" | "px" | "deg";
};

export type MotionColorValue = { kind: "color"; value: string };

export type MotionValue = MotionNumberValue | MotionColorValue;

/**
 * A CSS timing function, kept as data so the resolver stays free of any
 * React Native imports. `src/native/easing.ts` turns these into Reanimated
 * animations.
 */
export type MotionEasing =
  | { type: "linear" }
  | { type: "bezier"; points: [number, number, number, number] }
  | { type: "steps"; count: number; position: "start" | "end" }
  /** A CSS spring easing, expressed the way Reanimated wants it. */
  | { type: "spring"; dampingRatio: number }
  | { type: "bounce" };

/** One property animating from A to B — the unit of work the runtime plays. */
export type MotionAnimation = {
  /** Stable key, e.g. `enter:translateY`. */
  id: string;
  property: MotionProperty;
  phase: MotionPhase;
  loopMode?: MotionLoopMode;
  from: MotionValue;
  to: MotionValue;
  /** Milliseconds. */
  duration: number;
  /** Milliseconds. */
  delay: number;
  /** `-1` means infinite. */
  iterations: number;
  easing: MotionEasing;
};

export type MotionSpec = {
  animations: MotionAnimation[];
  /** Classes that aren't ours, to hand back to Nativewind untouched. */
  className: string;
  /** The `motion-*` classes that were recognized. */
  motionClasses: string[];
  /** `motion-*` classes with no React Native equivalent (dev warnings). */
  unsupportedClasses: string[];
};

export const EMPTY_MOTION_SPEC: MotionSpec = {
  animations: [],
  className: "",
  motionClasses: [],
  unsupportedClasses: [],
};
