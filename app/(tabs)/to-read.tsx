import { StyleSheet, Text, View, FlatList, Pressable, ScrollView, TextInput, Keyboard, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import BookItem from '@/components/bookItem';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import BookSearchItem from '@/components/bookSearchItem';
import { getBookDetails } from '@/helpers/getBookDetails';
import axios from 'axios';
import { router } from 'expo-router';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import { useFontsContext } from '@/providers/fontProvider';
import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { getBookByIsbn } from '@/helpers/getBookByIsbn';
import BarcodeZxingScan from 'rn-barcode-zxing-scan';
import { useBlackThemeContext } from '@/providers/blackThemeProvider';
import { BookState } from '@/constants/bookState';
import { useTranslation } from 'react-i18next';

const ToRead = () => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [selectedBook, setSelectedBook] = useSelectedBookContext();

  const [isBlackTheme, setIsBlackTheme] = useBlackThemeContext();

  const [font, setFont] = useFontsContext();

  const [hidePlusBtn, setHidePlusBtn] = useState(false);

  const [firstModal, setFirstModal] = useState(false);

  const [searchModal, setSearchModal] = useState(false);

  const [isbnModal, setIsbnModal] = useState(false);

  const [title, setTitle] = useState('');

  const [isbn, setIsbn] = useState('');

  const [isSearchActive, setIsSearchActive] = useState(false);

  const [bookSearchResults, setBookSearchResults] = useState<BookSearchResultProp[]>([]);

  const [fullBookList, setFullBookList] = useFullBookListContext();

  const [loadingAnimation, setLoadingAnimation] = useState(false);

  const { t } = useTranslation();

  function handleAddBook() {
    setFirstModal(true);
  }

  async function handleBookSearch(title: string) {
    Keyboard.dismiss();
    if (title === '') return;
    const data = await getBookDetails(title);
    if (data) {
      setIsSearchActive(true);
      setBookSearchResults(await data);
    } else {
      Alert.alert(t('book-not-found'), t('no-book-add-manually'));
    }
  }

  async function handleBookSearchByIsbn(isbn: string) {
    Keyboard.dismiss();
    if (isbn === '') return;
    const data = await getBookByIsbn(isbn);
    if (data) {
      setSelectedBook(data);
      setIsbnModal(false);
      router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: BookState.READ_LATER } });
    } else {
      Alert.alert(t('book-not-found'), t('try-search-or-add'));
    }
  }

  async function handleBookSelection(url: string, state: string) {
    const res = await axios.get(url);
    setSelectedBook(await res.data);
    Keyboard.dismiss();
    setSearchModal(false);
    router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: state } });
  }

  function addBookManually(state: string) {
    setSelectedBook({});
    Keyboard.dismiss();
    setFirstModal(false);
    router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: state } });
  }

  const barcodeScanned = async (barcode: string) => {
    const data = await getBookByIsbn(barcode);
    if (data) {
      setSelectedBook(data);
      setLoadingAnimation(false);
      router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: BookState.READ_LATER } });
    } else {
      setLoadingAnimation(false);
      Alert.alert(t('book-not-found'), t('try-search-or-add'));
    }
  };

  function handleBarcodeSearch() {
    BarcodeZxingScan.showQrReader(async (error: any, data: any) => {
      if (error) {
        console.log('Error:', error);
        return;
      } else {
        setLoadingAnimation(true);
        barcodeScanned(data);
      }
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.white }]}>
      <ActivityIndicator
        style={styles.activitiyIndicator}
        animating={loadingAnimation}
        size={'large'}
        color={accentColor}
      />
      <FlatList
        keyExtractor={(_, index) => index.toString()}
        data={fullBookList}
        extraData={fullBookList}
        renderItem={({ item }) => <View>{item.state === BookState.READ_LATER ? <BookItem data={item} /> : null}</View>}
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
          <Text style={[styles.modalHeader, { fontFamily: `${font}B` }]}>{t('add-book')}</Text>
          <View style={styles.modalButtonContainer}>
            <Pressable
              onPress={() => addBookManually(BookState.READ_LATER)}
              style={styles.modalButton}
            >
              <AntDesign
                name="edit"
                size={25}
              />
              <Text style={{ fontFamily: `${font}B`, textAlign: 'center' }}>{t('add-manually')}</Text>
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
              <Text style={{ fontFamily: `${font}B`, textAlign: 'center' }}>{t('search-title')}</Text>
            </Pressable>
          </View>
          <View style={styles.modalButtonContainer}>
            <Pressable
              onPress={() => {
                setFirstModal(false);
                setIsbnModal(true);
              }}
              style={styles.modalButton}
            >
              <Entypo
                name="book"
                size={30}
              />
              <Text style={{ fontFamily: `${font}B`, textAlign: 'center' }}>{t('get-book')}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setFirstModal(false);
                handleBarcodeSearch();
              }}
              style={styles.modalButton}
            >
              <AntDesign
                name="barcode"
                size={30}
              />
              <Text style={{ fontFamily: `${font}B`, textAlign: 'center' }}>{t('scan-barcode')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={searchModal}
        onBackdropPress={() => setSearchModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? accentColor : Colors.light }]}>
          <Text style={[styles.modalHeader, { fontFamily: `${font}B` }]}>{t('enter-title')}</Text>
          <View style={styles.modalSearchInputContainer}>
            <TextInput
              style={[styles.modalSearchInput, { fontFamily: `${font}B` }]}
              value={title}
              onChangeText={(value) => setTitle(value)}
              onSubmitEditing={() => handleBookSearch(title)}
            />
            <Pressable onPress={() => setTitle('')}>
              <MaterialIcons
                name="close"
                size={20}
              />
            </Pressable>
          </View>
          <Pressable
            onTouchStart={() => handleBookSearch(title)}
            style={styles.searchContainer}
          >
            <Text style={[{ fontFamily: `${font}B` }]}>{t('search').toUpperCase()}</Text>
          </Pressable>
          {isSearchActive && (
            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={{ width: '90%' }}
            >
              {bookSearchResults?.map((book) => (
                <View key={book.id}>
                  <BookSearchItem
                    book={book}
                    onPress={() => handleBookSelection(book.selfLink, BookState.READ_LATER)}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
      <Modal
        isVisible={isbnModal}
        onBackdropPress={() => setIsbnModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? accentColor : Colors.light }]}>
          <Text style={[styles.modalHeader, { fontFamily: `${font}B` }]}>{t('enter-isbn')}</Text>
          <View style={styles.modalSearchInputContainer}>
            <TextInput
              style={[styles.modalSearchInput, { fontFamily: `${font}B` }]}
              value={isbn}
              onChangeText={(value) => setIsbn(value)}
              onSubmitEditing={() => handleBookSearchByIsbn(isbn)}
              keyboardType="numeric"
            />
            <Pressable onPress={() => setIsbn('')}>
              <MaterialIcons
                name="close"
                size={20}
              />
            </Pressable>
          </View>
          <TouchableOpacity
            onPressIn={() => handleBookSearchByIsbn(isbn)}
            style={styles.searchContainer}
          >
            <Text style={[{ fontFamily: `${font}B` }]}>{t('get').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ToRead;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  activitiyIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
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

  modalSearchInputContainer: {
    borderWidth: 1,
    width: '75%',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  modalSearchInput: {
    flex: 1,
    paddingHorizontal: 5,
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
