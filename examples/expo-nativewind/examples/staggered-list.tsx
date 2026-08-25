import { Motion } from 'tailwind-motion-native';

const MESSAGES = [
  { from: 'Rombo', text: 'Motion, without commotion.' },
  { from: 'Nativewind', text: 'Tailwind, everywhere.' },
  { from: 'Reanimated', text: 'Running on the UI thread.' },
  { from: 'You', text: 'Shipping today.' },
];

/** The classic list reveal: one preset, a delay per row. */
export default function StaggeredList() {
  return (
    <Motion.View className="gap-2">
      {MESSAGES.map((message, index) => (
        <Motion.View
          key={message.from}
          className={`motion-preset-slide-left motion-delay-[${index * 120}ms] flex-row items-center gap-3 rounded-2xl bg-slate-900 p-4`}>
          <Motion.View className="h-9 w-9 items-center justify-center rounded-full bg-lime-300">
            <Motion.Text className="font-bold text-slate-900">{message.from[0]}</Motion.Text>
          </Motion.View>
          <Motion.View className="flex-1">
            <Motion.Text className="text-sm font-semibold text-white">{message.from}</Motion.Text>
            <Motion.Text className="text-xs text-slate-400">{message.text}</Motion.Text>
          </Motion.View>
        </Motion.View>
      ))}
    </Motion.View>
  );
}
