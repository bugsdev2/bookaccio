import { ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import SettingItem from '@/components/settingItem';
import { theme } from '@/constants/theme';
import { fonts } from '@/constants/fonts';
import { accentColors } from '@/constants/accentColors';
import { useAccentColorContext } from '@/providers/accentColorProvider';

const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}
            contentContainerStyle={styles.contentContainer}
        >
            <SafeAreaView>
                <View style={styles.headerContainer}>
                    <Text style={[styles.headerTitle, { color: accentColor }]}>Settings</Text>
                </View>
                <View style={{ gap: 15 }}>
                    <View style={styles.sectionContainer}>
                        <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>Colors</Text>
                        <SettingItem
                            label="Accent Color"
                            data={accentColors}
                        />
                        <SettingItem
                            label="Theme"
                            data={theme}
                        />
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={[styles.subheading, { color: isDarkMode ? Colors.light : Colors.dark }]}>Fonts</Text>
                        <SettingItem
                            label="Font"
                            data={fonts}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        //
    },

    contentContainer: {
        padding: 10,
    },

    headerContainer: {
        padding: 10,
        marginBottom: 10,
    },

    headerTitle: {
        fontSize: 25,
        textAlign: 'center',
        fontFamily: 'MontB',
    },

    sectionContainer: {
        gap: 15,
    },

    subheading: {
        textAlign: 'center',
        fontFamily: 'MontB',
        fontSize: 18,
    },
});
