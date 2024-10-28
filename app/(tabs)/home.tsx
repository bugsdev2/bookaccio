import { StyleSheet, Text, View, FlatList, Pressable, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import BookItem from '@/components/bookItem';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { getBookList } from '@/helpers/getBookList';
import Modal from 'react-native-modal';
import { useFontsContext } from '@/providers/fontProvider';

const Home = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [font, setFont] = useFontsContext();

    const [hidePlusBtn, setHidePlusBtn] = useState(false);

    const [bookList, setBookList] = useState<BookItem[]>();

    const [firstModal, setFirstModal] = useState(false);
    const [manualModal, setManualModal] = useState(false);
    const [searchModal, setSearchModal] = useState(false);

    useEffect(() => {
        getBookList().then((data) => {
            setBookList(data);
        });
    }, []);

    function handleAddBook() {
        setFirstModal(true);
    }

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.white }]}>
            <FlatList
                keyExtractor={(_, index) => index.toString()}
                data={bookList}
                renderItem={({ item }) => <View>{item.state === 'READING' ? <BookItem data={item} /> : null}</View>}
                ListFooterComponent={() => <View style={{ height: 10 }} />}
                // onScrollBeginDrag={() => setHidePlusBtn(true)}
                // onScrollEndDrag={() => setHidePlusBtn(false)}
                onMomentumScrollBegin={() => setHidePlusBtn(true)}
                onMomentumScrollEnd={() => setHidePlusBtn(false)}
            ></FlatList>
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
                            onPress={() => {
                                setFirstModal(false);
                                setManualModal(true);
                            }}
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
                isVisible={manualModal}
                onBackdropPress={() => setManualModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? accentColor : Colors.light }]}>
                    <Text>Manual Modal</Text>
                </View>
            </Modal>
            <Modal
                isVisible={searchModal}
                onBackdropPress={() => setSearchModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? accentColor : Colors.light }]}>
                    <Text>Enter the title</Text>
                    <TextInput style={[styles.modalSearchInput]} />
                    <Pressable style={styles.searchContainer}>
                        <Text>SEARCH</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
};

export default Home;

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
});
