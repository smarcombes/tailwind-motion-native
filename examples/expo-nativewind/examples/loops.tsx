import { Motion } from 'tailwind-motion-native';

/**
 * Looping presets run forever, or `motion-loop-once` / `motion-loop-twice`
 * times. `mirror` loops go there and back, `reset` loops start over.
 */
const LOOPS = [
  { className: 'motion-preset-spin', label: '↻' },
  { className: 'motion-preset-pulse', label: '♥' },
  { className: 'motion-preset-float', label: '☁' },
  { className: 'motion-preset-oscillate', label: '↕' },
  { className: 'motion-preset-wobble', label: '↔' },
  { className: 'motion-preset-seesaw', label: '⚖' },
  { className: 'motion-preset-blink', label: '●' },
  { className: 'motion-preset-stretch', label: '▢' },
];

export default function Loops() {
  return (
    <Motion.View className="flex-row flex-wrap gap-2">
      {LOOPS.map(({ className, label }) => (
        <Motion.View
          key={className}
          className="min-w-[22%] flex-1 items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 py-4">
          <Motion.Text className={`${className} text-2xl text-lime-300`}>{label}</Motion.Text>
          <Motion.Text className="text-[9px] text-slate-500">
            {className.replace('motion-preset-', '')}
          </Motion.Text>
        </Motion.View>
      ))}
    </Motion.View>
  );
}
