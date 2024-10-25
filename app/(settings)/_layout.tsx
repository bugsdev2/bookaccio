import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDarkModeContext } from '@/providers/themeProvider';

const SettingLayout = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();
    return (
        <>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <Stack>
                <Stack.Screen
                    name="settings"
                    options={{ headerShown: false }}
                />
            </Stack>
        </>
    );
};

export default SettingLayout;
