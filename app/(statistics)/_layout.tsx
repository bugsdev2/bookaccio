import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { useDarkModeContext } from '@/providers/themeProvider';
import { StatusBar } from 'expo-status-bar';

const StatisticsLayout = () => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();
  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name="statistics"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
};

export default StatisticsLayout;

const styles = StyleSheet.create({});
