import { StyleSheet, Text, View, ScrollView, Image, Pressable, TextInput, Alert, Keyboard, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getBookList } from '@/helpers/getBookList';
import { useFontsContext } from '@/providers/fontProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import * as Progress from 'react-native-progress';
import Modal from 'react-native-modal';
import { updateBookDetails } from '@/helpers/updateBookDetails';

const bookCoverPlaceholder = require('@/assets/images/others/book-cover-placeholder.png');

const BookDetails = () => {
    const { bookDetails } = useLocalSearchParams();

    const [bookList, setBookList] = useState<BookItem[]>([]);

    const book = bookList.find((book) => book.title === bookDetails);

    const [font, setFont] = useFontsContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [numOfLines, setNumOfLines] = useState(6);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [currentPage, setCurrentPage] = useState(book?.currentPage);

    const [pages, setPages] = useState(book?.pageCount);

    useEffect(() => {
        getBookList().then((data) => {
            setBookList(data);
        });
    }, [bookList]);

    function handleTextExpansion() {
        numOfLines !== 0 ? setNumOfLines(0) : setNumOfLines(6);
    }

    if (book === undefined) return <ActivityIndicator />;

    let bookProgress = book.currentPage / book.pageCount;

    function handleProgressDetails(id: number) {
        if (currentPage !== undefined) {
            updateBookDetails({ id, currentPage: currentPage });
        }
        if (pages !== undefined) {
            updateBookDetails({ id, pageCount: Number(pages) });
        }
        Keyboard.dismiss();
        setIsModalVisible(false);
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}
            contentContainerStyle={styles.contentContainer}
        >
            <View>
                <Image
                    style={styles.thumbnailImage}
                    source={book.thumbnailAddress ? { uri: book?.thumbnailAddress } : bookCoverPlaceholder}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : accentColor }]}>{book?.title}</Text>
                {book?.subTitle && <Text style={[styles.subtitle, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}>{book?.subTitle}</Text>}
                <Text style={[styles.author, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}>{book?.author}</Text>
                <Text
                    onPress={handleTextExpansion}
                    numberOfLines={numOfLines}
                    style={[styles.summary, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}
                >
                    {book?.summary}
                </Text>
            </View>
            <View style={styles.progressContainer}>
                {book?.state !== 'READ_LATER' && (
                    <Pressable onPress={() => setIsModalVisible(true)}>
                        <Progress.Circle
                            size={180}
                            color={accentColor}
                            progress={bookProgress}
                            thickness={10}
                            borderWidth={0}
                            borderColor={isDarkMode ? Colors.light : Colors.dark}
                            showsText={true}
                            formatText={() => `${Math.round(bookProgress * 100)}%`}
                        />
                    </Pressable>
                )}
            </View>
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setIsModalVisible(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}>
                    <View>
                        <Text style={[styles.modalHeader, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : accentColor }]}>Enter Progress</Text>
                    </View>
                    <View style={[styles.modalInputContainer, { borderColor: isDarkMode ? Colors.light : Colors.dark }]}>
                        <Text style={[styles.modalLabel, { fontFamily: `${font}R`, backgroundColor: isDarkMode ? Colors.black : Colors.light, color: isDarkMode ? Colors.light : Colors.dark }]}>Current Page</Text>
                        <TextInput
                            style={[styles.modalInput, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}
                            // value={currentPage?.toString()}
                            inputMode="numeric"
                            onChangeText={(value) => setCurrentPage(Number(value))}
                            defaultValue={book?.currentPage.toString()}
                        />
                    </View>
                    <View style={[styles.modalInputContainer, { borderColor: isDarkMode ? Colors.light : Colors.dark }]}>
                        <Text style={[styles.modalLabel, { fontFamily: `${font}R`, backgroundColor: isDarkMode ? Colors.black : Colors.light, color: isDarkMode ? Colors.light : Colors.dark }]}>Pages</Text>
                        <TextInput
                            style={[styles.modalInput, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}
                            // value={pages?.toString()}
                            inputMode="numeric"
                            onChangeText={(value) => setPages(Number(value))}
                            defaultValue={book?.pageCount.toString()}
                        />
                    </View>
                    <View>
                        <Pressable
                            onTouchStart={() => handleProgressDetails(book.id)}
                            style={[styles.modalBtn, { backgroundColor: isDarkMode ? Colors.light : accentColor }]}
                        >
                            <Text style={[styles.modalBtnText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.dark : Colors.light }]}>SAVE</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default BookDetails;

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },

    contentContainer: {
        alignItems: 'center',
        gap: 10,
        paddingBottom: 30,
    },

    thumbnailImage: {
        width: 100,
        height: 140,
        borderRadius: 10,
    },

    textContainer: {
        gap: 8,
    },

    title: {
        fontSize: 18,
        textTransform: 'uppercase',
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },

    author: {
        fontSize: 15,
        textAlign: 'center',
    },

    summary: {
        textAlign: 'center',
    },

    progressContainer: {
        marginTop: 20,
    },

    modalHeader: {
        fontSize: 20,
    },

    modalContainer: {
        padding: 20,
        paddingBottom: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        borderRadius: 15,
    },

    modalInputContainer: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        width: '70%',
    },

    modalLabel: {
        textAlign: 'center',
        fontSize: 15,
        position: 'absolute',
        top: -15,
        left: 15,
        paddingHorizontal: 10,
    },

    modalInput: {
        fontSize: 16,
    },

    modalBtn: {
        paddingHorizontal: 30,
        paddingVertical: 5,
        borderRadius: 10,
    },

    modalBtnText: {
        fontSize: 15,
    },
});
