#!/usr/bin/env node
/**
 * Prints what `resolveMotion` makes of a class string. Run it after `npm run
 * build` to eyeball the resolver, or pass your own classes:
 *
 *   node scripts/print-classes.mjs "motion-preset-pop motion-duration-1000"
 */
import { resolveMotion } from "../dist/module/core/index.js";

const PRESETS = [
  "motion-preset-fade",
  "motion-preset-slide-up",
  "motion-preset-slide-down-right-lg",
  "motion-preset-focus",
  "motion-preset-blur-right",
  "motion-preset-bounce",
  "motion-preset-expand",
  "motion-preset-shrink",
  "motion-preset-pop",
  "motion-preset-compress",
  "motion-preset-shake",
  "motion-preset-wiggle",
  "motion-preset-rebound-up",
  "motion-preset-pulse",
  "motion-preset-wobble",
  "motion-preset-seesaw",
  "motion-preset-oscillate",
  "motion-preset-stretch",
  "motion-preset-float",
  "motion-preset-spin",
  "motion-preset-blink",
  "motion-translate-y-in-100 motion-opacity-in-0",
  "motion-scale-in-75 motion-rotate-in-90 motion-duration-2000",
  "motion-preset-fade motion-duration-1500 motion-delay-300",
  "motion-opacity-in-0 motion-duration-[1200ms] motion-ease-spring-bouncy",
  "motion-rotate-in-90 motion-delay-500/rotate",
  "motion-scale-loop-125/reset motion-loop-twice",
  "motion-bg-in-red-500 bg-blue-500 rounded-xl p-4",
  "motion-preset-confetti",
  "motion-preset-typewriter-[12]",
];

const format = (value) =>
  value.kind === "color" ? value.value : `${value.value}${value.unit}`;

const targets = process.argv.length > 2 ? [process.argv.slice(2).join(" ")] : PRESETS;

for (const className of targets) {
  const spec = resolveMotion(className);
  console.log(`\n\u001b[1m${className}\u001b[0m`);

  if (spec.animations.length === 0) console.log("  (no animations)");

  for (const animation of spec.animations) {
    const easing =
      animation.easing.type === "spring"
        ? `spring(${animation.easing.dampingRatio})`
        : animation.easing.type === "bezier"
          ? `cubic-bezier(${animation.easing.points.join(", ")})`
          : animation.easing.type;

    const loop =
      animation.phase === "loop"
        ? ` loop:${animation.loopMode} x${animation.iterations}`
        : "";

    console.log(
      `  ${animation.phase.padEnd(5)} ${animation.property.padEnd(15)} ` +
        `${format(animation.from)} -> ${format(animation.to)}  ` +
        `${animation.duration}ms +${animation.delay}ms ${easing}${loop}`
    );
  }

  if (spec.className) console.log(`  passthrough: "${spec.className}"`);
  if (spec.unsupportedClasses.length > 0) {
    console.log(`  unsupported: ${spec.unsupportedClasses.join(", ")}`);
  }
}
