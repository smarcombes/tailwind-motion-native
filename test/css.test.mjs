import assert from "node:assert/strict";
import { test } from "node:test";
import {
  evaluateCalc,
  parseAnimationShorthand,
  parseEasing,
  parseMeasure,
  resolveVars,
  splitTopLevel,
} from "../dist/module/core/index.js";

test("splitTopLevel ignores separators inside functions", () => {
  assert.deepEqual(
    splitTopLevel("a 300ms cubic-bezier(.1, .2, .3, 1) 0ms both", " "),
    ["a", "300ms", "cubic-bezier(.1, .2, .3, 1)", "0ms", "both"]
  );
  assert.deepEqual(splitTopLevel("none, none, motion-scale-in 1s", ","), [
    "none",
    "none",
    "motion-scale-in 1s",
  ]);
});

test("resolveVars follows fallbacks and nested references", () => {
  const vars = {
    "--duration": "700ms",
    "--scale-duration": "",
    "--timing": "var(--default-timing)",
    "--default-timing": "linear",
  };

  assert.equal(resolveVars("var(--duration)", vars), "700ms");
  assert.equal(
    resolveVars("var(--scale-duration, var(--duration))", vars),
    "700ms"
  );
  assert.equal(resolveVars("var(--missing, 12px)", vars), "12px");
  assert.equal(resolveVars("var(--timing)", vars), "linear");
  assert.equal(resolveVars("var(--nothing)", vars), "");
});

test("resolveVars reads a bare custom property fallback as a reference", () => {
  // Upstream's `motion-text-color-loop` animation writes `--motion-duration`
  // where it means `var(--motion-duration)`.
  assert.equal(
    resolveVars("var(--missing, --duration)", { "--duration": "700ms" }),
    "700ms"
  );
});

test("resolveVars can keep custom properties symbolic", () => {
  const vars = { "--motion-spring-bouncy": "linear(0, 0.5, 1)" };
  assert.equal(
    resolveVars("var(--motion-spring-bouncy)", vars, {
      keepSymbolic: (name) => name === "--motion-spring-bouncy",
    }),
    "var(--motion-spring-bouncy)"
  );
});

test("evaluateCalc computes the plugin's duration expressions", () => {
  assert.equal(evaluateCalc("calc(700ms * 2.035)"), "1424.5ms");
  assert.equal(evaluateCalc("calc(0.5 - 1)"), "-0.5");
  assert.equal(evaluateCalc("calc(300ms * 2)"), "600ms");
  assert.equal(evaluateCalc("calc((2 + 4) * 10px)"), "60px");
  assert.equal(evaluateCalc("12px"), "12px");
  // Anything it can't compute is left alone rather than throwing.
  assert.equal(evaluateCalc("calc(10ch + 1px)"), "calc(10ch + 1px)");
});

test("parseMeasure splits values and units", () => {
  assert.deepEqual(parseMeasure("-25%"), { value: -25, unit: "%" });
  assert.deepEqual(parseMeasure("1.25"), { value: 1.25, unit: "" });
  assert.deepEqual(parseMeasure("12deg"), { value: 12, unit: "deg" });
  assert.equal(parseMeasure("red"), null);
});

test("parseAnimationShorthand classifies tokens by shape", () => {
  const enter = parseAnimationShorthand(
    "motion-translate-in 700ms cubic-bezier(.165, .84, .44, 1) 100ms both"
  );
  assert.equal(enter.name, "motion-translate-in");
  assert.equal(enter.duration, 700);
  assert.equal(enter.delay, 100);
  assert.equal(enter.iterations, 1);
  assert.deepEqual(enter.easing, {
    type: "bezier",
    points: [0.165, 0.84, 0.44, 1],
  });

  const loop = parseAnimationShorthand(
    "motion-scale-loop-mirror 1424.5ms var(--motion-spring-bouncier) 0ms both infinite"
  );
  assert.equal(loop.name, "motion-scale-loop-mirror");
  assert.equal(loop.iterations, -1);
  assert.deepEqual(loop.easing, { type: "spring", dampingRatio: 0.5 });

  const seconds = parseAnimationShorthand("blink 0.4s step-end infinite alternate");
  assert.equal(seconds.duration, 400);
  assert.equal(seconds.direction, "alternate");
});

const DEFAULT_BEZIER = {
  type: "bezier",
  points: [0.165, 0.84, 0.44, 1],
};

test("parseEasing recovers spring damping ratios", () => {
  assert.deepEqual(parseEasing("var(--motion-spring-smooth)"), {
    type: "spring",
    dampingRatio: 1,
  });
  assert.deepEqual(parseEasing("var(--motion-spring-bounciest)"), {
    type: "spring",
    dampingRatio: 0.2,
  });
  assert.deepEqual(parseEasing("var(--motion-bounce)"), { type: "bounce" });
  assert.deepEqual(parseEasing("linear"), { type: "linear" });
  assert.deepEqual(parseEasing("steps(4, start)"), {
    type: "steps",
    count: 4,
    position: "start",
  });

  // `spring()` has no CSS equivalent; it exists because native has springs.
  assert.deepEqual(parseEasing("spring(0.42)"), {
    type: "spring",
    dampingRatio: 0.42,
  });
  assert.deepEqual(parseEasing("spring(nonsense)"), DEFAULT_BEZIER);

  // An unrecognised spring curve is measured from its overshoot instead.
  const measured = parseEasing("linear(0, 0.5, 1.163 30%, 1.02, 1)");
  assert.equal(measured.type, "spring");
  assert.ok(Math.abs(measured.dampingRatio - 0.5) < 0.02);
});
