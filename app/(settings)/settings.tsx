import { StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getData, setData } from '@/helpers/storage';
import SelectDropdown from 'react-native-select-dropdown';
import { ThemeContext, useDarkModeContext } from '@/providers/themeProvider';

const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const theme = [
        { title: 'Light', value: false },
        { title: 'Dark', value: true },
    ];

    return (
        <SafeAreaView>
            <View style={{ flexDirection: 'row' }}>
                <Text>Theme:</Text>
                <View style={{ flex: 1, borderWidth: 6 }}>
                    <SelectDropdown
                        dropdownStyle={{ flex: 1 }}
                        onSelect={(selectedItem) => {
                            setIsDarkMode(selectedItem.value);
                        }}
                        data={theme}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View style={{ backgroundColor: 'yellow', borderWidth: 3 }}>
                                    <Text>{selectedItem ? selectedItem.title : isDarkMode ? 'Dark' : 'Light'}</Text>
                                </View>
                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (
                                <View style={{ backgroundColor: 'red' }}>
                                    <Text>{item.title}</Text>
                                </View>
                            );
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Settings;

const styles = StyleSheet.create({});
