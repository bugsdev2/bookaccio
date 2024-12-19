import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import React from 'react';

const ScannerLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[barcodeScanner]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default ScannerLayout;

const styles = StyleSheet.create({});
