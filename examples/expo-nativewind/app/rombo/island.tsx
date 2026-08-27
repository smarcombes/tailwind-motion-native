import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { Motion } from 'tailwind-motion-native';

import { ExampleScreen } from '../../components/example-screen';

/** The lucide battery-low icon, drawn with views instead of SVG. */
function BatteryLow() {
  return (
    <View className="h-6 w-11 flex-row items-center">
      <View className="h-5 flex-1 flex-row items-center gap-0.5 rounded-md border-2 border-red-300 px-1">
        <View className="h-2.5 w-1 rounded-sm bg-red-300" />
      </View>
      <View className="ml-0.5 h-2 w-0.5 rounded-sm bg-red-300" />
    </View>
  );
}

/**
 * https://play.tailwindcss.com/tvYFbHtNNQ
 *
 * The pill springs open from 30% of its width, then the label and the battery
 * readout come into focus.
 */
export default function Island() {
  return (
    <ExampleScreen
      title="Low Battery Dynamic Island"
      play="play.tailwindcss.com/tvYFbHtNNQ"
      notes={[
        'motion-scale-x-in-[30%] with motion-ease-spring-bouncy: a non-uniform spring',
        'motion-preset-focus is a blur, which Nativewind drops on native',
        'Upstream also has motion-timing-spring-smooth, a class that no longer exists — the library reports it as ignored',
      ]}>
      <LinearGradient
        colors={['#ffffff', '#fcd34d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Motion.View className="motion-scale-x-in-[30%] motion-scale-y-in-90 motion-ease-spring-bouncy h-10 w-80 flex-row items-center justify-between rounded-full bg-black px-3 py-2">
          <Motion.Text className="motion-preset-focus motion-duration-500 motion-delay-100 motion-ease-spring-smooth text-base font-medium text-white">
            Low Battery
          </Motion.Text>

          <Motion.View className="motion-preset-focus motion-duration-500 motion-delay-100 motion-ease-spring-smooth flex-row items-center gap-1">
            <BatteryLow />
            <Motion.Text className="text-base font-medium text-red-400">20%</Motion.Text>
          </Motion.View>
        </Motion.View>
      </LinearGradient>
    </ExampleScreen>
  );
}
