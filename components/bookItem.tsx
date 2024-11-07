import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Pressable } from 'react-native';
import React, { useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import * as Progress from 'react-native-progress';
import { useFontsContext } from '@/providers/fontProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { router } from 'expo-router';
import Modal from 'react-native-modal';
import { getBookList } from '@/helpers/getBookList';
import { storeBooks } from '@/helpers/storeBooks';
import { useFullBookListContext } from '@/providers/booksFullListProvider';

const bookCoverPlaceholder = require('@/assets/images/others/book-cover-placeholder.png');

const BookItem = ({ data }: { data: Book }) => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [fullBookList, setFullBookList] = useFullBookListContext();

    const [selectedLocalBook, setSelectedLocalBook] = useState();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [font, setFont] = useFontsContext();

    const percentCompleted = Math.round((Number(data.currentPage) / Number(data.pageCount)) * 100);

    const deleteBook = (id: number) => {
        fullBookList.map((book) => {
            if (book.id === id) {
                fullBookList.splice(fullBookList.indexOf(book), 1);
            }
        });

        setFullBookList([...fullBookList]);

        storeBooks(fullBookList).then(() => {
            setIsModalVisible(false);
        });
    };

    function handleMoveBook({ id, state }: { id: number; state: 'READ' | 'READING' | 'READ_LATER' }) {
        fullBookList.map((book) => {
            if (book.id === id) {
                book.state = state;
            }
        });

        setFullBookList([...fullBookList]);

        storeBooks(fullBookList).then(() => {
            setIsModalVisible(false);
        });
    }

    function handleModalMenus({ id, state }: { id: number; state: 'READ' | 'READING' | 'READ_LATER' | undefined }) {
        switch (state) {
            case 'READING':
                return (
                    <>
                        <TouchableOpacity onPress={() => handleMoveBook({ id, state: 'READ' })}>
                            <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>Move to Done</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleMoveBook({ id, state: 'READ_LATER' })}>
                            <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>Move to Read Later</Text>
                        </TouchableOpacity>
                    </>
                );
                break;
            case 'READ':
                return (
                    <>
                        <TouchableOpacity onPress={() => handleMoveBook({ id, state: 'READING' })}>
                            <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>Move to Reading</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleMoveBook({ id, state: 'READ_LATER' })}>
                            <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>Move to Read Later</Text>
                        </TouchableOpacity>
                    </>
                );
                break;
            case 'READ_LATER':
                return (
                    <>
                        <TouchableOpacity onPress={() => handleMoveBook({ id, state: 'READ' })}>
                            <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>Move to Done</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleMoveBook({ id, state: 'READING' })}>
                            <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>Move to Reading</Text>
                        </TouchableOpacity>
                    </>
                );
                break;
            default:
                return <></>;
        }
    }

    function handleDeleteBook(title: string | undefined, id: number) {
        Alert.alert(`This will delete ${title} from your library.`, 'Are you sure you want to continue?', [
            {
                text: 'Yes',
                onPress: () => deleteBook(id),
            },
            {
                text: 'No',
            },
        ]);
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
                        <View>
                            <Text
                                numberOfLines={1}
                                style={[styles.title, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}B` }]}
                            >
                                {data.title?.toUpperCase()}
                            </Text>
                            <Text
                                numberOfLines={1}
                                style={[styles.subtitle, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}R` }]}
                            >
                                {data?.subtitle}
                            </Text>
                        </View>
                        <View>
                            <Text style={[styles.author, { color: isDarkMode ? Colors.gray : Colors.dark, fontFamily: `${font}R` }]}>{data.authors && data.authors[0]}</Text>
                        </View>
                    </View>
                    <View style={[styles.endContent, { justifyContent: data.state === 'READING' ? 'space-around' : 'flex-start' }]}>
                        <Pressable
                            style={styles.threeDots}
                            onPress={() => setIsModalVisible(true)}
                        >
                            <Entypo
                                name="dots-three-horizontal"
                                size={18}
                                color={isDarkMode ? Colors.light : Colors.dark}
                            />
                        </Pressable>
                        {data.state === 'READING' ? <Text style={[styles.percent, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}R` }]}>{percentCompleted}%</Text> : null}
                    </View>
                </View>
            </TouchableOpacity>
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setIsModalVisible(false)}
            >
                <View style={[styles.modal, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}>
                    <Image
                        style={styles.imageModal}
                        source={data.imageLinks.thumbnail !== '' ? { uri: data.imageLinks.thumbnail } : bookCoverPlaceholder}
                    />
                    <View>
                        <Text style={[styles.modalTitle, { color: isDarkMode ? Colors.light : Colors.dark }]}>{data?.title}</Text>
                    </View>
                    <View style={styles.modalTextContainer}>
                        {handleModalMenus({ id: data.id, state: data.state })}
                        <TouchableOpacity onPress={() => handleDeleteBook(data.title, data.id)}>
                            <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>Delete Book</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        height: 80,
        borderRadius: 5,
    },

    imageModal: {
        width: 90,
        height: 130,
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
        justifyContent: 'space-between',
    },

    endContent: {
        marginLeft: 'auto',
        // flexDirection: 'row',
        alignItems: 'flex-end',
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

    threeDots: {
        padding: 5,
        // borderWidth: 1,
        height: 50,
    },

    modal: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        width: '90%',
        height: '55%',
        margin: 'auto',
        padding: 20,
    },

    modalTitle: {
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center',
    },

    modalTextContainer: {
        marginTop: 20,
        gap: 20,
    },

    modalText: {
        fontSize: 17,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'center',
        color: Colors.black,
    },
});
