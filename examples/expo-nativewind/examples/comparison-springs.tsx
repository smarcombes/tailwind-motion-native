import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Motion } from 'tailwind-motion-native';

/**
 * Nativewind's animation classes are CSS animations: `withTiming` with an
 * ease / cubic-bezier / steps curve. There is no spring easing in CSS, so the
 * closest a class can get is a hand-authored keyframe with an overshoot baked
 * into it — one fixed curve, decided at build time.
 *
 * On this side of the fence the damping ratio is a number, so it can come from
 * state, a prop, a theme or a server response.
 */
export default function ComparisonSprings() {
  const [damping, setDamping] = useState(0.45);
  const [run, setRun] = useState(0);

  const replay = () => setRun((value) => value + 1);
  const nudge = (delta: number) => {
    setDamping((value) => Math.min(1, Math.max(0.08, Number((value + delta).toFixed(2)))));
    replay();
  };

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <View className="flex-1 gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Nativewind
          </Text>
          <View className="h-24 items-center justify-center">
            {/* A keyframe from tailwind.config.js with the bounce drawn by hand. */}
            <View
              key={run}
              className="animate-pop-bezier h-16 w-16 rounded-2xl bg-slate-700"
            />
          </View>
          <Text className="text-[10px] text-slate-500">animate-pop-bezier</Text>
          <Text className="text-[10px] text-slate-600">cubic-bezier, fixed at build time</Text>
        </View>

        <View className="flex-1 gap-2 rounded-2xl border border-lime-900 bg-slate-900 p-4">
          <Text className="text-[10px] font-semibold uppercase tracking-wider text-lime-400">
            tailwind-motion-native
          </Text>
          <View className="h-24 items-center justify-center">
            <Motion.View
              motionKey={run}
              className={`motion-scale-in-50 motion-opacity-in-0 motion-duration-[700ms] motion-ease-[spring(${damping})] h-16 w-16 rounded-2xl bg-lime-300`}
            />
          </View>
          <Text className="text-[10px] text-lime-500">
            motion-ease-[spring({damping})]
          </Text>
          <Text className="text-[10px] text-slate-600">a real spring, damping from state</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => nudge(-0.09)}
          className="rounded-full border border-slate-700 px-3 py-1.5 active:opacity-60">
          <Text className="text-[11px] text-slate-300">bouncier</Text>
        </Pressable>
        <Pressable
          onPress={() => nudge(0.09)}
          className="rounded-full border border-slate-700 px-3 py-1.5 active:opacity-60">
          <Text className="text-[11px] text-slate-300">stiffer</Text>
        </Pressable>
        <Pressable
          onPress={replay}
          className="rounded-full bg-white px-3 py-1.5 active:opacity-70">
          <Text className="text-[11px] font-semibold text-slate-900">Replay both</Text>
        </Pressable>
        <Text className="text-[11px] text-slate-500">damping {damping}</Text>
      </View>
    </View>
  );
}
