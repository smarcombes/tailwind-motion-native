import * as nativewind from "nativewind";

type InteropFactory = <T>(component: T, mapping: { className: "style" }) => T;

/**
 * Nativewind v4 calls it `cssInterop`, v5 calls it `styled`; both take
 * `(component, mapping)` and return a component that understands `className`.
 */
const interop: InteropFactory | undefined =
  (nativewind as Record<string, unknown>).cssInterop as InteropFactory | undefined ??
  ((nativewind as Record<string, unknown>).styled as InteropFactory | undefined);

/**
 * Teaches a component to read `className`.
 *
 * The interop has to sit *inside* the Reanimated wrapper: Reanimated hands the
 * component a plain snapshot of the animated style, so Nativewind can merge
 * class styles with it and Reanimated keeps driving the native view directly.
 */
export const withClassName = <T>(component: T): T =>
  interop ? interop(component, { className: "style" }) : component;

export const hasNativewind = interop !== undefined;
