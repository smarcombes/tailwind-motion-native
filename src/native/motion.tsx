import {
  forwardRef,
  useCallback,
  type ComponentType,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
} from "react";
import type { LayoutChangeEvent } from "react-native";
import Animated from "react-native-reanimated";
import { withClassName } from "./interop.js";
import { useMotion } from "./useMotion.js";

export type MotionOnlyProps = {
  /** Tailwind classes. `motion-*` classes animate, the rest go to Nativewind. */
  className?: string;
  /** Replays the animation whenever this value changes. */
  motionKey?: string | number | boolean | null;
  /** `false` renders the final state without animating. */
  motionEnabled?: boolean;
  /** Fires when the enter animation finishes. */
  onMotionEnd?: () => void;
};

export type MotionProps<P> = PropsWithoutRef<P> & MotionOnlyProps;

export type MotionComponent<P> = ForwardRefExoticComponent<
  MotionProps<P> & RefAttributes<unknown>
>;

/**
 * Wraps any component that forwards `style` and `ref` into a motion component.
 *
 * ```tsx
 * const MotionCard = motion(Card);
 * <MotionCard className="motion-preset-pop rounded-xl" />
 * ```
 */
export const motion = <P extends { style?: unknown }>(
  Component: ComponentType<P>,
  displayName?: string
): MotionComponent<P> => {
  const Styled = withClassName(Component);
  const AnimatedComponent = Animated.createAnimatedComponent(
    Styled as ComponentType<Record<string, unknown>>
  ) as ComponentType<Record<string, unknown>>;

  const MotionComponentImpl = forwardRef<unknown, MotionProps<P>>(
    function MotionComponentImpl(props, ref) {
      const {
        className,
        motionKey,
        motionEnabled,
        onMotionEnd,
        style,
        onLayout,
        ...rest
      } = props as MotionOnlyProps & {
        style?: unknown;
        onLayout?: (event: LayoutChangeEvent) => void;
      };

      const motionState = useMotion(className, {
        replayKey: motionKey,
        enabled: motionEnabled,
        onMotionEnd,
      });

      // Only percentage translates need a measurement, so most elements never
      // get an onLayout handler they didn't ask for.
      const measure = motionState.onLayout;
      const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
          measure?.(event);
          onLayout?.(event);
        },
        [measure, onLayout]
      );

      return (
        <AnimatedComponent
          ref={ref}
          {...rest}
          onLayout={measure || onLayout ? handleLayout : undefined}
          className={motionState.className}
          style={style ? [style, motionState.style] : motionState.style}
        />
      );
    }
  );

  MotionComponentImpl.displayName =
    displayName ??
    `Motion.${
      (Component as { displayName?: string; name?: string }).displayName ??
      (Component as { name?: string }).name ??
      "Component"
    }`;

  return MotionComponentImpl as MotionComponent<P>;
};
