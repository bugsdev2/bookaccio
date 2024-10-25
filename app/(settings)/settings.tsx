import { ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import SettingItem from '@/components/settingItem';
import { useFontsContext } from '@/providers/fontProvider';

const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const theme = [
        { title: 'Light', value: false },
        { title: 'Dark', value: true },
    ];

    const font = [
        { title: 'Libre', value: 'Libre' },
        { title: 'Lora', value: 'Lora' },
        { title: 'Mont', value: 'Mont' },
        { title: 'Nunito', value: 'Nunito' },
        { title: 'Oswald', value: 'Oswald' },
        { title: 'PlayFair', value: 'PlayFair' },
        { title: 'Quicksand', value: 'Quicksand' },
    ];

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
                        data={font}
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
