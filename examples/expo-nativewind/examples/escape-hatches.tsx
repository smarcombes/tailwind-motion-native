import { forwardRef } from 'react';
import { View, type ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { Motion, motion, useMotion } from 'tailwind-motion-native';

/** Pretend this comes from a UI kit: it forwards `style` and `ref`. */
const Card = forwardRef<View, ViewProps>(function Card(props, ref) {
  return <View ref={ref} {...props} />;
});

/** `motion()` turns any such component into a motion primitive. */
const MotionCard = motion(Card);

/**
 * Two escape hatches: `motion()` for components Nativewind should style, and
 * `useMotion()` when you want the animated style and nothing else.
 */
export default function EscapeHatches() {
  const motionState = useMotion('motion-preset-slide-right motion-duration-700');

  return (
    <Motion.View className="flex-row gap-2">
      <MotionCard className="motion-preset-pop flex-1 gap-1 rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <Motion.Text className="text-xs font-semibold text-lime-300">motion(Card)</Motion.Text>
        <Motion.Text className="text-[10px] text-slate-500">any component</Motion.Text>
      </MotionCard>

      {/* A plain Reanimated view: no className, just the style from the hook. */}
      <Animated.View
        style={[
          motionState.style,
          { flex: 1, gap: 4, borderRadius: 16, padding: 16, backgroundColor: '#0f172a' },
        ]}>
        <Animated.Text style={{ color: '#bef264', fontSize: 12, fontWeight: '600' }}>
          useMotion()
        </Animated.Text>
        <Animated.Text style={{ color: '#64748b', fontSize: 10 }}>
          {motionState.spec.animations.length} animations
        </Animated.Text>
      </Animated.View>
    </Motion.View>
  );
}
