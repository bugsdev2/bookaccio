import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import * as Progress from 'react-native-progress';

const bookCoverPlaceholder = require('@/assets/images/others/book-cover-placeholder.png');

const BookItem = ({ data }: { data: BookItem }) => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const percentCompleted = Math.round((data.currentPage / data.pageCount) * 100);

    if (percentCompleted == 100 && data.state === 'READING') {
        Alert.alert('Move to Completed?', `Do you want to move the book '${data.title}' to the Completed category?`);
    }

    return (
        <TouchableOpacity>
            <View style={[styles.bookContainer, { borderColor: isDarkMode ? Colors.gray : Colors.dark }]}>
                {data.state === 'READING' ? (
                    <Progress.Bar
                        style={[styles.progressBar]}
                        width={null}
                        color={Colors.green}
                        progress={data?.currentPage / data?.pageCount}
                    />
                ) : null}

                <View>
                    <Image
                        style={styles.image}
                        source={data.thumbnailAddress ? { uri: data?.thumbnailAddress } : bookCoverPlaceholder}
                    />
                </View>
                <View style={styles.midContent}>
                    <View style={{ flexWrap: 'wrap' }}>
                        <Text
                            numberOfLines={1}
                            style={[styles.title, { color: isDarkMode ? Colors.light : Colors.dark }]}
                        >
                            {data.title.toUpperCase()}
                        </Text>
                        <Text style={{ color: isDarkMode ? Colors.light : Colors.dark }}>{data?.subTitle}</Text>
                    </View>
                    <View>
                        <Text style={[styles.author, { color: isDarkMode ? Colors.light : Colors.dark }]}>{data.author}</Text>
                    </View>
                </View>
                <View style={[styles.endContent, { justifyContent: data.state === 'READING' ? 'space-around' : 'flex-start' }]}>
                    <Entypo
                        name="dots-three-horizontal"
                        size={18}
                        color={isDarkMode ? Colors.light : Colors.dark}
                    />
                    {data.state === 'READING' ? <Text style={[styles.percent, { color: isDarkMode ? Colors.light : Colors.dark }]}>{percentCompleted}%</Text> : null}
                </View>
            </View>
        </TouchableOpacity>
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
        marginBottom: 5,
        borderRadius: 10,
        overflow: 'hidden',
    },

    image: {
        width: 55,
        height: 75,
        borderRadius: 5,
    },

    title: {
        fontWeight: 'bold',
    },

    author: {
        //
    },

    midContent: {
        width: '74%',
        overflow: 'hidden',
        justifyContent: 'space-around',
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
