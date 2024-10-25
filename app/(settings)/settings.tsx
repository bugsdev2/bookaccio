import { ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import SettingItem from '@/components/settingItem';
import { theme } from '@/constants/theme';
import { fonts } from '@/constants/fonts';

const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}
            contentContainerStyle={styles.contentContainer}
        >
            <SafeAreaView>
                <View style={styles.headerContainer}>
                    <Text style={[styles.headerTitle]}>Settings</Text>
                </View>
                <View style={{ gap: 10 }}>
                    <SettingItem
                        label="Theme"
                        data={theme}
                    />
                    <SettingItem
                        label="Font"
                        data={fonts}
                    />
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
        color: Colors.green,
        textAlign: 'center',
        fontFamily: 'MontB',
    },
});
