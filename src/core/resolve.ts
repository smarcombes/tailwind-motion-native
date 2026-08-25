import { parseAnimationShorthand, splitAnimations } from "./animation.js";
import { inferBaseColors } from "./colors.js";
import { evaluateCalc, parseMeasure, resolveVars } from "./css.js";
import { isSpringVar } from "./easing.js";
import { getEngine } from "./engine.js";
import { getKeyframe, type KeyframeTrack } from "./keyframes.js";
import {
  EMPTY_MOTION_SPEC,
  type MotionAnimation,
  type MotionProperty,
  type MotionSpec,
  type MotionValue,
} from "./types.js";

export type ResolveMotionOptions = {
  /**
   * Colours to animate to/from when a colour animation targets "the element's
   * own colour". Defaults to whatever the sibling `bg-*` / `text-*` classes say.
   */
  baseColors?: { backgroundColor?: string; color?: string };
};

/** The value a property sits at when no animation is driving it. */
const BASE_VALUES: Record<MotionProperty, MotionValue | null> = {
  translateX: { kind: "number", value: 0, unit: "px" },
  translateY: { kind: "number", value: 0, unit: "px" },
  scaleX: { kind: "number", value: 1, unit: "" },
  scaleY: { kind: "number", value: 1, unit: "" },
  rotate: { kind: "number", value: 0, unit: "deg" },
  opacity: { kind: "number", value: 1, unit: "" },
  blur: { kind: "number", value: 0, unit: "px" },
  grayscale: { kind: "number", value: 0, unit: "" },
  // Colours have no meaningful default: they come from the element's style.
  backgroundColor: null,
  color: null,
};

const RATIO_PROPERTIES: MotionProperty[] = [
  "scaleX",
  "scaleY",
  "opacity",
  "grayscale",
];

const isColorProperty = (property: MotionProperty): boolean =>
  property === "backgroundColor" || property === "color";

/** Turns a resolved CSS value into the numeric/colour shape the runtime wants. */
const normalizeValue = (
  property: MotionProperty,
  raw: string
): MotionValue | null => {
  const value = raw.trim();
  if (value === "") return null;

  if (isColorProperty(property)) return { kind: "color", value };

  const measure = parseMeasure(value);
  if (!measure) return null;

  if (RATIO_PROPERTIES.includes(property)) {
    // `scale: 150%` and `opacity: 100%` are ratios on the native side.
    return {
      kind: "number",
      value: measure.unit === "%" ? measure.value / 100 : measure.value,
      unit: "",
    };
  }

  if (property === "rotate") {
    return { kind: "number", value: measure.value, unit: "deg" };
  }

  if (property === "blur") {
    return { kind: "number", value: measure.value, unit: "px" };
  }

  // translateX / translateY: percentages stay relative to the element's size.
  return {
    kind: "number",
    value: measure.value,
    unit: measure.unit === "%" ? "%" : "px",
  };
};

const isMotionClass = (className: string): boolean =>
  className.startsWith("motion-") || className.startsWith("-motion-");

/**
 * A list of 100 rows usually means 100 identical class strings, and resolution
 * is deterministic, so the result is worth keeping. Only the common case (no
 * caller supplied colours) is cached, keyed by the class string itself.
 */
const CACHE_LIMIT = 500;
const cache = new Map<string, MotionSpec>();

const cached = (key: string, resolve: () => MotionSpec): MotionSpec => {
  const hit = cache.get(key);
  if (hit) return hit;

  const spec = resolve();
  if (cache.size >= CACHE_LIMIT) cache.clear();
  cache.set(key, spec);
  return spec;
};

/**
 * Resolves a Tailwind class string into native animations.
 *
 * Everything happens in plain JavaScript: the tailwindcss-motion plugin runs
 * against a mock plugin API, its custom properties and `calc()` expressions are
 * resolved, and the resulting `animation` shorthands are mapped onto the
 * properties React Native can animate.
 */
export const resolveMotion = (
  className: string | undefined,
  options: ResolveMotionOptions = {}
): MotionSpec => {
  if (!className || !className.includes("motion-")) {
    return { ...EMPTY_MOTION_SPEC, className: className ?? "" };
  }

  return options.baseColors
    ? resolveMotionUncached(className, options)
    : cached(className, () => resolveMotionUncached(className, options));
};

const resolveMotionUncached = (
  className: string,
  options: ResolveMotionOptions
): MotionSpec => {
  const engine = getEngine();
  const tokens = className.split(/\s+/).filter((token) => token.length > 0);

  const passthrough: string[] = [];
  const motionClasses: string[] = [];
  const unsupportedClasses: string[] = [];
  const vars: Record<string, string> = { ...engine.defaultVars };
  const animationSources: Array<{ className: string; value: string }> = [];
  let composition = "replace";

  const matched = tokens
    .map((token) => {
      // Variants (`dark:`, `hover:`, ...) are Nativewind's business.
      const rule = token.includes(":") ? null : engine.resolveClass(token);
      if (!rule) {
        passthrough.push(token);
        if (isMotionClass(token) && !token.includes(":")) {
          unsupportedClasses.push(token);
        }
        return null;
      }
      return rule;
    })
    .filter((rule): rule is NonNullable<typeof rule> => rule !== null);

  // Utilities override components, exactly like Tailwind's layer order.
  const ordered = [
    ...matched.filter((rule) => rule.layer === "components"),
    ...matched.filter((rule) => rule.layer === "utilities"),
  ];

  ordered.forEach((rule) => {
    motionClasses.push(rule.className);
    let contributes = false;

    Object.entries(rule.declarations).forEach(([property, value]) => {
      if (property.startsWith("--")) {
        vars[property] = value;
        contributes = true;
        return;
      }
      if (property === "animation") {
        animationSources.push({ className: rule.className, value });
        contributes = true;
        return;
      }
      if (property === "animationComposition" || property === "animation-composition") {
        composition = value;
      }
    });

    if (!contributes) unsupportedClasses.push(rule.className);
  });

  const baseColors =
    options.baseColors ?? inferBaseColors(passthrough);

  const resolveTrackValue = (
    property: MotionProperty,
    varName: string | null
  ): MotionValue | null => {
    if (varName === null) {
      if (property === "backgroundColor" && baseColors.backgroundColor) {
        return { kind: "color", value: baseColors.backgroundColor };
      }
      if (property === "color" && baseColors.color) {
        return { kind: "color", value: baseColors.color };
      }
      return BASE_VALUES[property];
    }

    const raw = vars[varName];
    if (raw === undefined) return null;

    const resolved = evaluateCalc(
      resolveVars(raw, vars, { keepSymbolic: isSpringVar })
    );
    return normalizeValue(property, resolved);
  };

  const animations: MotionAnimation[] = [];
  const seen = new Map<string, number>();

  const pushAnimation = (animation: MotionAnimation): void => {
    const existing = seen.get(animation.id);
    if (existing !== undefined) {
      animations[existing] = animation;
      return;
    }
    seen.set(animation.id, animations.length);
    animations.push(animation);
  };

  // Later `animation` declarations win in CSS, but the enter/exit/loop lists are
  // disjoint, so unioning them lets one element combine all three.
  const seenAnimationValues = new Set<string>();

  animationSources.forEach((source) => {
    const resolved = evaluateCalc(
      resolveVars(source.value, vars, { keepSymbolic: isSpringVar })
    );

    let supported = false;

    splitAnimations(resolved).forEach((shorthand) => {
      if (seenAnimationValues.has(shorthand)) {
        supported = true;
        return;
      }
      seenAnimationValues.add(shorthand);

      const parsed = parseAnimationShorthand(shorthand);
      if (!parsed) return;

      const keyframe = getKeyframe(parsed.name);
      if (!keyframe) return;
      supported = true;

      keyframe.tracks.forEach((track: KeyframeTrack) => {
        const from = resolveTrackValue(track.property, track.from);
        let to = resolveTrackValue(track.property, track.to);

        if (!from || !to) return;

        // Loop utilities compose on top of the element's own value; the plugin
        // pre-subtracts the neutral opacity so CSS can `accumulate`.
        if (
          keyframe.phase === "loop" &&
          track.property === "opacity" &&
          composition === "accumulate" &&
          to.kind === "number"
        ) {
          to = { ...to, value: to.value + 1 };
        }

        if (
          from.kind === "number" &&
          to.kind === "number" &&
          from.value === to.value
        ) {
          return;
        }

        pushAnimation({
          id: `${keyframe.phase}:${track.property}`,
          property: track.property,
          phase: keyframe.phase,
          ...(keyframe.loopMode ? { loopMode: keyframe.loopMode } : {}),
          from,
          to,
          duration: parsed.duration,
          delay: parsed.delay,
          iterations: parsed.iterations,
          easing: parsed.easing,
        });
      });
    });

    if (!supported && !unsupportedClasses.includes(source.className)) {
      unsupportedClasses.push(source.className);
    }
  });

  return {
    animations,
    className: passthrough.join(" "),
    motionClasses,
    unsupportedClasses,
  };
};
