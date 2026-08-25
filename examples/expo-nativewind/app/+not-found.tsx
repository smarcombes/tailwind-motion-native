import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-slate-950">
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text className="text-xl font-bold text-white">{"This screen doesn't exist."}</Text>
      <Link href="/" className="text-base text-lime-300">
        Go to the gallery
      </Link>
    </View>
  );
}
