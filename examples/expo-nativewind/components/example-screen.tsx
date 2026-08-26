import { Link } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  /** The upstream Tailwind Play link this screen recreates. */
  play: string;
  /** Anything worth knowing about the port. */
  notes?: string[];
  children: ReactNode;
};

/**
 * Chrome shared by the six recreations: a title, the original's link, and a
 * Replay button. The Play examples reload the page to watch the animation again;
 * remounting the subtree is the same idea.
 */
export function ExampleScreen({ title, play, notes, children }: Props) {
  const insets = useSafeAreaInsets();
  const [run, setRun] = useState(0);

  return (
    <View className="flex-1 bg-slate-950">
      <View
        className="flex-row items-center justify-between gap-3 px-4 pb-3"
        style={{ paddingTop: insets.top + 10 }}>
        <View className="flex-1">
          <Link href="/rombo" className="text-[11px] text-lime-300">
            ← All recreations
          </Link>
          <Text className="text-base font-semibold text-white">{title}</Text>
          <Text className="text-[10px] text-slate-600">{play}</Text>
        </View>

        <Pressable
          onPress={() => setRun((value) => value + 1)}
          className="rounded-full bg-white px-4 py-2 active:opacity-70">
          <Text className="text-[12px] font-semibold text-slate-900">Replay</Text>
        </Pressable>
      </View>

      <View key={run} className="flex-1">
        {children}
      </View>

      {notes && notes.length > 0 ? (
        <View className="gap-1 px-4 pb-4" style={{ paddingBottom: insets.bottom + 12 }}>
          {notes.map((note) => (
            <Text key={note} className="text-[10px] leading-4 text-slate-500">
              · {note}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
