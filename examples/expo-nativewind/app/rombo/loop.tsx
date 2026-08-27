import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Motion } from 'tailwind-motion-native';

import { ExampleScreen } from '../../components/example-screen';

/**
 * https://play.tailwindcss.com/MLdegkb9Wq
 *
 * Six loops running at once around the wordmark. Upstream the wordmark's colour
 * loop is a `hover:` state; on a touch screen it is a press.
 */
export default function Loop() {
  const [looping, setLooping] = useState(false);

  return (
    <ExampleScreen
      title="Rombo Loop"
      play="play.tailwindcss.com/MLdegkb9Wq"
      notes={[
        'The gears and the blinking bulb are the parts Nativewind could also do',
        'motion-preset-float is a spring loop; motion-ease-bounce is a linear() curve — neither survives as a class',
        'Static transforms live on a wrapper: an animated transform replaces the whole transform array',
      ]}>
      <LinearGradient
        colors={['#ffffff', '#fcd34d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* A fixed stage, so the pieces stay around the wordmark rather than
            spreading to the edges of whatever window this runs in. */}
        <View className="h-72 w-80 items-center justify-center">
          {/* Two counter-rotating gears, on a rotated wrapper. */}
          <View className="absolute left-6 top-4 -rotate-45 flex-row">
            <Motion.Text className="motion-rotate-loop-[360deg]/reset motion-duration-2000 motion-ease-linear text-5xl">
              ⚙️
            </Motion.Text>
            <Motion.Text className="-motion-rotate-loop-[360deg]/reset motion-duration-2000 motion-ease-linear -ml-2 text-5xl">
              ⚙️
            </Motion.Text>
          </View>

          {/* rotate-12 has to sit outside, or the float animation would replace it. */}
          <View className="absolute top-0 rotate-12">
            <Motion.Text className="motion-preset-float text-5xl">🛸</Motion.Text>
          </View>

          <View className="absolute right-8 top-1/2">
            <Motion.Text className="motion-rotate-loop-45 motion-duration-1000 motion-delay-500 motion-ease-bounce text-5xl">
              🔨
            </Motion.Text>
          </View>

          <Motion.Text className="motion-opacity-loop-50 motion-duration-[1s] absolute bottom-2 left-10 -rotate-12 text-5xl">
            💡
          </Motion.Text>

          <Motion.Text className="motion-preset-pulse-sm motion-duration-200 absolute bottom-2 right-10 text-5xl">
            💣
          </Motion.Text>

          {/* Upstream this is `hover:motion-text-loop-[#f8ff8c]`; a tap is the
              touch equivalent, and toggling the class is all it takes. */}
          <Pressable onPress={() => setLooping((value) => !value)}>
            <Motion.Text
              className={`${looping ? 'motion-text-loop-[#f8ff8c] motion-duration-[200ms]' : ''} text-7xl font-black text-black`}>
              Rombo
            </Motion.Text>
          </Pressable>
        </View>

        <Motion.Text className="motion-preset-fade-lg motion-delay-500 text-[11px] text-black/50">
          {looping ? 'tap the wordmark to stop' : 'tap the wordmark'}
        </Motion.Text>
      </LinearGradient>
    </ExampleScreen>
  );
}
