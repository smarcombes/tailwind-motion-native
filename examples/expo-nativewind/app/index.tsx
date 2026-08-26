import { Link, Stack } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EnterPresets from '../examples/enter-presets';
import EscapeHatches from '../examples/escape-hatches';
import Hero from '../examples/hero';
import Loops from '../examples/loops';
import ReplayOnPress from '../examples/replay-on-press';
import StaggeredList from '../examples/staggered-list';

type SectionProps = {
  title: string;
  description: string;
  source: string;
  children: ReactNode;
};

/** Each section can be replayed by remounting it. */
function Section({ title, description, source, children }: SectionProps) {
  const [run, setRun] = useState(0);

  return (
    <View className="gap-3">
      <View className="flex-row items-end justify-between">
        <View className="flex-1 gap-1">
          <Text className="text-lg font-semibold text-white">{title}</Text>
          <Text className="text-xs text-slate-400">{description}</Text>
          <Text className="text-[10px] text-slate-600">examples/{source}</Text>
        </View>

        <Pressable
          onPress={() => setRun((value) => value + 1)}
          className="rounded-full border border-slate-700 px-3 py-1.5 active:opacity-60">
          <Text className="text-[11px] font-medium text-slate-300">Replay</Text>
        </Pressable>
      </View>

      <View key={run}>{children}</View>
    </View>
  );
}

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-950">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerClassName="gap-8 p-5"
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }}>
        <Section
          title="Hero"
          description="One preset, three delays."
          source="hero.tsx">
          <Hero />
        </Section>

        <Section
          title="Enter presets"
          description="Every motion-preset-* that animates in, staggered with an arbitrary delay."
          source="enter-presets.tsx">
          <EnterPresets />
        </Section>

        <Section
          title="Loops"
          description="Infinite presets, mapped to Reanimated's withRepeat."
          source="loops.tsx">
          <Loops />
        </Section>

        <Section
          title="Staggered list"
          description="A delay per row is all a list reveal needs."
          source="staggered-list.tsx">
          <StaggeredList />
        </Section>

        <Section
          title="Replay"
          description="Change motionKey to play an animation again."
          source="replay-on-press.tsx">
          <ReplayOnPress />
        </Section>

        <Section
          title="Escape hatches"
          description="motion() for your own components, useMotion() for full control."
          source="escape-hatches.tsx">
          <EscapeHatches />
        </Section>

        <Link
          href="/rombo"
          className="rounded-2xl border border-lime-900 bg-lime-400/5 p-4 text-center text-[12px] font-medium text-lime-300">
          Rombo&apos;s six Tailwind Play examples, rebuilt for iOS &amp; Android →
        </Link>

        <Link
          href="/nativewind"
          className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center text-[12px] font-medium text-slate-300">
          What classes alone can&apos;t do → springs, runtime values, random recipes
        </Link>

        <Text className="pt-4 text-center text-[11px] text-slate-600">
          tailwind-motion-native · Expo + Nativewind + Reanimated
        </Text>
      </ScrollView>
    </View>
  );
}
