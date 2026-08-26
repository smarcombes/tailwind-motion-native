/**
 * A probe, not a unit test: it renders animations through *Nativewind's* own
 * native pipeline (React Native's iOS jest preset) to record what class-based
 * CSS animations can and can't do on iOS/Android today.
 *
 *   npm run probe:nativewind
 *
 * It is deliberately outside `npm test`, because a failure here most likely
 * means Nativewind gained a capability — which is news, not a regression.
 * `docs/nativewind-parity.md` is written from its output.
 */
import { View } from "react-native";
import { cssInterop } from "nativewind";
import { render } from "nativewind/test";
import motionPlugin from "tailwindcss-motion";
import {
  advanceAnimationByTime,
  getAnimatedStyle,
} from "react-native-reanimated";

/** Nativewind styles components through its JSX transform; here we opt in. */
const NwView = cssInterop(View, { className: "style" }) as typeof View;

const CSS = `@tailwind base;\n@tailwind components;\n@tailwind utilities;`;

const KEYFRAMES = {
  fadeUp: {
    "0%": { opacity: "0", transform: "translateY(20px)" },
    "60%": { opacity: "1", transform: "translateY(-2px)" },
    "100%": { transform: "translateY(0px)" },
  },
  scaleShorthand: {
    "0%": { transform: "scale(0.5)" },
    "100%": { transform: "scale(1)" },
  },
  scaleXY: {
    "0%": { transform: "scaleX(0.3) scaleY(0.9)" },
    "100%": { transform: "scaleX(1) scaleY(1)" },
  },
  slidePercent: {
    "0%": { transform: "translateY(150%)", opacity: "0" },
    "100%": { transform: "translateY(0%)", opacity: "1" },
  },
  blurry: {
    "0%": { filter: "blur(8px)", opacity: "0" },
    "100%": { filter: "blur(0px)", opacity: "1" },
  },
  tint: {
    "0%": { backgroundColor: "rgb(255,0,0)" },
    "100%": { backgroundColor: "rgb(0,0,255)" },
  },
  spin360: {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};

const ANIMATIONS = {
  "fade-up": "fadeUp 700ms cubic-bezier(0.34, 1.4, 0.64, 1) 200ms both",
  "scale-shorthand": "scaleShorthand 700ms ease-out both",
  "scale-xy": "scaleXY 700ms ease-out both",
  "slide-percent": "slidePercent 700ms ease-out both",
  blurry: "blurry 700ms ease-out both",
  tint: "tint 700ms linear both",
  "spin-alternate": "spin360 1000ms linear infinite alternate",
  "spin-linear-stops": "spin360 1000ms linear(0, 0.25, 1) infinite",
  "two-at-once": "fadeUp 700ms ease-out both, spin360 2000ms linear infinite",
};

const config = {
  theme: { extend: { keyframes: KEYFRAMES, animation: ANIMATIONS } },
};

const styleAfter = async (
  className: string,
  ms: number,
  options: Record<string, unknown> = { css: CSS, config }
) => {
  const tree = await render(<NwView testID="el" className={className} />, options);
  const element = tree.getByTestId("el");
  advanceAnimationByTime(ms);
  return {
    initial: element.props.style,
    animated: getAnimatedStyle(element) as Record<string, unknown>,
  };
};

const transformKey = (animated: Record<string, unknown>, key: string) => {
  const transform = (animated.transform ?? []) as Array<Record<string, unknown>>;
  return transform.find((entry) => key in entry)?.[key];
};

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("what Nativewind's classes can do on native", () => {
  test("multi step keyframes, delays and fill modes", async () => {
    const { initial, animated } = await styleAfter("animate-fade-up", 350);
    expect(initial).toEqual([{ opacity: 0, transform: [{ translateY: 20 }] }]);
    expect(Number(animated.opacity)).toBeGreaterThan(0);
    expect(transformKey(animated, "translateY")).not.toBe(20);
  });

  test("scaleX / scaleY, percentage translates, colours, infinite loops", async () => {
    const scale = await styleAfter("animate-scale-xy", 350);
    expect(transformKey(scale.animated, "scaleX")).toBeGreaterThan(0.3);

    const percent = await styleAfter("animate-slide-percent", 350);
    expect(String(transformKey(percent.animated, "translateY"))).toContain("%");

    const tint = await styleAfter("animate-tint", 350);
    expect(tint.animated.backgroundColor).not.toBe("rgba(255, 0, 0, 1)");

    const spin = await styleAfter("animate-spin-alternate", 350);
    expect(transformKey(spin.animated, "rotate")).not.toBe("0deg");
  });

  test("several animations on one element, with their own durations", async () => {
    const { animated } = await styleAfter("animate-two-at-once", 350);
    expect(transformKey(animated, "rotate")).not.toBe("0deg");
    expect(transformKey(animated, "translateY")).not.toBe(20);
  });

  test("an arbitrary animation shorthand, as long as it is a literal", async () => {
    const { animated } = await styleAfter(
      "animate-[spin360_800ms_linear_150ms_both]",
      350
    );
    expect(transformKey(animated, "rotate")).not.toBe("0deg");
  });
});

describe("what it can't", () => {
  test("`transform: scale()` shorthand is dropped; use scaleX/scaleY", async () => {
    const { initial, animated } = await styleAfter("animate-scale-shorthand", 350);
    expect(initial).toEqual([{}]);
    expect(animated).toEqual({});
  });

  test("filter / blur never reaches the style", async () => {
    const { initial, animated } = await styleAfter("animate-blurry", 350);
    expect(initial).toEqual([{ opacity: 0 }]);
    expect(animated.filter).toBeUndefined();
  });

  test("a `linear()` easing stops the animation from running at all", async () => {
    const { animated } = await styleAfter("animate-spin-linear-stops", 350);
    expect(animated).toEqual({});
  });

  test("no spring: the engine only calls withTiming", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const source = require("node:fs").readFileSync(
      require.resolve(
        "react-native-css-interop/dist/runtime/native/native-interop.js"
      ),
      "utf8"
    );
    expect(source).toContain("withTiming");
    expect(source).not.toContain("withSpring");
  });

  test("the tailwindcss-motion plugin compiles, but nothing plays", async () => {
    const options = { css: CSS, config: { plugins: [motionPlugin] } };

    const preset = await styleAfter("motion-preset-fade", 350, options);
    // The var-driven `animation` shorthand loses its duration, easing and delay,
    // and the keyframes reference custom properties that never resolve.
    expect(preset.initial).toEqual({ animation: ["motion-opacity-in", "both"] });
    expect(preset.animated).toEqual({});

    const utilities = await styleAfter(
      "motion-translate-y-in-100 motion-opacity-in-0",
      350,
      options
    );
    expect(utilities.animated).toEqual({});
  });
});
