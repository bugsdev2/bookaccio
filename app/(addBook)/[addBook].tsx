import { StyleSheet, Text, View, ScrollView, Image, Pressable, TextInput, Alert, Keyboard, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getBookList } from '@/helpers/getBookList';
import { useFontsContext } from '@/providers/fontProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import CustomInput from '@/components/customInput';
import { Dropdown } from 'react-native-element-dropdown';

import bookCoverPlaceholder from '../../assets/images/others/book-cover-placeholder.png';

const AddNewBook = () => {
    const { addBook } = useLocalSearchParams();

    const [font, setFont] = useFontsContext();

    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [selectedBook, setSelectedBook] = useSelectedBookContext();

    const [bookList, setBookList] = useState<BookItem[]>();

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

    const [bookDetails, setBookDetails] = useState({
        id: createUID(),
        title: selectedBook.title ? selectedBook.title : '',
        subtitle: selectedBook.subtitle ? selectedBook.subtitle : '',
        author: selectedBook.authors ? selectedBook.authors[0] : '',
        category: selectedBook.categories ? selectedBook.categories[0] : '',
        pageCount: selectedBook.pageCount ? selectedBook.pageCount : '',
        summary: selectedBook.description ? selectedBook.description : '',
        image: selectedBook.imageLinks?.thumbnail ? selectedBook.imageLinks.thumbnail : '',
        currentPage: '0',
        status: addBook,
        startDate: new Date().toLocaleDateString(),
        endDate: new Date().toLocaleDateString(),
    });

    const statusData = [
        { title: 'Reading', value: 'READING' },
        { title: 'Read Later', value: 'READ_LATER' },
        { title: 'Read', value: 'READ' },
    ];

    useEffect(() => {
        console.log(bookDetails);
    }, []);

    function selectedText() {
        switch (bookDetails.status) {
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

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}
            contentContainerStyle={styles.contentContainer}
        >
            <View>
                <Image
                    style={styles.image}
                    source={selectedBook.imageLinks?.thumbnail ? { uri: bookDetails.image } : bookCoverPlaceholder}
                />
            </View>
            <View style={[styles.detailsContainer, { borderColor: isDarkMode ? Colors.gray : Colors.dark }]}>
                <View>
                    <CustomInput
                        label="Title"
                        value={bookDetails.title}
                        onChangeText={(value) => setBookDetails({ ...bookDetails, title: value })}
                    />
                </View>
                <View>
                    <CustomInput
                        label="Author"
                        value={bookDetails.author}
                        onChangeText={(value) => setBookDetails({ ...bookDetails, author: value })}
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
                        style={[styles.dropDownField, { backgroundColor: isDarkMode ? Colors.black : accentColor, borderColor: isDarkMode ? Colors.gray : Colors.dark }]}
                        labelField={'title'}
                        valueField={'value'}
                        data={statusData}
                        onChange={(selectedItem) => setBookDetails({ ...bookDetails, status: selectedItem.value })}
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
                        value={bookDetails.subtitle}
                        onChangeText={(value) => setBookDetails({ ...bookDetails, subtitle: value })}
                    />
                </View>
                <View>
                    <CustomInput
                        label="Category"
                        value={bookDetails.category}
                        onChangeText={(value) => setBookDetails({ ...bookDetails, category: value })}
                    />
                </View>
                <View>
                    <CustomInput
                        label="Summary"
                        value={bookDetails.summary}
                        onChangeText={(value) => setBookDetails({ ...bookDetails, summary: value })}
                        multiline={true}
                    />
                </View>
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
});
