import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { useDarkModeContext } from '@/providers/themeProvider';
import { useFontsContext } from '@/providers/fontProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { Colors } from '@/constants/Colors';

interface CustomInputProps {
    label: string;
    onChangeText: (value: any) => void;
    value: string;
    multiline?: boolean;
    inputMode?: 'text' | 'numeric';
}

const CustomInput = ({ label, onChangeText, value, multiline = false, inputMode = 'text' }: CustomInputProps) => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [font, setFont] = useFontsContext();

    // To remove html tags from summary
    const cleanText = value.replace(/<\/?[^>]+(>|$)/g, '');

    const [accentColor, setAccentColor] = useAccentColorContext();
    return (
        <View style={[styles.inputContainer, { borderColor: isDarkMode ? Colors.gray : Colors.dark }]}>
            <Text style={[styles.label, { fontFamily: `${font}B`, backgroundColor: isDarkMode ? Colors.black : Colors.light, color: accentColor }]}>{label}</Text>
            <TextInput
                style={[styles.textInput, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}
                value={cleanText}
                onChangeText={onChangeText}
                multiline={multiline}
                textAlign="left"
                inputMode={inputMode}
            />
        </View>
    );
};

export default CustomInput;

const styles = StyleSheet.create({
    inputContainer: {
        borderWidth: 1,
        borderRadius: 10,
    },

    label: {
        fontSize: 18,
        position: 'absolute',
        top: -18,
        left: 18,
        paddingHorizontal: 5,
    },

    textInput: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        flexWrap: 'wrap',
    },
});
