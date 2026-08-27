import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { Motion } from 'tailwind-motion-native';

import { ExampleScreen } from '../../components/example-screen';

const AVATARS = [
  { initial: 'A', tint: 'bg-rose-400' },
  { initial: 'K', tint: 'bg-sky-400' },
  { initial: 'M', tint: 'bg-violet-400' },
];

/**
 * https://play.tailwindcss.com/gjGqEKswjQ
 *
 * The card scales up from nothing out of its bottom-right corner, the heading
 * slides in, then the avatars pop one by one on a bouncy spring.
 */
export default function Chat() {
  return (
    <ExampleScreen
      title="Chat dialog"
      play="play.tailwindcss.com/gjGqEKswjQ"
      notes={[
        'The avatars use motion-ease-spring-bouncier — a spring, not a bezier',
        'origin-bottom-right isn’t mapped by Nativewind, so transformOrigin is set in a style prop',
        'Upstream loads remote avatar images; coloured initials stand in',
      ]}>
      <LinearGradient
        colors={['#ffffff', '#fcd34d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Motion.View
          // Upstream: origin-bottom-right. Our animated transform sits in the
          // style prop, and transformOrigin composes with it.
          style={{ transformOrigin: 'bottom right' }}
          className="motion-scale-in-0 motion-opacity-in-0 w-full max-w-sm rounded-3xl border border-black/5 bg-white p-4 shadow-lg">
          <Motion.Text className="motion-preset-slide-left-sm motion-delay-300 mt-1 text-xl font-bold leading-6">
            <Text className="text-black/70">Hey there,{'\n'}</Text>
            How can we help?
          </Motion.Text>

          <View className="my-4 flex-row items-center">
            {AVATARS.map((avatar, index) => (
              <Motion.View
                key={avatar.initial}
                className={`motion-scale-in-0 motion-ease-spring-bouncier motion-delay-[${400 + index * 100}ms] size-14 items-center justify-center rounded-full border-4 border-white ${avatar.tint} ${index > 0 ? '-ml-4' : ''}`}>
                <Motion.Text className="text-lg font-bold text-white">
                  {avatar.initial}
                </Motion.Text>
              </Motion.View>
            ))}
          </View>

          <View className="flex-row gap-4">
            <Motion.View className="motion-preset-fade-lg motion-delay-300 flex-1 items-center rounded-xl bg-amber-950 px-4 py-2">
              <Motion.Text className="font-semibold text-white">Chat with AI</Motion.Text>
            </Motion.View>
            <Motion.View className="motion-preset-fade-lg motion-delay-500 flex-1 items-center rounded-xl border border-amber-950 px-4 py-2">
              <Motion.Text className="font-semibold text-amber-950">Chat with Human</Motion.Text>
            </Motion.View>
          </View>
        </Motion.View>
      </LinearGradient>
    </ExampleScreen>
  );
}
