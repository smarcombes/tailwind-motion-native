import { splitTopLevel } from "./css.js";
import type { MotionEasing } from "./types.js";

/**
 * tailwindcss-motion ships its springs as multi-stop `linear()` easings
 * generated from a damping ratio (see https://www.kvin.me/css-springs). CSS has
 * no spring primitive; Reanimated does, so instead of replaying 40 stops we
 * recover the damping ratio the curve was generated from.
 *
 * `dampingRatio = 1 - bounce`, which reproduces each curve's overshoot to
 * within a thousandth (bounciest peaks at 1.509, ζ=0.2 predicts 1.527).
 */
const SPRING_DAMPING_RATIOS: Record<string, number> = {
  "--motion-spring-smooth": 1,
  "--motion-spring-snappy": 0.85,
  "--motion-spring-bouncy": 0.7,
  "--motion-spring-bouncier": 0.5,
  "--motion-spring-bounciest": 0.2,
};

/** Custom properties `resolveVars` must leave alone for the mapping above. */
export const SPRING_VAR_NAMES = [
  ...Object.keys(SPRING_DAMPING_RATIOS),
  "--motion-bounce",
];

export const isSpringVar = (name: string): boolean =>
  SPRING_VAR_NAMES.includes(name);

const KEYWORD_EASINGS: Record<string, MotionEasing> = {
  linear: { type: "linear" },
  ease: { type: "bezier", points: [0.25, 0.1, 0.25, 1] },
  "ease-in": { type: "bezier", points: [0.42, 0, 1, 1] },
  "ease-out": { type: "bezier", points: [0, 0, 0.58, 1] },
  "ease-in-out": { type: "bezier", points: [0.42, 0, 0.58, 1] },
  "step-start": { type: "steps", count: 1, position: "start" },
  "step-end": { type: "steps", count: 1, position: "end" },
};

export const DEFAULT_EASING: MotionEasing = {
  // `--motion-timing`'s initial value: cubic-bezier(.165, .84, .44, 1).
  type: "bezier",
  points: [0.165, 0.84, 0.44, 1],
};

const parseCubicBezier = (value: string): MotionEasing | null => {
  const points = splitTopLevel(value.slice("cubic-bezier(".length, -1), ",")
    .map((arg) => Number.parseFloat(arg))
    .filter((arg) => Number.isFinite(arg));

  if (points.length !== 4) return null;
  return {
    type: "bezier",
    points: [points[0], points[1], points[2], points[3]],
  };
};

const parseSteps = (value: string): MotionEasing | null => {
  const args = splitTopLevel(value.slice("steps(".length, -1), ",");
  const count = Number.parseInt(args[0] ?? "", 10);
  if (!Number.isFinite(count) || count < 1) return null;
  const position = args[1]?.includes("start") ? "start" : "end";
  return { type: "steps", count, position };
};

/**
 * A raw `linear(...)` curve. We can't replay arbitrary stops with Reanimated's
 * easings, but we can tell a spring apart from a decelerating curve: springs
 * overshoot past 1.
 */
const parseLinearStops = (value: string): MotionEasing => {
  const stops = splitTopLevel(value.slice("linear(".length, -1), ",")
    .map((stop) => Number.parseFloat(stop))
    .filter((stop) => Number.isFinite(stop));

  const peak = stops.length > 0 ? Math.max(...stops) : 1;
  if (peak <= 1.001) return { type: "spring", dampingRatio: 1 };

  // Invert the standard overshoot formula: peak - 1 = exp(-πζ / sqrt(1 - ζ²)).
  const overshoot = Math.min(peak - 1, 0.95);
  const logOvershoot = Math.log(overshoot);
  const dampingRatio = Math.sqrt(
    logOvershoot ** 2 / (Math.PI ** 2 + logOvershoot ** 2)
  );

  return {
    type: "spring",
    dampingRatio: Math.min(Math.max(dampingRatio, 0.05), 1),
  };
};

/** Maps a CSS `animation-timing-function` value onto a Reanimated-friendly shape. */
export const parseEasing = (raw: string | undefined): MotionEasing => {
  if (!raw) return DEFAULT_EASING;
  const value = raw.trim();

  const springVar = /^var\((--motion-[\w-]+)\)$/.exec(value);
  if (springVar) {
    const name = springVar[1];
    if (name === "--motion-bounce") return { type: "bounce" };
    const dampingRatio = SPRING_DAMPING_RATIOS[name];
    if (dampingRatio !== undefined) return { type: "spring", dampingRatio };
    return DEFAULT_EASING;
  }

  const keyword = KEYWORD_EASINGS[value];
  if (keyword) return keyword;

  if (value.startsWith("cubic-bezier(") && value.endsWith(")")) {
    return parseCubicBezier(value) ?? DEFAULT_EASING;
  }

  if (value.startsWith("steps(") && value.endsWith(")")) {
    return parseSteps(value) ?? DEFAULT_EASING;
  }

  if (value.startsWith("linear(") && value.endsWith(")")) {
    return parseLinearStops(value);
  }

  return DEFAULT_EASING;
};

/** `true` for easings whose timing is driven by physics rather than a duration. */
export const isSpringEasing = (
  easing: MotionEasing
): easing is { type: "spring"; dampingRatio: number } => easing.type === "spring";
