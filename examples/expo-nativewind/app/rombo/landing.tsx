import { ScrollView, Text, View } from 'react-native';
import { Motion } from 'tailwind-motion-native';

import { ExampleScreen } from '../../components/example-screen';

const CARDS = [
  {
    title: 'Shopify',
    copy: 'Join thousands of Shopify users bringing their stores to life with Rombo.',
    tint: 'bg-lime-800/50',
    glyph: '🛍️',
  },
  {
    title: 'TailwindCSS',
    copy: 'Add intricate animations to your frontend in no time at all.',
    tint: 'bg-teal-800/50',
    glyph: '🌬️',
  },
  {
    title: 'Figma',
    copy: 'Add interactivity to your designs without leaving the Figma canvas.',
    tint: 'bg-gray-800/50',
    glyph: '🎨',
  },
];

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

/**
 * https://play.tailwindcss.com/uAuVF8F1vC
 *
 * A ten second choreography built entirely out of delays: the logo drops, the
 * nav links rebound, the cards spring in from the left, then each word of the
 * headline defocuses into place.
 */
export default function Landing() {
  return (
    <ExampleScreen
      title="Landing page"
      play="play.tailwindcss.com/uAuVF8F1vC"
      notes={[
        'motion-preset-rebound-down and motion-ease-spring-bouncier are springs (damping 0.5)',
        'motion-preset-blur-left animates a blur, via React Native’s filter style',
        'The three logos are SVGs upstream, which React Native’s Image can’t load — emoji stand in',
      ]}>
      <ScrollView className="flex-1 bg-black" contentContainerClassName="pb-16">
        <View className="flex-row items-center justify-between p-4">
          <Motion.Text className="motion-preset-slide-down text-2xl font-black text-white">
            Rombo
          </Motion.Text>
          <View className="flex-row gap-5">
            {['Products', 'Learn More', 'Contact Us'].map((label, index) => (
              <Motion.Text
                key={label}
                className={`motion-preset-rebound-down motion-delay-[${400 + index * 50}ms] text-xs font-semibold text-white`}>
                {label}
              </Motion.Text>
            ))}
          </View>
        </View>

        <View className="px-6 py-4">
          <Motion.Text className="motion-preset-fade motion-delay-[700ms] pb-6 text-xl font-bold text-white/70">
            SOLUTIONS
          </Motion.Text>

          <View className="mt-10 gap-10">
            {CARDS.map((card, index) => (
              <Motion.View
                key={card.title}
                className={`motion-preset-slide-left motion-ease-spring-bouncier motion-delay-[${1000 + index * 300}ms] rounded-2xl ${card.tint} p-4`}>
                <View className="-mt-12 mb-4 size-20 items-center justify-center rounded-2xl bg-white/10">
                  <Text className="text-4xl">{card.glyph}</Text>
                </View>
                <Text className="mb-2 text-2xl font-bold text-white">{card.title}</Text>
                <Text className="text-sm text-white/80">{card.copy}</Text>
              </Motion.View>
            ))}
          </View>

          <View className="mt-10 flex-row flex-wrap gap-x-3">
            {['MOTION', 'WITHOUT', 'COMMOTION'].map((word, index) => (
              <Motion.Text
                key={word}
                className={`motion-preset-blur-left motion-delay-[${2400 + index * 400}ms] text-3xl font-black leading-10 text-white`}>
                {word}
              </Motion.Text>
            ))}
          </View>

          {[0, 1].map((index) => (
            <Motion.Text
              key={index}
              className="motion-preset-fade-lg motion-delay-[4s] mt-4 text-sm font-thin text-white">
              {LOREM}
            </Motion.Text>
          ))}
        </View>
      </ScrollView>
    </ExampleScreen>
  );
}
