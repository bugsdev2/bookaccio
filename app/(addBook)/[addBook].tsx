import { StyleSheet, Text, View, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { getBookList } from '@/helpers/getBookList';
import Modal from 'react-native-modal';
import { useFontsContext } from '@/providers/fontProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import CustomInput from '@/components/customInput';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker, { getToday } from 'react-native-modern-datepicker';

import bookCoverPlaceholder from '../../assets/images/others/book-cover-placeholder.png';

import { addNewBook } from '@/helpers/addNewBook';

const AddNewBook = () => {
    const { addBook }: { addBook: 'READING' | 'READ' | 'READ_LATER' } = useLocalSearchParams();

    if (Array.isArray(addBook)) {
        throw new Error('Custom addBook Array Error');
    }

    const [font, setFont] = useFontsContext();

    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [selectedBook, setSelectedBook] = useSelectedBookContext();

    const [bookList, setBookList] = useState<Book[]>();

    useEffect(() => {
        getBookList().then((data) => {
            setBookList(data);
        });
    }, []);

    function createUID() {
        let uid = Math.round(Math.random() * 10000000000);
        let sameID = bookList?.find((book) => book.id === uid)?.id;
        while (uid === sameID) {
            uid = Math.round(Math.random() * 10000000000);
        }
        return uid;
    }

    const [bookDetails, setBookDetails] = useState<Book>({
        id: createUID(),
        title: selectedBook.title ? selectedBook.title : '',
        subtitle: selectedBook.subtitle ? selectedBook.subtitle : '',
        authors: selectedBook.authors ? selectedBook.authors : [''],
        categories: selectedBook.categories ? selectedBook.categories : [''],
        pageCount: selectedBook.pageCount ? selectedBook.pageCount : 0,
        description: selectedBook.description ? selectedBook.description : '',
        imageLinks: {
            thumbnail: selectedBook.imageLinks ? selectedBook.imageLinks.thumbnail : '',
        },
        currentPage: 0,
        state: addBook,
        startDate: getToday(),
        endDate: '',
    });

    const statusData: { title: string; value: 'READ' | 'READING' | 'READ_LATER' }[] = [
        { title: 'Reading', value: 'READING' },
        { title: 'Read Later', value: 'READ_LATER' },
        { title: 'Read', value: 'READ' },
    ];

    function selectedText() {
        switch (bookDetails.state) {
            case 'READ':
                return 'Read';
                break;
            case 'READING':
                return 'Reading';
                break;
            case 'READ_LATER':
                return 'Read Later';
                break;
        }
    }

    function handleAddBook() {
        if (bookDetails.title === '' || bookDetails.authors[0] === '' || bookDetails.pageCount === 0) {
            Alert.alert('Title, Author and Pages are mandatory fields');
            return;
        }

        addNewBook(bookDetails);
        router.back();
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}
            contentContainerStyle={styles.contentContainer}
        >
            <View>
                <Image
                    style={styles.image}
                    source={selectedBook.imageLinks?.thumbnail !== '' ? { uri: selectedBook.imageLinks.thumbnail } : bookCoverPlaceholder}
                />
            </View>
            <View style={[styles.detailsContainer, { borderColor: isDarkMode ? Colors.gray : Colors.dark }]}>
                <View>
                    <CustomInput
                        label="Title"
                        value={bookDetails.title !== undefined ? bookDetails.title : ''}
                        onChangeText={(value) => setBookDetails({ ...bookDetails, title: value })}
                    />
                </View>
                <View>
                    <CustomInput
                        label="Author"
                        value={bookDetails.authors[0]}
                        onChangeText={(value) => setBookDetails({ ...bookDetails, authors: value })}
                    />
                </View>
                <View>
                    <CustomInput
                        label="Pages"
                        value={bookDetails.pageCount.toString()}
                        onChangeText={(value) => setBookDetails({ ...bookDetails, pageCount: value })}
                        inputMode="numeric"
                    />
                </View>
                <View style={styles.statusContainer}>
                    <Text style={[styles.statusText, { fontFamily: `${font}B`, backgroundColor: isDarkMode ? Colors.black : Colors.light, color: accentColor, zIndex: 1 }]}>Status</Text>
                    <Dropdown
                        style={[styles.dropDownField, { backgroundColor: isDarkMode ? Colors.black : Colors.light, borderColor: isDarkMode ? Colors.gray : Colors.dark }]}
                        labelField={'title'}
                        valueField={'value'}
                        data={statusData}
                        onChange={(selectedItem) => setBookDetails({ ...bookDetails, state: selectedItem.value })}
                        placeholder={selectedText()}
                        placeholderStyle={[styles.dropDownView, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}B` }]}
                        selectedTextStyle={[styles.dropDownView, { color: isDarkMode ? Colors.dark : Colors.light, fontFamily: `${font}B` }]}
                    />
                </View>
            </View>
            <View style={[styles.detailsContainer, { borderColor: isDarkMode ? Colors.gray : Colors.dark }]}>
                <View>
                    <Text style={[styles.title, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>Optional Details</Text>
                </View>
                <View>
                    <CustomInput
                        label="Subtitle"
                        value={bookDetails.subtitle ? bookDetails.subtitle : ''}
                        onChangeText={(value) => setBookDetails({ ...bookDetails, subtitle: value })}
                    />
                </View>
                <View>
                    <CustomInput
                        label="Category"
                        value={bookDetails.categories ? bookDetails.categories[0] : ['']}
                        onChangeText={(value) => setBookDetails({ ...bookDetails, categories: value })}
                    />
                </View>
                <View>
                    <CustomInput
                        label="Description"
                        value={bookDetails.description ? bookDetails.description : ''}
                        onChangeText={(value) => setBookDetails({ ...bookDetails, description: value })}
                        multiline={true}
                    />
                </View>
            </View>
            <View style={styles.btnContainer}>
                <TouchableOpacity
                    onPress={handleAddBook}
                    style={styles.bigBtn}
                >
                    <View>
                        <Text>Add Book</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddNewBook;

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },

    contentContainer: {
        gap: 20,
        paddingBottom: 40,
    },

    image: {
        width: 80,
        height: 120,
        alignSelf: 'center',
        borderRadius: 10,
    },

    title: {
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 10,
    },

    detailsContainer: {
        gap: 20,
        borderWidth: 1,
        padding: 20,
        borderRadius: 10,
    },

    dropDownField: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
    },

    dropDownView: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 5,
        //
    },

    statusContainer: {
        position: 'relative',
    },

    statusText: {
        fontSize: 18,
        position: 'absolute',
        top: -18,
        left: 18,
        paddingHorizontal: 5,
    },

    btnContainer: {
        alignSelf: 'center',
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
});
