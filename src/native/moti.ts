import { Easing } from "react-native-reanimated";
import { resolveMotion, type ResolveMotionOptions } from "../core/resolve.js";
import type {
  MotionAnimation,
  MotionEasing,
  MotionValue,
} from "../core/types.js";

type StyleValues = Record<string, number | string>;

export type MotiMotionProps = {
  from: StyleValues;
  animate: StyleValues;
  exit: StyleValues;
  transition: Record<string, unknown>;
  /** The classes that weren't `motion-*`. */
  className: string;
};

/** Moti has no filter support, so blur/grayscale are dropped. */
const MOTI_PROPERTIES = [
  "translateX",
  "translateY",
  "scaleX",
  "scaleY",
  "rotate",
  "opacity",
  "backgroundColor",
  "color",
];

const toStyleValue = (value: MotionValue): number | string => {
  if (value.kind === "color") return value.value;
  if (value.unit === "%" || value.unit === "deg") {
    return `${value.value}${value.unit}`;
  }
  return value.value;
};

const toMotiEasing = (easing: MotionEasing) => {
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
      return undefined;
  }
};

const toMotiTransition = (animation: MotionAnimation) => {
  const loop = animation.phase === "loop";
  const spring = animation.easing.type === "spring";

  return {
    type: spring ? "spring" : "timing",
    duration: loop ? animation.duration / 2 : animation.duration,
    delay: animation.delay,
    ...(spring && animation.easing.type === "spring"
      ? { dampingRatio: animation.easing.dampingRatio }
      : { easing: toMotiEasing(animation.easing) }),
    ...(loop
      ? {
          loop: animation.iterations < 0,
          repeat: animation.iterations < 0 ? undefined : animation.iterations,
          repeatReverse: animation.loopMode !== "reset",
        }
      : {}),
  };
};

/**
 * Resolves `motion-*` classes into [Moti](https://moti.fyi) props.
 *
 * Handy if you already animate with Moti and just want tailwindcss-motion's
 * vocabulary:
 *
 * ```tsx
 * const { from, animate, transition, className } = resolveMotiProps(
 *   "motion-preset-pop bg-white p-4"
 * );
 * return <MotiView {...{ from, animate, transition }} className={className} />;
 * ```
 */
export const resolveMotiProps = (
  className?: string,
  options: ResolveMotionOptions = {}
): MotiMotionProps => {
  const spec = resolveMotion(className, options);

  const props: MotiMotionProps = {
    from: {},
    animate: {},
    exit: {},
    transition: {},
    className: spec.className,
  };

  spec.animations.forEach((animation) => {
    if (!MOTI_PROPERTIES.includes(animation.property)) return;

    const from = toStyleValue(animation.from);
    const to = toStyleValue(animation.to);

    if (animation.phase === "exit") {
      props.exit[animation.property] = to;
    } else {
      props.from[animation.property] = from;
      props.animate[animation.property] = to;
    }

    props.transition[animation.property] = toMotiTransition(animation);
  });

  return props;
};
