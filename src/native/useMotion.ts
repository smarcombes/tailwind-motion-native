import { useCallback, useEffect, useMemo, useRef } from "react";
import type { LayoutChangeEvent } from "react-native";
import {
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  type SharedValue,
} from "react-native-reanimated";
import { resolveMotion, type ResolveMotionOptions } from "../core/resolve.js";
import type {
  MotionAnimation,
  MotionProperty,
  MotionSpec,
} from "../core/types.js";
import { getMotionConfig, warnUnsupported } from "./config.js";
import { buildAnimation } from "./easing.js";

const NUMERIC_PROPERTIES = [
  "translateX",
  "translateY",
  "rotate",
  "scaleX",
  "scaleY",
  "opacity",
  "blur",
  "grayscale",
] as const;

type NumericProperty = (typeof NUMERIC_PROPERTIES)[number];

/** Properties dropped when the user asks for reduced motion. */
const MOVEMENT_PROPERTIES: MotionProperty[] = [
  "translateX",
  "translateY",
  "scaleX",
  "scaleY",
  "rotate",
];

const BASE_VALUE: Record<NumericProperty, number> = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
  blur: 0,
  grayscale: 0,
};

export type UseMotionOptions = ResolveMotionOptions & {
  /** Set to `false` to render the final state without animating. */
  enabled?: boolean;
  /** Replays the enter animation whenever this value changes. */
  replayKey?: unknown;
  /** Called once the enter animation should be done (approximate). */
  onMotionEnd?: () => void;
};

type Plan = {
  spec: MotionSpec;
  /** Where each property sits before the animation starts. */
  initial: Record<NumericProperty, number>;
  /** Where each property ends up, for `motionEnabled={false}` and reduced motion. */
  settled: Record<NumericProperty, number>;
  units: Record<NumericProperty, string>;
  animated: Record<MotionProperty, boolean>;
  colors: {
    backgroundColor?: { from: string; to: string };
    color?: { from: string; to: string };
  };
  enterDuration: number;
  /** `true` when a translate animation is expressed as a percentage. */
  usesTranslatePercentage: boolean;
};

const numberOf = (animation: MotionAnimation, end: "from" | "to"): number => {
  const value = animation[end];
  return value.kind === "number" ? value.value : 0;
};

const buildPlan = (spec: MotionSpec): Plan => {
  const initial = { ...BASE_VALUE };
  const settled = { ...BASE_VALUE };
  const units: Record<string, string> = {};
  const animated: Record<string, boolean> = {};
  const colors: Plan["colors"] = {};
  let enterDuration = 0;

  const byProperty = new Map<string, MotionAnimation>();
  spec.animations.forEach((animation) => {
    // An enter animation defines the starting point; a loop only borrows it.
    const existing = byProperty.get(animation.property);
    if (!existing || animation.phase === "enter") {
      byProperty.set(animation.property, animation);
    }
  });

  spec.animations.forEach((animation) => {
    animated[animation.property] = true;

    if (animation.phase === "enter") {
      enterDuration = Math.max(
        enterDuration,
        animation.delay + animation.duration
      );
    }

    if (animation.from.kind === "color" && animation.to.kind === "color") {
      const track = { from: animation.from.value, to: animation.to.value };
      if (animation.property === "backgroundColor") colors.backgroundColor = track;
      if (animation.property === "color") colors.color = track;
      return;
    }

    if (animation.from.kind !== "number" || animation.to.kind !== "number") {
      return;
    }

    const property = animation.property as NumericProperty;
    units[property] =
      animation.from.unit === "%" || animation.to.unit === "%"
        ? "%"
        : animation.from.unit || animation.to.unit;

    if (byProperty.get(property) === animation) {
      initial[property] = numberOf(animation, "from");
      // A loop settles back where it started; everything else at its target.
      settled[property] =
        animation.phase === "loop"
          ? numberOf(animation, "from")
          : numberOf(animation, "to");
    }
  });

  return {
    spec,
    initial,
    settled,
    units: units as Record<NumericProperty, string>,
    animated: animated as Record<MotionProperty, boolean>,
    colors,
    enterDuration,
    usesTranslatePercentage:
      units.translateX === "%" || units.translateY === "%",
  };
};

/**
 * Resolves `motion-*` classes and drives them with Reanimated.
 *
 * Returns the animated style plus the classes that weren't ours, so a component
 * can hand those straight to Nativewind.
 */
export const useMotion = (
  className?: string,
  options: UseMotionOptions = {}
) => {
  const { enabled = true, replayKey, onMotionEnd, baseColors } = options;
  const config = getMotionConfig();
  const reducedMotion = useReducedMotion();

  const plan = useMemo(
    () => buildPlan(resolveMotion(className, { baseColors })),
    [className, baseColors]
  );

  useEffect(() => {
    warnUnsupported(plan.spec.unsupportedClasses);
  }, [plan]);

  // Rendering the first frame at the animation's starting point is what makes an
  // enter animation look right, so the starting values are picked before the
  // shared values exist rather than in an effect.
  const start = useMemo(() => {
    if (!enabled) return plan.settled;
    if (!(config.respectReducedMotion && reducedMotion)) return plan.initial;

    const values = { ...plan.initial };
    MOVEMENT_PROPERTIES.forEach((property) => {
      if (property in values) {
        const key = property as NumericProperty;
        values[key] = plan.settled[key];
      }
    });
    return values;
  }, [plan, enabled, reducedMotion, config.respectReducedMotion]);

  // A fixed set of shared values keeps the hook order stable no matter which
  // classes are used.
  const translateX = useSharedValue(start.translateX);
  const translateY = useSharedValue(start.translateY);
  const rotate = useSharedValue(start.rotate);
  const scaleX = useSharedValue(start.scaleX);
  const scaleY = useSharedValue(start.scaleY);
  const opacity = useSharedValue(start.opacity);
  const blur = useSharedValue(start.blur);
  const grayscale = useSharedValue(start.grayscale);
  const backgroundProgress = useSharedValue(0);
  const colorProgress = useSharedValue(0);
  const layoutWidth = useSharedValue(0);
  const layoutHeight = useSharedValue(0);

  const values = useMemo<Record<NumericProperty, SharedValue<number>>>(
    () => ({
      translateX,
      translateY,
      rotate,
      scaleX,
      scaleY,
      opacity,
      blur,
      grayscale,
    }),
    [translateX, translateY, rotate, scaleX, scaleY, opacity, blur, grayscale]
  );

  const sharedFor = useCallback(
    (property: MotionProperty): SharedValue<number> | undefined => {
      if (property === "backgroundColor") return backgroundProgress;
      if (property === "color") return colorProgress;
      return values[property as NumericProperty];
    },
    [values, backgroundProgress, colorProgress]
  );

  const endTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const run = useCallback(
    (phase: "enter" | "exit") => {
      const { animations } = plan.spec;
      const skipMovement = config.respectReducedMotion && reducedMotion;

      const enterByProperty = new Map<MotionProperty, MotionAnimation>();
      animations.forEach((animation) => {
        if (animation.phase === "enter") {
          enterByProperty.set(animation.property, animation);
        }
      });

      animations.forEach((animation) => {
        const isExit = animation.phase === "exit";
        if (phase === "exit" ? !isExit : isExit) return;

        const shared = sharedFor(animation.property);
        if (!shared) return;

        const isColor = animation.from.kind === "color";
        const from = isColor ? 0 : numberOf(animation, "from");
        const to = isColor ? 1 : numberOf(animation, "to");

        if (
          !enabled ||
          (skipMovement && MOVEMENT_PROPERTIES.includes(animation.property))
        ) {
          cancelAnimation(shared);
          shared.value = animation.phase === "loop" ? from : to;
          return;
        }

        cancelAnimation(shared);
        shared.value = from;

        if (animation.phase === "loop") {
          const mirror = animation.loopMode !== "reset";
          const enter = enterByProperty.get(animation.property);
          const leadIn = enter ? enter.delay + enter.duration : 0;
          const iterations =
            animation.iterations < 0
              ? -1
              : Math.max(1, Math.round(animation.iterations));

          shared.value = withDelay(
            animation.delay + leadIn,
            withRepeat(
              buildAnimation(
                to,
                animation.easing,
                mirror ? animation.duration / 2 : animation.duration
              ),
              mirror && iterations > 0 ? iterations * 2 : iterations,
              mirror
            )
          );
          return;
        }

        shared.value = withDelay(
          animation.delay,
          buildAnimation(to, animation.easing, animation.duration)
        );
      });
    },
    [plan, enabled, reducedMotion, config.respectReducedMotion, sharedFor]
  );

  useEffect(() => {
    run("enter");

    if (onMotionEnd && plan.enterDuration > 0) {
      endTimeout.current = setTimeout(onMotionEnd, plan.enterDuration);
    }

    return () => {
      if (endTimeout.current) clearTimeout(endTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, replayKey]);

  useEffect(
    () => () => {
      Object.values(values).forEach((value) => cancelAnimation(value));
      cancelAnimation(backgroundProgress);
      cancelAnimation(colorProgress);
    },
    [values, backgroundProgress, colorProgress]
  );

  const { animated, units, colors } = plan;
  const withFilters =
    config.enableFilters && (animated.blur || animated.grayscale);

  // Percentages are relative to the element's own size, like CSS. Measuring the
  // element keeps that working on every React Native version; `"50%"` in a
  // transform only works on the New Architecture.
  const fromLayout =
    plan.usesTranslatePercentage && config.translatePercentage === "layout";

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      layoutWidth.value = event.nativeEvent.layout.width;
      layoutHeight.value = event.nativeEvent.layout.height;
    },
    [layoutWidth, layoutHeight]
  );

  const style = useAnimatedStyle(() => {
    const transform: Record<string, number | string>[] = [];

    const translate = (value: number, unit: string, size: number) => {
      if (unit !== "%") return value;
      return fromLayout ? (value / 100) * size : `${value}%`;
    };

    if (animated.translateX) {
      transform.push({
        translateX: translate(
          translateX.value,
          units.translateX,
          layoutWidth.value
        ),
      });
    }
    if (animated.translateY) {
      transform.push({
        translateY: translate(
          translateY.value,
          units.translateY,
          layoutHeight.value
        ),
      });
    }
    if (animated.rotate) transform.push({ rotate: `${rotate.value}deg` });
    if (animated.scaleX) transform.push({ scaleX: scaleX.value });
    if (animated.scaleY) transform.push({ scaleY: scaleY.value });

    const next: Record<string, unknown> = {};
    if (transform.length > 0) next.transform = transform;
    if (animated.opacity) next.opacity = opacity.value;

    if (withFilters) {
      next.filter = [{ blur: blur.value }, { grayscale: grayscale.value }];
    }

    if (colors.backgroundColor) {
      next.backgroundColor = interpolateColor(
        backgroundProgress.value,
        [0, 1],
        [colors.backgroundColor.from, colors.backgroundColor.to]
      );
    }
    if (colors.color) {
      next.color = interpolateColor(
        colorProgress.value,
        [0, 1],
        [colors.color.from, colors.color.to]
      );
    }

    return next;
  }, [plan, withFilters, fromLayout]);

  const replay = useCallback(() => run("enter"), [run]);
  const playExit = useCallback(() => run("exit"), [run]);

  return {
    /** Animated style to spread onto a Reanimated component. */
    style,
    /** Attach this when it is defined: percentages need the element's size. */
    onLayout: fromLayout ? onLayout : undefined,
    /** The classes that weren't `motion-*`, for Nativewind. */
    className: plan.spec.className,
    /** Everything the resolver understood, handy for debugging. */
    spec: plan.spec,
    replay,
    playExit,
  };
};
