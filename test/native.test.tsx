import { fireEvent, render } from "react-native-css-interop/test";
import { advanceAnimationByTime, getAnimatedStyle } from "react-native-reanimated";
import { configureMotion, Motion } from "../src/index";

/**
 * The interesting part on native is that two wrappers have to cooperate: the
 * Nativewind interop turns `className` into styles, and Reanimated drives the
 * same element's animated properties. These tests render the real components on
 * the native code path to make sure neither one eats the other's output.
 */
const flatten = (style: unknown): Record<string, unknown> =>
  (Array.isArray(style) ? style : [style])
    .flat(Infinity)
    .filter((entry): entry is Record<string, unknown> => Boolean(entry))
    .reduce((accumulator, entry) => ({ ...accumulator, ...entry }), {});

test("class styles and the animation's starting values land on the same element", () => {
  const tree = render(
    <Motion.View testID="box" className="motion-preset-fade my-card" />,
    { css: ".my-card { background-color: #ff0000; border-radius: 12px }" }
  );

  const style = flatten(tree.getByTestId("box").props.style);

  // From the class name, through the Nativewind interop.
  expect(style.backgroundColor).toBe("#ff0000");
  expect(style.borderRadius).toBe(12);
  // From `motion-preset-fade`, through Reanimated's initial style.
  expect(style.opacity).toBe(0);
});

test("motion-* classes never reach Nativewind", () => {
  const tree = render(
    <Motion.Text testID="label" className="motion-preset-slide-up my-text">
      Hello
    </Motion.Text>,
    { css: ".my-text { color: #0000ff }" }
  );

  const props = tree.getByTestId("label").props;
  const style = flatten(props.style);

  expect(props.className).toBeUndefined();
  expect(style.color).toBe("#0000ff");
  expect(style.opacity).toBe(0);
  // 25% of a height nothing has measured yet.
  expect(style.transform).toEqual([{ translateY: 0 }]);
});

test("translate percentages are resolved from the element's measured size", () => {
  jest.useFakeTimers();

  const tree = render(
    <Motion.View testID="box" className="motion-preset-slide-up" />
  );
  const box = tree.getByTestId("box");

  fireEvent(box, "layout", {
    nativeEvent: { layout: { width: 100, height: 200 } },
  });

  const translateY = (): number => {
    const transform = getAnimatedStyle(box).transform as Array<{
      translateY: number;
    }>;
    return transform[0].translateY;
  };

  // `motion-preset-slide-up` starts 25% of the element's height below its
  // resting place, so a frame into a 700ms animation it is still near 50px.
  advanceAnimationByTime(16);
  expect(translateY()).toBeGreaterThan(35);
  expect(translateY()).toBeLessThan(50);

  advanceAnimationByTime(1000);
  expect(translateY()).toBe(0);

  jest.useRealTimers();
});

test("percentages can be handed to the transform instead", () => {
  configureMotion({ translatePercentage: "transform" });

  try {
    const tree = render(
      <Motion.View testID="box" className="motion-preset-slide-up" />
    );
    expect(getAnimatedStyle(tree.getByTestId("box")).transform).toEqual([
      { translateY: "25%" },
    ]);
  } finally {
    configureMotion({ translatePercentage: "layout" });
  }
});

test("the animation actually runs", () => {
  jest.useFakeTimers();

  const tree = render(
    <Motion.View testID="box" className="motion-preset-fade" />
  );
  const box = tree.getByTestId("box");

  expect(getAnimatedStyle(box).opacity).toBe(0);

  // `motion-preset-fade` is a 500ms fade on an ease-out curve, so it is most of
  // the way there at the halfway point.
  advanceAnimationByTime(250);
  const halfway = Number(getAnimatedStyle(box).opacity);
  expect(halfway).toBeGreaterThan(0.2);
  expect(halfway).toBeLessThan(1);

  advanceAnimationByTime(400);
  expect(Number(getAnimatedStyle(box).opacity)).toBeCloseTo(1, 2);

  jest.useRealTimers();
});

test("delays are honoured", () => {
  jest.useFakeTimers();

  const tree = render(
    <Motion.View
      testID="box"
      className="motion-opacity-in-0 motion-duration-500 motion-delay-500"
    />
  );
  const box = tree.getByTestId("box");

  advanceAnimationByTime(300);
  expect(Number(getAnimatedStyle(box).opacity)).toBeCloseTo(0.001, 3);

  advanceAnimationByTime(900);
  expect(Number(getAnimatedStyle(box).opacity)).toBeCloseTo(1, 2);

  jest.useRealTimers();
});

test("loop presets keep going", () => {
  jest.useFakeTimers();

  const tree = render(
    <Motion.View testID="spinner" className="motion-preset-spin" />
  );
  const spinner = tree.getByTestId("spinner");

  const rotationAt = (): number => {
    const transform = getAnimatedStyle(spinner).transform as Array<{
      rotate: string;
    }>;
    return Number.parseFloat(transform[0].rotate);
  };

  expect(rotationAt()).toBe(0);

  advanceAnimationByTime(350);
  const midway = rotationAt();
  expect(midway).toBeGreaterThan(0);
  expect(midway).toBeLessThan(360);

  // `motion-preset-spin` is a 700ms reset loop: lap two looks like lap one.
  advanceAnimationByTime(700);
  expect(rotationAt()).toBeGreaterThan(0);
  expect(rotationAt()).toBeLessThan(360);

  jest.useRealTimers();
});

test("motionKey replays the animation", () => {
  jest.useFakeTimers();

  const tree = render(
    <Motion.View testID="box" className="motion-preset-fade" motionKey={0} />
  );
  const box = tree.getByTestId("box");

  advanceAnimationByTime(600);
  expect(Number(getAnimatedStyle(box).opacity)).toBeCloseTo(1, 2);

  tree.update(
    <Motion.View testID="box" className="motion-preset-fade" motionKey={1} />
  );
  expect(Number(getAnimatedStyle(box).opacity)).toBeCloseTo(0, 2);

  advanceAnimationByTime(600);
  expect(Number(getAnimatedStyle(box).opacity)).toBeCloseTo(1, 2);

  jest.useRealTimers();
});

test("motionEnabled={false} jumps to the final state", () => {
  const tree = render(
    <Motion.View
      testID="box"
      className="motion-preset-slide-up"
      motionEnabled={false}
    />
  );

  const style = getAnimatedStyle(tree.getByTestId("box"));
  expect(style.opacity).toBe(1);
  expect(style.transform).toEqual([{ translateY: 0 }]);
});

test("elements without motion classes are left alone", () => {
  const tree = render(<Motion.View testID="plain" className="my-card" />, {
    css: ".my-card { background-color: #00ff00 }",
  });

  const style = flatten(tree.getByTestId("plain").props.style);
  expect(style.backgroundColor).toBe("#00ff00");
  expect(style.opacity).toBeUndefined();
  expect(style.transform).toBeUndefined();
});
