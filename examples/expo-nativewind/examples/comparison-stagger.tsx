import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Motion } from 'tailwind-motion-native';

const ROWS = ['Inbox', 'Drafts', 'Sent', 'Archive', 'Spam'];

/**
 * The fair Nativewind version of a stagger is one compiled animation class on
 * every row, which means every row shares the same delay. Per-row delays would
 * need a keyframe variant per row in `tailwind.config.js` — and even then the
 * step could not come from state, because Tailwind compiles CSS ahead of time.
 *
 * Here the class is parsed at runtime, so the delay can just be arithmetic.
 */
export default function ComparisonStagger() {
  const [step, setStep] = useState(110);
  const [run, setRun] = useState(0);

  const replay = () => setRun((value) => value + 1);
  const setStagger = (value: number) => {
    setStep(value);
    replay();
  };

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <View className="flex-1 gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Nativewind
          </Text>
          <View key={run} className="gap-1.5">
            {ROWS.map((row) => (
              // A compiled class from tailwind.config.js, so it does animate —
              // but all five rows share its single baked-in delay.
              <View key={row} className="animate-slide-in rounded-lg bg-slate-800 px-3 py-2">
                <Text className="text-[11px] text-slate-400">{row}</Text>
              </View>
            ))}
          </View>
          <Text className="text-[10px] text-slate-600">animate-slide-in</Text>
          <Text className="text-[10px] text-slate-600">one delay for every row</Text>
        </View>

        <View className="flex-1 gap-2 rounded-2xl border border-lime-900 bg-slate-900 p-4">
          <Text className="text-[10px] font-semibold uppercase tracking-wider text-lime-400">
            tailwind-motion-native
          </Text>
          <View className="gap-1.5">
            {ROWS.map((row, index) => (
              <Motion.View
                key={row}
                motionKey={run}
                className={`motion-preset-slide-left motion-delay-[${index * step}ms] rounded-lg bg-slate-800 px-3 py-2`}>
                <Motion.Text className="text-[11px] text-lime-200">{row}</Motion.Text>
              </Motion.View>
            ))}
          </View>
          <Text className="text-[10px] text-lime-500">
            motion-delay-[{'{index * step}'}ms]
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        {[60, 110, 220].map((value) => (
          <Pressable
            key={value}
            onPress={() => setStagger(value)}
            className={`rounded-full border px-3 py-1.5 active:opacity-60 ${
              step === value ? 'border-lime-400 bg-lime-400/10' : 'border-slate-700'
            }`}>
            <Text className="text-[11px] text-slate-300">{value}ms</Text>
          </Pressable>
        ))}
        <Pressable
          onPress={replay}
          className="rounded-full bg-white px-3 py-1.5 active:opacity-70">
          <Text className="text-[11px] font-semibold text-slate-900">Replay both</Text>
        </Pressable>
      </View>
    </View>
  );
}
