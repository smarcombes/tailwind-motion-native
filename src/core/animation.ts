import { isTimeValue, parseTimeMs, splitTopLevel } from "./css.js";
import { DEFAULT_EASING, parseEasing } from "./easing.js";
import type { MotionEasing } from "./types.js";

export type ParsedAnimation = {
  name: string;
  /** Milliseconds. */
  duration: number;
  /** Milliseconds. */
  delay: number;
  easing: MotionEasing;
  /** `-1` means infinite. */
  iterations: number;
  direction: string;
  fillMode: string;
};

const FILL_MODES = ["none", "forwards", "backwards", "both"];
const DIRECTIONS = ["normal", "reverse", "alternate", "alternate-reverse"];
const PLAY_STATES = ["running", "paused"];
const EASING_KEYWORDS = [
  "linear",
  "ease",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "step-start",
  "step-end",
];

const isEasingToken = (token: string): boolean =>
  EASING_KEYWORDS.includes(token) ||
  /^(cubic-bezier|steps|linear)\(/.test(token) ||
  /^var\(--motion-(spring-[\w-]+|bounce)\)$/.test(token);

/**
 * Parses a single CSS `animation` shorthand. Tokens are classified by shape,
 * like the CSS grammar does, because tailwindcss-motion emits 4, 5 and 6 token
 * variants depending on the utility.
 */
export const parseAnimationShorthand = (
  value: string
): ParsedAnimation | null => {
  const tokens = splitTopLevel(value, " ");
  if (tokens.length === 0) return null;

  let name: string | undefined;
  let easing: MotionEasing | undefined;
  let iterations = 1;
  let direction = "normal";
  let fillMode = "none";
  const times: number[] = [];

  for (const token of tokens) {
    if (token === "none") continue;

    if (token === "infinite") {
      iterations = -1;
      continue;
    }
    if (FILL_MODES.includes(token)) {
      fillMode = token;
      continue;
    }
    if (DIRECTIONS.includes(token)) {
      direction = token;
      continue;
    }
    if (PLAY_STATES.includes(token)) continue;

    if (isEasingToken(token)) {
      easing ??= parseEasing(token);
      continue;
    }

    if (/^[\d.]+$/.test(token)) {
      iterations = Number.parseFloat(token);
      continue;
    }

    if (isTimeValue(token)) {
      times.push(parseTimeMs(token) ?? 0);
      continue;
    }

    name ??= token;
  }

  if (!name) return null;

  return {
    name,
    duration: times[0] ?? 0,
    delay: times[1] ?? 0,
    easing: easing ?? DEFAULT_EASING,
    iterations,
    direction,
    fillMode,
  };
};

/** Splits an `animation` value into its comma separated animations. */
export const splitAnimations = (value: string): string[] =>
  splitTopLevel(value, ",").filter((part) => part !== "none");
