
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { setupErrorLogging } from '../utils/errorLogger';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from '../contexts/ThemeContext';

const STORAGE_KEY = 'nfc-contact-emulate';

export default function RootLayout() {
  const { emulate } = useGlobalSearchParams();
  const [isEmulating, setIsEmulating] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setupErrorLogging();
    
    if (emulate === 'true') {
      setIsEmulating(true);
      console.log('Running in emulation mode');
    }
  }, [emulate]);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="settings" />
          </Stack>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
