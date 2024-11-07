import { StyleSheet, Text, View, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useFontsContext } from '@/providers/fontProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import CustomInput from '@/components/customInput';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import bookCoverPlaceholder from '../../assets/images/others/book-cover-placeholder.png';

import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { storeBooks } from '@/helpers/storeBooks';

const AddNewBook = () => {
    const { editBook }: { editBook: any } = useLocalSearchParams();

    if (Array.isArray(editBook)) {
        throw new Error("Custom addBook mustn't be an Array Error");
    }

    const [font, setFont] = useFontsContext();

    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [selectedBook, setSelectedBook] = useSelectedBookContext();

    const [fullBookList, setFullBookList] = useFullBookListContext();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [imgUrl, setImgUrl] = useState('');

    const imageRef = useRef(null);

    function createUID() {
        let uid = Math.round(Math.random() * 10000000000);
        let sameID = fullBookList?.find((book) => book.id === uid)?.id;
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
        state: selectedBook.state,
        startDate: Date.parse(new Date().toString()),
        endDate: Date.parse(new Date().toString()),
        publishedDate: selectedBook.publishedDate,
        language: selectedBook.language,
        publisher: selectedBook.publisher,
        maturityRating: selectedBook.maturityRating,
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

    function handleImageChange() {
        setBookDetails({ ...bookDetails, imageLinks: { thumbnail: imgUrl } });
        setIsModalVisible(false);
    }

    function handleAddBook() {
        if (bookDetails.title === '' || bookDetails.authors[0] === '' || bookDetails.pageCount === 0) {
            Alert.alert('Title, Author and Pages are mandatory fields');
            return;
        }

        let updatedBookList = fullBookList;

        updatedBookList.push(bookDetails);

        setFullBookList([...updatedBookList]);

        storeBooks(updatedBookList);

        router.back();
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}
            contentContainerStyle={styles.contentContainer}
        >
            <View>
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                    <Image
                        style={styles.image}
                        source={imgUrl !== '' ? { uri: imgUrl } : selectedBook.imageLinks?.thumbnail && selectedBook.imageLinks?.thumbnail !== '' ? { uri: selectedBook.imageLinks.thumbnail } : bookCoverPlaceholder}
                    />
                </TouchableOpacity>
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
                        onChangeText={(value) => setBookDetails({ ...bookDetails, authors: [value] })}
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
                    style={[styles.bigBtn, { backgroundColor: accentColor }]}
                >
                    <View>
                        <Text style={[styles.btnTxt, { fontFamily: `${font}B` }]}>Add Book</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setIsModalVisible(false)}
            >
                <View style={[styles.modal, { backgroundColor: isDarkMode ? Colors.dark : Colors.light }]}>
                    <CustomInput
                        label="Image URL"
                        value={imgUrl}
                        onChangeText={(value) => setImgUrl(value)}
                    />
                    <TouchableOpacity
                        onPress={handleImageChange}
                        style={[styles.bigBtn, { backgroundColor: accentColor, alignSelf: 'center' }]}
                    >
                        <Text style={[styles.btnTxt, { fontFamily: `${font}B` }]}>Save</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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
        height: 50,
        // borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },

    btnTxt: {
        fontSize: 16,
        color: Colors.light,
    },

    modal: {
        margin: 'auto',
        width: '90%',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 15,
        borderRadius: 10,
        gap: 15,
    },
});
