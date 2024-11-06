import { StyleSheet, Text, View, ScrollView, Image, Pressable, TextInput, Alert, Keyboard, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useFontsContext } from '@/providers/fontProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import * as Progress from 'react-native-progress';
import Modal from 'react-native-modal';

import { formatDate } from '@/helpers/formatDate';
import GlobalDateTimePicker, { CalendarType, weekDaysJalali, yearMonthsJalali, DateTimePickerMode, DateTimePickerThemes, DateTimePickerTranslations } from 'react-native-global-datetimepicker';
import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { storeBooks } from '@/helpers/storeBooks';

const bookCoverPlaceholder = require('@/assets/images/others/book-cover-placeholder.png');

const BookDetails = () => {
    const { bookdetails } = useLocalSearchParams();

    if (Array.isArray(bookdetails)) throw new Error("bookdetails should't be an array");

    const [fullBooksList, setFullBooksList] = useFullBookListContext();

    const book = fullBooksList.find((book) => book.title === bookdetails);

    const [font, setFont] = useFontsContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [numOfLines, setNumOfLines] = useState(4);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [currentPage, setCurrentPage] = useState(book?.currentPage);

    const [pageCount, setPageCount] = useState(book?.pageCount);

    const [bookProgress, setBookProgress] = useState(book!.currentPage / book!.pageCount);

    const [startDate, setStartDate] = useState(new Date(book!.startDate));

    const [endDate, setEndDate] = useState(new Date(book!.endDate));

    function handleTextExpansion() {
        numOfLines !== 0 ? setNumOfLines(0) : setNumOfLines(4);
    }

    const updateBookDetails = ({ id, authors, currentPage, pageCount, categories, description, endDate, publishedDate, publisher, rating, startDate, state, subtitle, title }: BookOptional) => {
        const updatedBooklist: Book[] = fullBooksList.map((book) => {
            if (book.id === id) {
                return {
                    ...book,
                    authors: authors ? authors : book.authors,
                    categories: categories ? categories : book.categories,
                    currentPage: currentPage ? currentPage : book.currentPage,
                    description: description ? description : book.description,
                    endDate: endDate ? Date.parse(endDate.toString()) : book.endDate,
                    pageCount: pageCount ? pageCount : book.pageCount,
                    publishedDate: publishedDate ? publishedDate : book.publishedDate,
                    publisher: publisher ? publisher : book.publisher,
                    rating: rating ? rating : book.rating,
                    startDate: startDate ? Date.parse(startDate.toString()) : book.startDate,
                    state: state ? state : book.state,
                    subtitle: subtitle ? subtitle : book.subtitle,
                    title: title ? title : book.title,
                };
            } else {
                return {
                    ...book,
                };
            }
        });

        setFullBooksList([...updatedBooklist]);

        storeBooks(updatedBooklist);
    };

    function handleProgressDetails(id: number) {
        if (currentPage! > pageCount!) {
            Alert.alert('Current Page should not exceed Page Count');
            return;
        }

        updateBookDetails({ id, currentPage, pageCount });

        setBookProgress(currentPage! / pageCount!);

        Keyboard.dismiss();

        setIsModalVisible(false);
    }

    // START DATE PICKER //
    const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);

    const showStartDatePicker = () => {
        setIsStartDatePickerVisible(true);
    };

    const hideStartDatePicker = () => {
        setIsStartDatePickerVisible(false);
    };

    const handleStartDate = ({ id, startDate }: { id: number; startDate: Date }) => {
        if (Date.parse(startDate.toString()) > Date.parse(endDate.toString())) {
            Alert.alert('Date Error!', 'Well, how can you end a book before you even start it?');
            return;
        }
        setStartDate(startDate);
        updateBookDetails({ id, startDate });
        hideStartDatePicker();
    };

    ///////////////////////

    // END DATE PICKER //

    const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);

    const showEndDatePicker = () => {
        setIsEndDatePickerVisible(true);
    };

    const hideEndDatePicker = () => {
        setIsEndDatePickerVisible(false);
    };

    const handleEndDate = ({ id, endDate }: { id: number; endDate: Date }) => {
        if (Date.parse(startDate.toString()) > Date.parse(endDate.toString())) {
            Alert.alert('Error!', 'Well, how can you end a book before you even start it?');
            return;
        }
        setEndDate(endDate);
        updateBookDetails({ id, endDate });
        hideEndDatePicker();
    };

    //////////////////

    if (!book) {
        null;
    } else {
        return (
            <ScrollView
                style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}
                contentContainerStyle={styles.contentContainer}
            >
                <View>
                    <Image
                        style={styles.thumbnailImage}
                        source={book?.imageLinks.thumbnail !== '' ? { uri: book?.imageLinks.thumbnail } : bookCoverPlaceholder}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : accentColor }]}>{book?.title}</Text>
                    {book?.subtitle && <Text style={[styles.subtitle, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{book?.subtitle}</Text>}
                    <Text style={[styles.author, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{book?.authors[0]}</Text>
                    <Text style={[styles.category, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}>{book?.categories}</Text>
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
                                borderWidth={1}
                                borderColor={isDarkMode ? Colors.light : Colors.dark}
                                showsText={true}
                                formatText={() => `${Math.round(bookProgress * 100)}%`}
                            />
                        </Pressable>
                    )}
                </View>
                <View style={[styles.dateContainer]}>
                    {book?.state !== 'READ_LATER' && (
                        <>
                            <TouchableOpacity
                                onPress={showStartDatePicker}
                                style={[styles.bigBtn, { borderColor: isDarkMode ? Colors.light : Colors.dark }]}
                            >
                                <Text style={[styles.dateLabel, { fontFamily: `${font}B`, color: accentColor, backgroundColor: isDarkMode ? Colors.black : Colors.light }]}>Start Date</Text>
                                <Text style={[styles.date, { color: isDarkMode ? Colors.light : Colors.dark }]}>{formatDate(startDate)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={showEndDatePicker}
                                style={[styles.bigBtn, { borderColor: isDarkMode ? Colors.light : Colors.dark }]}
                            >
                                <Text style={[styles.dateLabel, { fontFamily: `${font}B`, color: accentColor, backgroundColor: isDarkMode ? Colors.black : Colors.light }]}>End Date</Text>
                                <Text style={[styles.date, { color: isDarkMode ? Colors.light : Colors.dark }]}>{formatDate(endDate)}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <GlobalDateTimePicker
                    visible={isStartDatePickerVisible}
                    initialDate={startDate}
                    onSelect={(selectedDate) => handleStartDate({ id: book.id, startDate: selectedDate })}
                    onCancel={() => setIsStartDatePickerVisible(false)}
                />

                <GlobalDateTimePicker
                    visible={isEndDatePickerVisible}
                    initialDate={endDate}
                    onSelect={(selectedDate) => handleEndDate({ id: book.id, endDate: selectedDate })}
                    onCancel={() => setIsEndDatePickerVisible(false)}
                />

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
                                value={currentPage?.toString()}
                                inputMode="numeric"
                                onChangeText={(value) => setCurrentPage(Number(value))}
                                defaultValue={book?.currentPage.toString()}
                                onSubmitEditing={() => handleProgressDetails(book ? book.id : 0)}
                            />
                        </View>
                        <View style={[styles.modalInputContainer, { borderColor: isDarkMode ? Colors.light : Colors.dark }]}>
                            <Text style={[styles.modalLabel, { fontFamily: `${font}R`, backgroundColor: isDarkMode ? Colors.black : Colors.light, color: isDarkMode ? Colors.light : Colors.dark }]}>Pages</Text>
                            <TextInput
                                style={[styles.modalInput, { fontFamily: `${font}R`, color: isDarkMode ? Colors.light : Colors.dark }]}
                                value={pageCount?.toString()}
                                inputMode="numeric"
                                onChangeText={(value) => setPageCount(Number(value))}
                                defaultValue={book?.pageCount.toString()}
                                onSubmitEditing={() => handleProgressDetails(book ? book.id : 0)}
                            />
                        </View>
                        <View>
                            <Pressable
                                onTouchStart={() => handleProgressDetails(book ? book.id : 0)}
                                style={[styles.modalBtn, { backgroundColor: isDarkMode ? Colors.light : accentColor }]}
                            >
                                <Text style={[styles.modalBtnText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.dark : Colors.light }]}>SAVE</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
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

    category: {
        textAlign: 'center',
    },

    summary: {
        textAlign: 'center',
    },

    progressContainer: {
        marginVertical: 20,
        marginBottom: 40,
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
