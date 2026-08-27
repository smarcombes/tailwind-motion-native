import { Link, Stack, type Href } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Motion } from 'tailwind-motion-native';

const EXAMPLES: Array<{
  href: Href;
  title: string;
  blurb: string;
  needs: string;
  emoji: string;
}> = [
  {
    href: '/rombo/landing',
    title: 'Landing page',
    blurb: 'Ten seconds of choreography: drops, rebounds, springs, then blurred words.',
    needs: '9 of 13 elements need a spring or a blur',
    emoji: '🚀',
  },
  {
    href: '/rombo/chat',
    title: 'Chat dialog',
    blurb: 'A card scaling out of its corner, then avatars popping in one by one.',
    needs: 'the avatar pops are springs',
    emoji: '💬',
  },
  {
    href: '/rombo/island',
    title: 'Low Battery Dynamic Island',
    blurb: 'A pill springing open, with the label coming into focus.',
    needs: 'a non-uniform spring and a blur',
    emoji: '🔋',
  },
  {
    href: '/rombo/swatches',
    title: 'Apple Color Swatches',
    blurb: 'A tray springing up from below while each swatch rises inside it.',
    needs: 'the overshoot is the whole effect',
    emoji: '🎨',
  },
  {
    href: '/rombo/loop',
    title: 'Rombo Loop',
    blurb: 'Six loops at once: gears, a floating saucer, a bouncing hammer.',
    needs: 'the float and the bounce curve',
    emoji: '⚙️',
  },
  {
    href: '/rombo/emoji',
    title: 'Emoji Animations',
    blurb: 'Twenty loops, each a different combination of utilities.',
    needs: '9 of 21 need springs, bounce or blur',
    emoji: '👾',
  },
];

/** The six tailwindcss-motion Tailwind Play examples, rebuilt for iOS/Android. */
export default function RomboIndex() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-950">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerClassName="gap-3 p-5"
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }}>
        <Link href="/" className="text-[11px] text-lime-300">
          ← Back to the gallery
        </Link>

        <Motion.Text className="motion-preset-slide-up text-2xl font-bold text-white">
          Rombo&apos;s examples, on device
        </Motion.Text>
        <Motion.Text className="motion-preset-fade motion-delay-100 text-xs leading-5 text-slate-400">
          The six Tailwind Play examples from the tailwindcss-motion README, rebuilt with the same
          classes. Each screen lists what a Nativewind-only port would lose.
        </Motion.Text>

        {EXAMPLES.map((example, index) => (
          <Link key={example.title} href={example.href} asChild>
            <Motion.View
              className={`motion-preset-slide-up motion-delay-[${150 + index * 70}ms] flex-row items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 active:opacity-70`}>
              <Motion.Text className="text-2xl">{example.emoji}</Motion.Text>
              <View className="flex-1 gap-0.5">
                <Motion.Text className="text-sm font-semibold text-white">
                  {example.title}
                </Motion.Text>
                <Motion.Text className="text-[11px] leading-4 text-slate-400">
                  {example.blurb}
                </Motion.Text>
                <Motion.Text className="text-[10px] text-lime-500">{example.needs}</Motion.Text>
              </View>
              <Text className="text-slate-600">›</Text>
            </Motion.View>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}
