import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <SafeAreaProvider>
      {/* Every screen draws its own header, so the native one is redundant. */}
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
