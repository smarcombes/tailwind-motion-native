import {
  forwardRef,
  type ComponentType,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
} from "react";
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
        ...rest
      } = props as MotionOnlyProps & { style?: unknown };

      const motionState = useMotion(className, {
        replayKey: motionKey,
        enabled: motionEnabled,
        onMotionEnd,
      });

      return (
        <AnimatedComponent
          ref={ref}
          {...rest}
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
