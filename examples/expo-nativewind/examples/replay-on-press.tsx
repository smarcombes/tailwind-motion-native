import { useState } from 'react';
import { Pressable } from 'react-native';
import { Motion } from 'tailwind-motion-native';

/**
 * Animations play on mount. Change `motionKey` to play them again — no imperative
 * API, no refs.
 */
export default function ReplayOnPress() {
  const [taps, setTaps] = useState(0);

  return (
    <Motion.View className="items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <Motion.View
        motionKey={taps}
        className="motion-preset-pop h-20 w-20 items-center justify-center rounded-2xl bg-lime-300">
        <Motion.Text motionKey={taps} className="motion-preset-shake text-3xl">
          👋
        </Motion.Text>
      </Motion.View>

      <Pressable
        onPress={() => setTaps((count) => count + 1)}
        className="rounded-full bg-white px-5 py-2 active:opacity-70">
        <Motion.Text className="text-sm font-semibold text-slate-900">
          Replay ({taps})
        </Motion.Text>
      </Pressable>
    </Motion.View>
  );
}
