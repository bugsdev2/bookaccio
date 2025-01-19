import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDarkModeContext } from '@/providers/themeProvider';

const CryptoLayout = () => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();
  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name="cryptoAddress"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
};

export default CryptoLayout;
