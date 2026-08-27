import { Motion } from 'tailwind-motion-native';

/**
 * A hero section that reveals itself top to bottom: same preset everywhere,
 * different delays.
 */
export default function Hero() {
  return (
    <Motion.View className="motion-preset-fade gap-3 rounded-3xl bg-slate-900 p-6">
      <Motion.Text className="motion-preset-slide-up text-3xl font-bold text-white">
        Motion, without commotion
      </Motion.Text>

      <Motion.Text className="motion-preset-slide-up motion-delay-100 text-base leading-6 text-slate-400">
        Tailwind classes in, Reanimated animations out. No keyframes, no
        useSharedValue, no config.
      </Motion.Text>

      <Motion.View className="motion-preset-slide-up motion-delay-200 mt-2 self-start rounded-full bg-lime-300 px-5 py-3">
        <Motion.Text className="font-semibold text-slate-900">Get started</Motion.Text>
      </Motion.View>
    </Motion.View>
  );
}
