import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, View } from 'react-native';
import { Motion } from 'tailwind-motion-native';

import { ExampleScreen } from '../../components/example-screen';

/**
 * https://play.tailwindcss.com/86s55I4wmC
 *
 * Twenty loops, every one a different combination of base utilities, per
 * property durations and easings. The classes are upstream's, verbatim.
 */
const EMOJI: Array<{ emoji: string; className: string; wrapper?: string }> = [
  { emoji: '🛸', className: 'motion-preset-float' },
  {
    emoji: '🔨',
    className: 'motion-rotate-loop-45 motion-duration-1000 motion-delay-500 motion-ease-bounce',
  },
  {
    emoji: '⚙️',
    className: 'motion-rotate-loop-[360deg]/reset motion-duration-2000 motion-ease-linear',
  },
  {
    emoji: '⚙️',
    className: '-motion-rotate-loop-[360deg]/reset motion-duration-2000 motion-ease-linear',
  },
  { emoji: '💡', className: 'motion-opacity-loop-50 motion-duration-[1s]' },
  { emoji: '💣', className: 'motion-preset-pulse-sm motion-duration-200' },
  {
    emoji: '🏐',
    // Upstream keeps scale-x-75 on the same element; an animated transform
    // replaces the whole array, so the static part moves to the wrapper.
    wrapper: 'scale-x-75',
    className: 'motion-scale-x-loop-150/reset motion-translate-y-loop-75/reset motion-ease-bounce',
  },
  { emoji: '👻', className: 'motion-preset-stretch-lg' },
  { emoji: '🔔', className: 'motion-preset-seesaw-lg' },
  { emoji: '💧', className: 'motion-translate-y-loop-75/reset motion-ease-in-cubic' },
  {
    emoji: '💥',
    className:
      'motion-translate-x-loop-[10%] motion-rotate-loop-45 motion-duration-100 motion-duration-100/rotate',
  },
  { emoji: '👀', className: 'motion-scale-loop-50 motion-blur-loop-sm' },
  {
    emoji: '👾',
    className:
      'motion-preset-wobble-lg motion-rotate-loop-45 motion-duration-1000/rotate motion-duration-700/translate',
  },
  { emoji: '🤩', className: 'motion-scale-loop-150 motion-ease-spring-bounciest' },
  { emoji: '😶‍🌫️', className: 'motion-opacity-loop-0 motion-duration-[1s]' },
  { emoji: '🤕', className: 'motion-rotate-loop-45 motion-ease-linear' },
  {
    emoji: '🏄‍♂️',
    className:
      'motion-translate-y-loop-75 motion-rotate-loop-12 motion-duration-2000/translate motion-ease-in-out motion-ease-spring-bouncier/rotate',
  },
  { emoji: '😵‍💫', className: 'motion-rotate-loop-[360deg]/reset motion-ease-spring-bouncier' },
  { emoji: '🗡️', className: 'motion-rotate-loop-45 motion-ease-in-quart' },
  { emoji: '🥌', className: 'motion-translate-x-loop-100 motion-duration-2000 motion-ease-in-cubic' },
  {
    emoji: '🪃',
    className: 'motion-translate-x-loop-150 motion-rotate-loop-[360deg] motion-ease-in-out',
  },
];

export default function Emoji() {
  return (
    <ExampleScreen
      title="Emoji Animations"
      play="play.tailwindcss.com/86s55I4wmC"
      notes={[
        'All 21 class strings are upstream’s, unchanged',
        'Nine of them need a spring, the bounce curve, or a blur',
        'motion-duration-1000/rotate + motion-duration-700/translate: one element, two clocks',
      ]}>
      <LinearGradient
        colors={['#ffffff', '#fcd34d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}>
        <ScrollView contentContainerClassName="p-4">
          {/* A plain View, because a ScrollView's content container keeps its
              own flexDirection on web. */}
          <View className="flex-row flex-wrap justify-center gap-2">
            {EMOJI.map(({ emoji, className, wrapper }, index) => (
              <View
                key={`${emoji}-${index}`}
                className="h-24 w-[31%] items-center justify-center rounded-2xl bg-white/40">
                <View className={wrapper}>
                  <Motion.Text className={`${className} text-3xl`}>{emoji}</Motion.Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </ExampleScreen>
  );
}
