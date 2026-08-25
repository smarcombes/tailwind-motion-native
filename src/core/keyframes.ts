import type { MotionLoopMode, MotionPhase, MotionProperty } from "./types.js";

/**
 * One animated property inside a CSS keyframe animation. `from`/`to` name the
 * custom property holding the value; `null` means "the element's own value"
 * (1 for scale, 0 for translate, the style's colour, ...), which is how
 * tailwindcss-motion's keyframes are written.
 */
export type KeyframeTrack = {
  property: MotionProperty;
  from: string | null;
  to: string | null;
};

export type KeyframeDefinition = {
  phase: MotionPhase;
  loopMode?: MotionLoopMode;
  tracks: KeyframeTrack[];
};

const loop = (
  tracks: KeyframeTrack[],
  loopMode: MotionLoopMode
): KeyframeDefinition => ({ phase: "loop", loopMode, tracks });

/**
 * The native counterpart of `src/core/plugin/keyframes.ts`. Every animation name
 * the plugin can emit maps to the properties it drives.
 */
export const KEYFRAMES: Record<string, KeyframeDefinition> = {
  "motion-scale-in": {
    phase: "enter",
    tracks: [
      { property: "scaleX", from: "--motion-origin-scale-x", to: null },
      { property: "scaleY", from: "--motion-origin-scale-y", to: null },
    ],
  },
  "motion-scale-out": {
    phase: "exit",
    tracks: [
      { property: "scaleX", from: null, to: "--motion-end-scale-x" },
      { property: "scaleY", from: null, to: "--motion-end-scale-y" },
    ],
  },
  "motion-translate-in": {
    phase: "enter",
    tracks: [
      { property: "translateX", from: "--motion-origin-translate-x", to: null },
      { property: "translateY", from: "--motion-origin-translate-y", to: null },
    ],
  },
  "motion-translate-out": {
    phase: "exit",
    tracks: [
      { property: "translateX", from: null, to: "--motion-end-translate-x" },
      { property: "translateY", from: null, to: "--motion-end-translate-y" },
    ],
  },
  "motion-rotate-in": {
    phase: "enter",
    tracks: [{ property: "rotate", from: "--motion-origin-rotate", to: null }],
  },
  "motion-rotate-out": {
    phase: "exit",
    tracks: [{ property: "rotate", from: null, to: "--motion-end-rotate" }],
  },
  "motion-filter-in": {
    phase: "enter",
    tracks: [
      { property: "blur", from: "--motion-origin-blur", to: null },
      { property: "grayscale", from: "--motion-origin-grayscale", to: null },
    ],
  },
  "motion-filter-out": {
    phase: "exit",
    tracks: [
      { property: "blur", from: null, to: "--motion-end-blur" },
      { property: "grayscale", from: null, to: "--motion-end-grayscale" },
    ],
  },
  "motion-opacity-in": {
    phase: "enter",
    tracks: [{ property: "opacity", from: "--motion-origin-opacity", to: null }],
  },
  "motion-opacity-out": {
    phase: "exit",
    tracks: [{ property: "opacity", from: null, to: "--motion-end-opacity" }],
  },
  "motion-background-color-in": {
    phase: "enter",
    tracks: [
      {
        property: "backgroundColor",
        from: "--motion-origin-background-color",
        to: null,
      },
    ],
  },
  "motion-background-color-out": {
    phase: "exit",
    tracks: [
      {
        property: "backgroundColor",
        from: null,
        to: "--motion-end-background-color",
      },
    ],
  },
  "motion-text-color-in": {
    phase: "enter",
    tracks: [{ property: "color", from: "--motion-origin-text-color", to: null }],
  },
  "motion-text-color-out": {
    phase: "exit",
    tracks: [{ property: "color", from: null, to: "--motion-end-text-color" }],
  },
};

const LOOP_TRACKS: Record<string, KeyframeTrack[]> = {
  "motion-scale-loop": [
    { property: "scaleX", from: null, to: "--motion-loop-scale-x" },
    { property: "scaleY", from: null, to: "--motion-loop-scale-y" },
  ],
  "motion-translate-loop": [
    { property: "translateX", from: null, to: "--motion-loop-translate-x" },
    { property: "translateY", from: null, to: "--motion-loop-translate-y" },
  ],
  "motion-rotate-loop": [
    { property: "rotate", from: null, to: "--motion-loop-rotate" },
  ],
  "motion-filter-loop": [
    { property: "blur", from: null, to: "--motion-loop-blur" },
    { property: "grayscale", from: null, to: "--motion-loop-grayscale" },
  ],
  "motion-opacity-loop": [
    { property: "opacity", from: null, to: "--motion-loop-opacity" },
  ],
  "motion-background-color-loop": [
    {
      property: "backgroundColor",
      from: null,
      to: "--motion-loop-background-color",
    },
  ],
  "motion-text-color-loop": [
    { property: "color", from: null, to: "--motion-loop-text-color" },
  ],
};

Object.entries(LOOP_TRACKS).forEach(([name, tracks]) => {
  KEYFRAMES[`${name}-mirror`] = loop(tracks, "mirror");
  KEYFRAMES[`${name}-reset`] = loop(tracks, "reset");
});

export const getKeyframe = (name: string): KeyframeDefinition | undefined =>
  KEYFRAMES[name];
