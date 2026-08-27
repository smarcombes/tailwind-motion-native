import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Motion } from 'tailwind-motion-native';

const CHIPS = [
  { label: 'Photos', tint: 'bg-rose-400' },
  { label: 'Music', tint: 'bg-amber-300' },
  { label: 'Files', tint: 'bg-lime-300' },
  { label: 'Notes', tint: 'bg-emerald-300' },
  { label: 'Mail', tint: 'bg-teal-300' },
  { label: 'Maps', tint: 'bg-sky-300' },
  { label: 'Wallet', tint: 'bg-indigo-300' },
  { label: 'Health', tint: 'bg-violet-300' },
  { label: 'Clock', tint: 'bg-fuchsia-300' },
  { label: 'Camera', tint: 'bg-pink-300' },
  { label: 'Books', tint: 'bg-orange-300' },
  { label: 'Games', tint: 'bg-cyan-300' },
];

const pick = <T,>(values: T[]): T => values[Math.floor(Math.random() * values.length)];
const between = (min: number, max: number): number =>
  Math.round(min + Math.random() * (max - min));

/**
 * Every chip gets its own distance, rotation, scale, spring, duration and delay,
 * rolled fresh on each shuffle. None of these class names existed when Tailwind
 * compiled the stylesheet — they are arithmetic, done a frame before the
 * animation starts.
 */
const roll = (): string => {
  const axis = pick(['x', 'y']);
  const sign = pick(['', '-']);

  return [
    `${sign}motion-translate-${axis}-in-[${between(35, 130)}%]`,
    `motion-rotate-in-[${pick(['', '-'])}${between(10, 75)}deg]`,
    `motion-scale-in-[${between(40, 130)}%]`,
    'motion-opacity-in-0',
    `motion-duration-[${between(450, 1100)}ms]`,
    `motion-delay-[${between(0, 420)}ms]`,
    `motion-ease-[spring(${(between(18, 70) / 100).toFixed(2)})]`,
  ].join(' ');
};

export default function ShowcaseShuffle() {
  const [seed, setSeed] = useState(0);
  const recipes = useMemo(() => CHIPS.map(() => roll()), [seed]);

  const shuffle = useCallback(() => setSeed((value) => value + 1), []);

  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap gap-2">
        {CHIPS.map((chip, index) => (
          <Motion.View
            key={chip.label}
            motionKey={seed}
            className={`${recipes[index]} min-w-[30%] flex-1 items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900 py-3`}>
            <Motion.View className={`h-6 w-6 rounded-full ${chip.tint}`} />
            <Motion.Text className="text-[10px] text-slate-400">{chip.label}</Motion.Text>
          </Motion.View>
        ))}
      </View>

      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={shuffle}
          className="rounded-full bg-lime-300 px-4 py-2 active:opacity-70">
          <Text className="text-[12px] font-semibold text-slate-900">Shuffle</Text>
        </Pressable>
        <Text className="flex-1 text-[10px] leading-4 text-slate-500">
          12 random spring recipes per tap, e.g.{'\n'}
          <Text className="text-slate-400">{recipes[0]}</Text>
        </Text>
      </View>
    </View>
  );
}
