import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useDarkModeContext } from '@/providers/themeProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useFullBookListContext } from '@/providers/booksFullListProvider';

const PagesLayout = () => {
    const { bookdetails } = useLocalSearchParams();

    const [isDarkMode, setIsDarkMode] = useDarkModeContext();
    const [accentColor, setAccentColor] = useAccentColorContext();

    const [fullBookList, _] = useFullBookListContext();

    if (Array.isArray(bookdetails)) throw new Error("bookdetails shouldn't be an array");

    return (
        <>
            <View style={[styles.header, { backgroundColor: accentColor, borderColor: accentColor }]}>
                <View style={styles.headerInner}>
                    <View style={{ flex: 1 }}>
                        <Pressable onPress={() => router.back()}>
                            <MaterialIcons
                                name="chevron-left"
                                size={40}
                                color={Colors.light}
                            />
                        </Pressable>
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text
                            style={styles.headerText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {fullBookList.find((book) => book.id.toString() === bookdetails)?.title}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}></View>
                </View>
            </View>
            <Stack>
                <Stack.Screen
                    name="[bookdetails]"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </>
    );
};

export default PagesLayout;

const styles = StyleSheet.create({
    header: {
        height: 90,
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },

    headerInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
    },

    headerTextContainer: {
        width: '75%',
    },

    headerText: {
        fontSize: 25,
        color: 'white',
        fontFamily: 'OswaldB',
        textAlign: 'center',
    },

    headerIconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 45,
        height: 40,
        bottom: 8,
    },
});
