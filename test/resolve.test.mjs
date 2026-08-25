import assert from "node:assert/strict";
import { test } from "node:test";
import { getEngine, resolveMotion } from "../dist/module/core/index.js";

const find = (spec, property, phase = "enter") =>
  spec.animations.find(
    (animation) => animation.property === property && animation.phase === phase
  );

test("presets resolve to native animations", () => {
  const fade = resolveMotion("motion-preset-fade");
  assert.deepEqual(find(fade, "opacity"), {
    id: "enter:opacity",
    property: "opacity",
    phase: "enter",
    from: { kind: "number", value: 0, unit: "" },
    to: { kind: "number", value: 1, unit: "" },
    duration: 500,
    delay: 0,
    iterations: 1,
    easing: { type: "bezier", points: [0.165, 0.84, 0.44, 1] },
  });

  const slide = resolveMotion("motion-preset-slide-up");
  assert.deepEqual(find(slide, "translateY").from, {
    kind: "number",
    value: 25,
    unit: "%",
  });
  assert.equal(find(slide, "translateY").to.value, 0);
  assert.ok(find(slide, "opacity"));

  const large = resolveMotion("motion-preset-slide-right-lg");
  assert.equal(find(large, "translateX").from.value, -100);
});

test("spring presets become Reanimated springs", () => {
  const pop = resolveMotion("motion-preset-pop");
  const scale = find(pop, "scaleX");
  assert.deepEqual(scale.easing, { type: "spring", dampingRatio: 0.5 });
  // 700ms * the bouncier perceptual multiplier (2.035).
  assert.equal(scale.duration, 1424.5);
  assert.equal(scale.from.value, 0.5);
  assert.equal(scale.to.value, 1);

  const bounce = resolveMotion("motion-preset-bounce");
  assert.deepEqual(find(bounce, "translateY").easing, { type: "bounce" });
});

test("loop presets carry their loop mode and iteration count", () => {
  const spin = resolveMotion("motion-preset-spin");
  const rotate = find(spin, "rotate", "loop");
  assert.equal(rotate.loopMode, "reset");
  assert.equal(rotate.iterations, -1);
  assert.equal(rotate.to.value, 360);
  assert.deepEqual(rotate.easing, { type: "linear" });

  const pulse = resolveMotion("motion-preset-pulse-lg");
  const scale = find(pulse, "scaleX", "loop");
  assert.equal(scale.loopMode, "mirror");
  assert.equal(scale.to.value, 1.5);

  const blink = resolveMotion("motion-preset-blink");
  const opacity = find(blink, "opacity", "loop");
  assert.equal(opacity.from.value, 1);
  assert.equal(opacity.to.value, 0);
});

test("loop opacity utilities undo the CSS accumulate offset", () => {
  const spec = resolveMotion("motion-opacity-loop-25");
  const opacity = find(spec, "opacity", "loop");
  assert.equal(opacity.from.value, 1);
  assert.equal(opacity.to.value, 0.25);
});

test("modifiers apply globally and per property", () => {
  const global = resolveMotion(
    "motion-preset-fade motion-duration-1000 motion-delay-200"
  );
  assert.equal(find(global, "opacity").duration, 1000);
  assert.equal(find(global, "opacity").delay, 200);

  const scoped = resolveMotion(
    "motion-rotate-in-90 motion-opacity-in-0 motion-delay-500/rotate"
  );
  assert.equal(find(scoped, "rotate").delay, 500);
  assert.equal(find(scoped, "opacity").delay, 0);

  const arbitrary = resolveMotion("motion-opacity-in-0 motion-duration-[1200ms]");
  assert.equal(find(arbitrary, "opacity").duration, 1200);

  const negative = resolveMotion("-motion-rotate-in-90");
  assert.equal(find(negative, "rotate").from.value, -90);

  const eased = resolveMotion("motion-scale-in-50 motion-ease-spring-bouncy");
  assert.deepEqual(find(eased, "scaleX").easing, {
    type: "spring",
    dampingRatio: 0.7,
  });
});

test("colour animations read the element's own Tailwind colour", () => {
  const background = resolveMotion("motion-bg-in-red-500 bg-blue-500 rounded-xl");
  const animation = find(background, "backgroundColor");
  assert.equal(animation.from.value, "#ef4444");
  assert.equal(animation.to.value, "#3b82f6");
  assert.equal(background.className, "bg-blue-500 rounded-xl");

  const text = resolveMotion("motion-text-in-red-500 text-white");
  assert.equal(find(text, "color").to.value, "#ffffff");

  const explicit = resolveMotion("motion-bg-in-red-500", {
    baseColors: { backgroundColor: "#000000" },
  });
  assert.equal(find(explicit, "backgroundColor").to.value, "#000000");

  // Without a target colour there is nothing to animate towards.
  const orphan = resolveMotion("motion-bg-in-red-500");
  assert.equal(orphan.animations.length, 0);
});

test("non-motion classes and variants are passed through untouched", () => {
  const spec = resolveMotion(
    "flex-1 dark:bg-black motion-preset-fade hover:opacity-50"
  );
  assert.equal(spec.className, "flex-1 dark:bg-black hover:opacity-50");
  assert.deepEqual(spec.motionClasses, ["motion-preset-fade"]);
  assert.equal(spec.animations.length, 1);

  assert.deepEqual(resolveMotion("flex-1 p-4"), {
    animations: [],
    className: "flex-1 p-4",
    motionClasses: [],
    unsupportedClasses: [],
  });
  assert.equal(resolveMotion(undefined).className, "");
});

test("web-only presets are reported instead of silently ignored", () => {
  for (const className of [
    "motion-preset-confetti",
    "motion-preset-typewriter-[12]",
    "motion-preset-flomoji-🚀",
    "motion-paused",
  ]) {
    const spec = resolveMotion(className);
    assert.equal(spec.animations.length, 0, className);
    assert.deepEqual(spec.unsupportedClasses, [className]);
  }
});

test("enter, exit and loop animations can coexist on one element", () => {
  const spec = resolveMotion(
    "motion-opacity-in-0 motion-scale-out-50 motion-preset-float"
  );
  assert.ok(find(spec, "opacity", "enter"));
  assert.ok(find(spec, "scaleX", "exit"));
  assert.ok(find(spec, "translateY", "loop"));
});

/**
 * Guards against a `tailwindcss-motion` bump adding utilities that resolve to
 * nothing on native. Modifiers and web-only presets are expected to be inert.
 */
test("every plugin class resolves to an animation", () => {
  const engine = getEngine();
  const inert = [
    "motion-duration",
    "motion-delay",
    "motion-ease",
    "motion-loop",
    "motion-paused",
    "motion-running",
    "motion-preset-confetti",
    "motion-preset-typewriter",
    "motion-preset-flomoji",
  ];

  const pickValue = (values) => {
    if (values.length === 0 || values.includes("DEFAULT")) return null;
    if (values.includes("red-500")) return "red-500";
    return values.find((key) => key !== "DEFAULT") ?? null;
  };

  const classNames = [
    ...engine.listDynamicRules().map(({ base, values }) => {
      const value = pickValue(values);
      return value ? `${base}-${value}` : base;
    }),
    ...engine.listStaticClassNames(),
  ];

  const missing = [...new Set(classNames)]
    .filter((className) => !inert.some((prefix) => className.startsWith(prefix)))
    .filter((className) => {
      // Colour utilities need a target colour to animate towards.
      const withTarget = className.includes("motion-bg-")
        ? `${className} bg-white`
        : className.includes("motion-text-")
          ? `${className} text-white`
          : className;
      return resolveMotion(withTarget).animations.length === 0;
    });

  assert.deepEqual(missing, []);
});
