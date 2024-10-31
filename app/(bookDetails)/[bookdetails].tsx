import { StyleSheet, Text, View, ScrollView, Image, Pressable, TextInput, Alert, Keyboard, ActivityIndicator, TouchableOpacity } from 'react-native';
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
import { blankBook } from '@/helpers/blankBookDetails';
import { formatDate } from '@/helpers/formatDate';
import DatePicker from 'react-native-modern-datepicker';

const bookCoverPlaceholder = require('@/assets/images/others/book-cover-placeholder.png');

const BookDetails = () => {
    const { bookdetails } = useLocalSearchParams();

    const [bookList, setBookList] = useState<Book[]>([]);

    if (Array.isArray(bookdetails)) throw new Error("bookdetails should't be an array");

    const [font, setFont] = useFontsContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [numOfLines, setNumOfLines] = useState(6);

    const [isModalVisible, setIsModalVisible] = useState(false);

    function handleTextExpansion() {
        numOfLines !== 0 ? setNumOfLines(0) : setNumOfLines(6);
    }

    useEffect(() => {
        getBookList().then((data: Book[]) => {
            setBookList(data);
            // console.log('ola');
        });
    }, []);

    let book = bookList.find((book) => book.title === bookdetails);

    if (book === undefined) {
        return <ActivityIndicator />;
    }

    const [currentPage, setCurrentPage] = useState(book?.currentPage);

    const [pages, setPages] = useState(book?.pageCount);

    const [bookDetails, setBookDetails] = useState<Book>({
        id: book.id,
        title: book.title,
        subtitle: book.subtitle,
        authors: book.authors,
        categories: book.categories,
        pageCount: book.pageCount,
        description: book.description,
        imageLinks: book.imageLinks,
        currentPage: book.currentPage,
        state: book.state,
        startDate: book.startDate,
        endDate: book.endDate,
    });

    let bookProgress = book.currentPage / book.pageCount;

    function handleProgressDetails(id: number) {
        if (currentPage !== undefined) {
            updateBookDetails({ ...blankBook, id, currentPage: currentPage });
        }
        if (pages !== undefined) {
            updateBookDetails({ ...blankBook, id, pageCount: pages });
        }
        Keyboard.dismiss();
        setIsModalVisible(false);
    }

    // // START DATE PICKER //
    // const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);

    // const showStartDatePicker = () => {
    //     setIsStartDatePickerVisible(true);
    // };

    // const hideStartDatePicker = () => {
    //     setIsStartDatePickerVisible(false);
    // };

    // const handleStartDate = (date: string) => {
    //     setBookDetails({ ...book, startDate: date });
    //     hideStartDatePicker();
    // };

    // ///////////////////////

    // // END DATE PICKER //

    // const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);

    // const showEndDatePicker = () => {
    //     setIsEndDatePickerVisible(true);
    // };

    // const hideEndDatePicker = () => {
    //     setIsEndDatePickerVisible(false);
    // };

    // const handleEndDate = (date: string) => {
    //     setBookDetails({ ...bookDetails, endDate: date });
    //     hideEndDatePicker();
    // };

    ////////////////////

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}
            contentContainerStyle={styles.contentContainer}
        >
            <View>
                <Image
                    style={styles.thumbnailImage}
                    source={book.imageLinks.thumbnail !== '' ? { uri: book?.imageLinks.thumbnail } : bookCoverPlaceholder}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : accentColor }]}>{book?.title}</Text>
                {book?.subtitle && <Text style={[styles.subtitle, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}>{book?.subtitle}</Text>}
                <Text style={[styles.author, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}>{book?.authors[0]}</Text>
                <Text
                    onPress={handleTextExpansion}
                    numberOfLines={numOfLines}
                    style={[styles.summary, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}
                >
                    {book?.description?.replace(/<\/?[^>]+(>|$)/g, '')}
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
            {/* <View style={styles.dateContainer}>
                <TouchableOpacity
                    onPress={showStartDatePicker}
                    style={styles.bigBtn}
                >
                    <Text style={[styles.dateLabel, { fontFamily: `${font}B`, color: accentColor, backgroundColor: isDarkMode ? Colors.black : Colors.light }]}>Start Date</Text>
                    <Text style={styles.date}>{formatDate(bookDetails.startDate ? bookDetails.startDate : '')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={showEndDatePicker}
                    style={styles.bigBtn}
                >
                    <Text style={[styles.dateLabel, { fontFamily: `${font}B`, color: accentColor, backgroundColor: isDarkMode ? Colors.black : Colors.light }]}>End Date</Text>
                    <Text style={styles.date}>{formatDate(bookDetails.endDate ? bookDetails.endDate : '')}</Text>
                </TouchableOpacity>
            </View>
            <Modal
                isVisible={isStartDatePickerVisible}
                onBackdropPress={hideStartDatePicker}
            >
                <View></View>
                <DatePicker
                    style={styles.dateTimePicker}
                    mode="calendar"
                    onDateChange={(selectedDate) => handleStartDate(selectedDate)}
                    selected={bookDetails.startDate}
                    current={bookDetails.startDate}
                    minuteInterval={30}
                />
            </Modal>
            <Modal
                isVisible={isEndDatePickerVisible}
                onBackdropPress={hideEndDatePicker}
            >
                <View></View>
                <DatePicker
                    style={styles.dateTimePicker}
                    mode="calendar"
                    onDateChange={(selectedDate) => handleEndDate(selectedDate)}
                    minimumDate={bookDetails.startDate}
                />
            </Modal> */}
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

    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 40,
    },

    dateTimePicker: {
        borderRadius: 20,
    },

    bigBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 80,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },

    dateLabel: {
        fontSize: 18,
        position: 'absolute',
        top: -15,
        paddingHorizontal: 8,
    },

    date: {
        fontSize: 17,
    },
});
