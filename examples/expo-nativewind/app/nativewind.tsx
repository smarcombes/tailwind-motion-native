import { Link, Stack } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ComparisonSprings from '../examples/comparison-springs';
import ComparisonStagger from '../examples/comparison-stagger';
import ShowcaseShuffle from '../examples/showcase-shuffle';

type SectionProps = {
  title: string;
  claim: string;
  why: string;
  children: ReactNode;
};

function Section({ title, claim, why, children }: SectionProps) {
  return (
    <View className="gap-3">
      <View className="gap-1">
        <Text className="text-lg font-semibold text-white">{title}</Text>
        <Text className="text-xs leading-5 text-slate-400">{claim}</Text>
        <Text className="text-[11px] leading-4 text-slate-600">{why}</Text>
      </View>
      {children}
    </View>
  );
}

export default function NativewindComparison() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-950">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerClassName="gap-8 p-5"
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }}>
        <View className="gap-2">
          <Link href="/" className="text-[11px] text-lime-300">
            ← Back to the gallery
          </Link>
          <Text className="text-2xl font-bold text-white">What classes alone can&apos;t do</Text>
          <Text className="text-xs leading-5 text-slate-400">
            Nativewind can already run keyframe animations. What it can&apos;t do is decide an
            animation at runtime, or use a spring: its engine is withTiming with an
            ease/cubic-bezier/steps curve, and Reanimated&apos;s CSS easings are cubic-bezier,
            linear and steps. There is no spring in CSS.
          </Text>
        </View>

        <Section
          title="A real spring"
          claim="Left: a hand-drawn overshoot in a cubic-bezier keyframe. Right: an actual spring whose damping ratio comes from state."
          why="No CSS easing is a spring, so the curve has to be authored per case — and once authored it can't be parameterised.">
          <ComparisonSprings />
        </Section>

        <Section
          title="A stagger the compiler never saw"
          claim="Left: one compiled class on every row, so all five slide in together. Right: the same animation with a delay per row, and a step you can change while it runs."
          why="A fixed list could enumerate one keyframe variant per delay. A value that comes from state or data can't be a class at all, because Tailwind compiles CSS before the app runs.">
          <ComparisonStagger />
        </Section>

        <Section
          title="Twelve springs, re-rolled on every tap"
          claim="Each chip gets its own distance, rotation, scale, spring, duration and delay, generated a frame before it plays."
          why="This is the case that has no class-based equivalent at all: the stylesheet would need a rule per outcome, and the outcomes are random.">
          <ShowcaseShuffle />
        </Section>

        <Text className="pt-2 text-center text-[11px] text-slate-600">
          Same vocabulary as tailwindcss-motion · played by Reanimated
        </Text>
      </ScrollView>
    </View>
  );
}
