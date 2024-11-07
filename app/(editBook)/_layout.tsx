import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useDarkModeContext } from '@/providers/themeProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';

const PagesLayout = () => {
    const { addBook } = useLocalSearchParams();

    const [accentColor, setAccentColor] = useAccentColorContext();

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
                            allowFontScaling={false}
                            adjustsFontSizeToFit={false}
                            lineBreakMode="tail"
                            textBreakStrategy="highQuality"
                            minimumFontScale={12}
                        >
                            Add New Book
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
            </View>
            <Stack>
                <Stack.Screen
                    name="[addBook]"
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
        // borderWidth: 1,
    },
});
