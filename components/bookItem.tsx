import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import * as Progress from 'react-native-progress';
import { useFontsContext } from '@/providers/fontProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { router } from 'expo-router';

const bookCoverPlaceholder = require('@/assets/images/others/book-cover-placeholder.png');

const BookItem = ({ data }: { data: Book }) => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [font, setFont] = useFontsContext();

    const percentCompleted = Math.round((Number(data.currentPage) / Number(data.pageCount)) * 100);

    if (percentCompleted == 100 && data.state === 'READING') {
        Alert.alert('Move to Completed?', `Do you want to move the book '${data.title}' to the Completed category?`);
    }

    return (
        <>
            <TouchableOpacity
                onPress={() => {
                    router.push({
                        pathname: '/(bookDetails)/[bookdetails]',
                        params: { bookdetails: data.title ? data.title : '' },
                    });
                }}
            >
                <View style={[styles.bookContainer, { borderColor: isDarkMode ? Colors.gray : Colors.dark }]}>
                    {data.state === 'READING' ? (
                        <Progress.Bar
                            style={[styles.progressBar]}
                            width={null}
                            color={accentColor}
                            progress={data?.currentPage / data?.pageCount}
                        />
                    ) : null}

                    <View>
                        <Image
                            style={styles.image}
                            source={data.imageLinks.thumbnail !== '' ? { uri: data.imageLinks.thumbnail } : bookCoverPlaceholder}
                        />
                    </View>
                    <View style={styles.midContent}>
                        <View style={{ flexWrap: 'wrap' }}>
                            <Text
                                numberOfLines={1}
                                style={[styles.title, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}B` }]}
                            >
                                {data.title?.toUpperCase()}
                            </Text>
                            <Text style={[styles.subtitle, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}R` }]}>{data?.subtitle}</Text>
                        </View>
                        <View>
                            <Text style={[styles.author, { color: isDarkMode ? Colors.gray : Colors.dark, fontFamily: `${font}R` }]}>{data.authors && data.authors[0]}</Text>
                        </View>
                    </View>
                    <View style={[styles.endContent, { justifyContent: data.state === 'READING' ? 'space-around' : 'flex-start' }]}>
                        <Entypo
                            name="dots-three-horizontal"
                            size={18}
                            color={isDarkMode ? Colors.light : Colors.dark}
                        />
                        {data.state === 'READING' ? <Text style={[styles.percent, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}R` }]}>{percentCompleted}%</Text> : null}
                    </View>
                </View>
            </TouchableOpacity>
        </>
    );
};

export default BookItem;

const styles = StyleSheet.create({
    bookContainer: {
        flexDirection: 'row',
        margin: 10,
        padding: 10,
        borderWidth: 1,
        gap: 10,
        marginBottom: 0,
        borderRadius: 10,
        overflow: 'hidden',
    },

    image: {
        width: 55,
        height: 75,
        borderRadius: 5,
    },

    title: {
        letterSpacing: 0.5,
    },

    subtitle: {
        // fontFamily: 'QuicksandR',
    },

    author: {
        // fontFamily: 'QuicksandR',
    },

    midContent: {
        width: '74%',
        overflow: 'hidden',
    },

    endContent: {
        marginLeft: 'auto',
    },

    percent: {},

    progressBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        borderWidth: 0,
        borderRadius: 0,
        height: 4,
    },
});
