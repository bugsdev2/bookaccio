import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const SettingLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="settings"
                options={{ headerShown: false }}
            />
        </Stack>
    );
};

export default SettingLayout;
