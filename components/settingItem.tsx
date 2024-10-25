import { useDarkModeContext } from '@/providers/themeProvider';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Colors } from '../constants/Colors';
import { useFontsContext } from '@/providers/fontProvider';
import { setData } from '@/helpers/storage';
import { useAccentColorContext } from '@/providers/accentColorProvider';

const SettingItem = ({ label, data }: SettingItemProps) => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [font, setFont] = useFontsContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const selectedText = () => {
        switch (label) {
            case 'Theme':
                return isDarkMode ? 'Dark' : 'Light';
            case 'Font':
                return font;
            case 'Accent Color':
                return data.filter((item) => item.value === accentColor)[0].title;
        }
    };

    const handleSelectedItem = (value: any) => {
        switch (label) {
            case 'Theme':
                setIsDarkMode(value);
                setData('theme', value);
                break;
            case 'Font':
                setFont(value);
                setData('font', value);
                break;
            case 'Accent Color':
                setAccentColor(value);
                setData('accentColor', value);
                break;
        }
    };

    return (
        <View style={styles.themeContainer}>
            <Text style={[styles.themeLabel, { color: isDarkMode ? Colors.light : Colors.dark }]}>{label}</Text>
            <View style={[styles.themeSelect]}>
                <Dropdown
                    style={[styles.dropDownView, { backgroundColor: isDarkMode ? Colors.light : accentColor }]}
                    data={data}
                    onChange={(selectedItem) => handleSelectedItem(selectedItem.value)}
                    labelField={'title'}
                    placeholder={selectedText()}
                    placeholderStyle={[styles.dropDownView, { color: isDarkMode ? Colors.dark : Colors.light }]}
                    selectedTextStyle={[styles.dropDownView, { color: isDarkMode ? Colors.dark : Colors.light }]}
                    valueField={'value'}
                    itemTextStyle={styles.dropDownText}
                />
            </View>
        </View>
    );
};

export default SettingItem;

const styles = StyleSheet.create({
    themeContainer: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },

    themeLabel: {
        fontSize: 15,
        flex: 1,
        fontFamily: 'MontB',
    },

    themeSelect: {
        flex: 4.5,
    },

    themeSelectInner: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 5,
    },

    themeSelectText: {
        fontSize: 15,
        fontFamily: 'MontB',
    },

    chevronContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    dropDownView: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 5,
        fontFamily: 'MontR',
    },

    dropDownText: {
        fontFamily: 'MontR',
    },
});
