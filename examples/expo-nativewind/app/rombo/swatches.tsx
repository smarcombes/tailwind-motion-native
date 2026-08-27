import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { Motion } from 'tailwind-motion-native';

import { ExampleScreen } from '../../components/example-screen';

/** Upstream these are `.color-container` — `size-8 rounded-full` with an inset highlight. */
const SWATCHES = [
  { tint: 'bg-black', translate: 'motion-translate-y-in-50', delay: 150 },
  { tint: 'bg-orange-200', translate: 'motion-translate-y-in-75', delay: 100 },
  { tint: 'bg-zinc-300', translate: 'motion-translate-y-in-50', delay: 150 },
];

/**
 * https://play.tailwindcss.com/cvQ3Nk3v8j
 *
 * The whole tray springs up from below at 20% scale while each swatch rises
 * inside it — the overshoot is the entire effect.
 */
export default function Swatches() {
  return (
    <ExampleScreen
      title="Apple Color Swatches"
      play="play.tailwindcss.com/cvQ3Nk3v8j"
      notes={[
        'Every element here is motion-ease-spring-bouncier; a cubic-bezier can only imitate one of them',
        'Upstream writes motion-duration-750, which isn’t a real class (no 750 in the duration scale), so this uses motion-duration-[750ms]',
      ]}>
      <LinearGradient
        colors={['#ffffff', '#fcd34d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
        <Motion.View className="motion-scale-in-[20%] motion-translate-y-in-150 motion-ease-spring-bouncier motion-duration-[750ms] mb-16 flex-row gap-3 rounded-full border-t border-white/40 bg-zinc-800/50 p-3">
          {SWATCHES.map((swatch, index) => (
            <Motion.View
              key={index}
              className={`${swatch.translate} motion-opacity-in motion-ease-spring-bouncier motion-duration-[750ms] motion-delay-[${swatch.delay}ms] size-8 rounded-full border-t border-white/40 ${swatch.tint}`}
            />
          ))}
        </Motion.View>
      </LinearGradient>
    </ExampleScreen>
  );
}
