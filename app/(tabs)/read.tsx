import { StyleSheet, Text, View, FlatList, Pressable, TextInput, Keyboard, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import React, { useState } from 'react';
import BookItem from '@/components/bookItem';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useFontsContext } from '@/providers/fontProvider';
import BookSearchItem from '@/components/bookSearchItem';
import { getBookDetails } from '@/helpers/getBookDetails';
import axios from 'axios';
import { router } from 'expo-router';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import { blankBook } from '@/helpers/blankBookDetails';
import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { getBookList } from '@/helpers/getBookList';

const Read = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [font, setFont] = useFontsContext();

    const [selectedBook, setSelectedBook] = useSelectedBookContext();

    const [hidePlusBtn, setHidePlusBtn] = useState(false);

    const [firstModal, setFirstModal] = useState(false);

    const [searchModal, setSearchModal] = useState(false);

    const [title, setTitle] = useState('');

    const [isSearchActive, setIsSearchActive] = useState(false);

    const [bookSearchResults, setBookSearchResults] = useState<BookSearchResultProp[]>([]);

    const [fullBookList, setFullBookList] = useFullBookListContext();

    function handleAddBook() {
        setFirstModal(true);
    }

    async function handleBookSearch(title: string) {
        Keyboard.dismiss();
        setIsSearchActive(true);
        const data = await getBookDetails(title);
        setBookSearchResults(await data);
    }

    async function handleBookSelection(url: string, state: string) {
        const res = await axios.get(url);
        setSelectedBook(await res.data.volumeInfo);
        Keyboard.dismiss();
        setSearchModal(false);
        router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: state } });
    }

    function addBookManually(state: string) {
        setSelectedBook(blankBook);
        Keyboard.dismiss();
        setFirstModal(false);
        router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: state } });
    }

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.white }]}>
            <FlatList
                keyExtractor={(_, index) => index.toString()}
                data={fullBookList}
                extraData={fullBookList}
                renderItem={({ item }) => <View>{item.state === 'READ' ? <BookItem data={item} /> : null}</View>}
                ListFooterComponent={() => <View style={{ height: 10 }} />}
                // onScrollBeginDrag={() => setHidePlusBtn(true)}
                // onScrollEndDrag={() => setHidePlusBtn(false)}
                onMomentumScrollBegin={() => setHidePlusBtn(true)}
                onMomentumScrollEnd={() => setHidePlusBtn(false)}
            />
            <Pressable
                onPress={handleAddBook}
                style={styles.plusIcon}
            >
                {hidePlusBtn ? null : (
                    <AntDesign
                        name="pluscircle"
                        size={55}
                        color={accentColor}
                    />
                )}
            </Pressable>
            <Modal
                isVisible={firstModal}
                onBackdropPress={() => setFirstModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? accentColor : Colors.light }]}>
                    <Text style={[styles.modalHeader, { fontFamily: `${font}B` }]}>Add Book</Text>
                    <View style={styles.modalButtonContainer}>
                        <Pressable
                            onPress={() => addBookManually('READ')}
                            style={styles.modalButton}
                        >
                            <AntDesign
                                name="edit"
                                size={25}
                            />
                            <Text style={{ fontFamily: `${font}B` }}>Add Manually</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                setFirstModal(false);
                                setSearchModal(true);
                            }}
                            style={styles.modalButton}
                        >
                            <AntDesign
                                name="search1"
                                size={25}
                            />
                            <Text style={{ fontFamily: `${font}B` }}>Search Title</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal
                isVisible={searchModal}
                onBackdropPress={() => setSearchModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? accentColor : Colors.light }]}>
                    <Text style={[styles.modalHeader, { fontFamily: `${font}B` }]}>Enter the title</Text>
                    <TextInput
                        style={[styles.modalSearchInput, { fontFamily: `${font}B` }]}
                        value={title}
                        onChangeText={(value) => setTitle(value)}
                        onSubmitEditing={() => handleBookSearch(title)}
                    />
                    <Pressable
                        onTouchStart={() => handleBookSearch(title)}
                        style={styles.searchContainer}
                    >
                        <Text style={[{ fontFamily: `${font}B` }]}>SEARCH</Text>
                    </Pressable>
                    {isSearchActive && (
                        <ScrollView
                            style={styles.modalScrollView}
                            contentContainerStyle={{ width: '90%' }}
                        >
                            {bookSearchResults.map((book) => (
                                <View key={book.id}>
                                    <BookSearchItem
                                        book={book}
                                        onPress={() => handleBookSelection(book.selfLink, 'READ')}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </Modal>
        </View>
    );
};

export default Read;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    plusIcon: {
        position: 'absolute',
        right: 30,
        bottom: 20,
    },

    modalContainer: {
        alignItems: 'center',
        borderRadius: 20,
        padding: 15,
        paddingBottom: 40,
        gap: 20,
    },

    modalHeader: {
        fontSize: 25,
    },

    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },

    modalButton: {
        width: 130,
        height: 130,
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },

    modalSearchInput: {
        borderWidth: 1,
        width: '75%',
        borderRadius: 10,
        paddingVertical: 3,
        paddingHorizontal: 15,
    },

    searchContainer: {
        borderWidth: 1,
        paddingHorizontal: 25,
        paddingVertical: 5,
        borderRadius: 10,
    },

    modalScrollView: {
        height: 300,
    },
});
