import { Stack } from 'expo-router';
import ThemeProvider, { ThemeContext } from '@/providers/themeProvider';

export default function RootLayout() {
    return (
        <ThemeProvider>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="(settings)"
                    options={{ headerShown: false }}
                />
            </Stack>
        </ThemeProvider>
    );
}
