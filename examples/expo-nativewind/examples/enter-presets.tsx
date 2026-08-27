import { Motion } from 'tailwind-motion-native';

/** Every enter preset, each on its own tile. */
const PRESETS = [
  'motion-preset-fade',
  'motion-preset-slide-up',
  'motion-preset-slide-down',
  'motion-preset-slide-left',
  'motion-preset-slide-right',
  'motion-preset-slide-up-right',
  'motion-preset-focus',
  'motion-preset-blur-up',
  'motion-preset-bounce',
  'motion-preset-expand',
  'motion-preset-shrink',
  'motion-preset-pop',
  'motion-preset-compress',
  'motion-preset-shake',
  'motion-preset-wiggle',
  'motion-preset-rebound-up',
];

export default function EnterPresets() {
  return (
    <Motion.View className="flex-row flex-wrap gap-2">
      {PRESETS.map((preset, index) => (
        <Motion.View
          key={preset}
          // Presets compose with modifiers: here a 60ms stagger per tile.
          className={`${preset} motion-delay-[${index * 60}ms] min-w-[46%] flex-1 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3`}>
          <Motion.Text className="text-xs font-medium text-lime-300">
            {preset.replace('motion-preset-', '')}
          </Motion.Text>
          <Motion.Text className="mt-1 text-[10px] text-slate-500">{preset}</Motion.Text>
        </Motion.View>
      ))}
    </Motion.View>
  );
}
