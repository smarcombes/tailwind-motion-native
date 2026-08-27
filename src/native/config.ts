export type MotionConfig = {
  /**
   * Animate `blur` / `grayscale` through React Native's `filter` style.
   * Requires the New Architecture (React Native 0.76+); turn it off if your
   * platform ignores or chokes on `filter`.
   */
  enableFilters: boolean;
  /**
   * How `translate` percentages (`motion-preset-slide-*`,
   * `motion-translate-y-in-50`, ...) become pixels.
   *
   * - `layout` measures the element and does the maths, which works on every
   *   React Native version and architecture.
   * - `transform` passes `"50%"` straight to the transform, which needs React
   *   Native 0.75+ *and* the New Architecture (it throws on old-architecture
   *   Android) but needs no measurement.
   */
  translatePercentage: "layout" | "transform";
  /**
   * Skip transform animations when the OS asks for reduced motion, mirroring
   * what tailwindcss-motion does with `prefers-reduced-motion`. Opacity, colour
   * and filter animations keep playing.
   */
  respectReducedMotion: boolean;
  /** Warn once per class when a `motion-*` class has no native equivalent. */
  warnOnUnsupported: boolean;
  /**
   * Multiplies every duration and delay. `4` runs everything at quarter speed,
   * which is handy for inspecting a choreography — or for recording one on a
   * slow emulator. Leave it at `1` in a shipping app.
   */
  timeScale: number;
};

const config: MotionConfig = {
  enableFilters: true,
  translatePercentage: "layout",
  respectReducedMotion: true,
  warnOnUnsupported: true,
  timeScale: 1,
};

/** Overrides the library defaults. Call it once, before rendering. */
export const configureMotion = (next: Partial<MotionConfig>): void => {
  Object.assign(config, next);
};

export const getMotionConfig = (): Readonly<MotionConfig> => config;

const warned = new Set<string>();

export const warnUnsupported = (classNames: string[]): void => {
  if (!config.warnOnUnsupported || classNames.length === 0) return;

  classNames.forEach((className) => {
    if (warned.has(className)) return;
    warned.add(className);
    console.warn(
      `[tailwind-motion-native] "${className}" has no React Native equivalent, so it was ignored. ` +
        `See https://github.com/smarcombes/tailwind-motion-native#supported-classes`
    );
  });
};
