import { StyleSheet, Text, View, FlatList, Pressable, TextInput, ScrollView, Keyboard, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import BookItem from '@/components/bookItem';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import Modal from 'react-native-modal';
import { useFontsContext } from '@/providers/fontProvider';
import { getBookDetails } from '@/helpers/getBookDetails';
import axios from 'axios';
import BookSearchItem from '@/components/bookSearchItem';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import { router } from 'expo-router';
import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { getBookList } from '@/helpers/getBookList';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { getBookByIsbn } from '@/helpers/getBookByIsbn';
import BarcodeZxingScan from 'rn-barcode-zxing-scan';
import { useBlackThemeContext } from '@/providers/blackThemeProvider';
import { BookState } from '@/constants/bookState';
import { useTranslation } from 'react-i18next';
import { getBookDetailsOL } from '@/helpers/getBookDetailsOL';
import BookSearchItemOL from '@/components/bookSearchItemsOL';
import { useSelectedBookOLContext } from '@/providers/selectedBookOLProvider';
import { useBookSourceContext } from '@/providers/bookSourceProvider';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [selectedBook, setSelectedBook] = useSelectedBookContext();

  // const [selectedBookOL, setSelectedBookOL] = useSelectedBookOLContext();

  const [isBlackTheme, setIsBlackTheme] = useBlackThemeContext();

  // const [bookSource, setBookSource] = useBookSourceContext();

  const [font, setFont] = useFontsContext();

  const [hidePlusBtn, setHidePlusBtn] = useState(false);

  const [firstModal, setFirstModal] = useState(false);

  const [searchModal, setSearchModal] = useState(false);

  const [isbnModal, setIsbnModal] = useState(false);

  const [title, setTitle] = useState('');

  const [isbn, setIsbn] = useState('');

  const [isSearchActive, setIsSearchActive] = useState(false);

  const [bookSearchResults, setBookSearchResults] = useState<BookSearchResultProp[]>([]);

  const [bookSearchResultsOL, setBookSearchResultsOL] = useState<OLBookSearchResults[]>([]);

  const [fullBookList, setFullBookList] = useFullBookListContext();

  const [loadingAnimation, setLoadingAnimation] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    getBookList().then((data) => {
      setFullBookList([...data]);
    });
  }, []);

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
      setBookSearchResultsOL([]);
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
      router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: BookState.READING } });
    } else {
      Alert.alert(t('book-not-found'), t('try-search-or-add'));
    }
  }

  // async function handleBookSelectionOL(isbn: string, state: string) {
  //   const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`;
  //   try {
  //     const res = await axios.get(url);
  //     setSelectedBookOL(res.data[`ISBN:${isbn}`]);
  //     setSelectedBook({});
  //     setLoadingAnimation(false);
  //     Keyboard.dismiss();
  //     setSearchModal(false);
  //     router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: state } });
  //   } catch (err) {
  //     setLoadingAnimation(false);
  //     Alert.alert(t('book-not-found'), t('try-search-or-add'));
  //   }
  // }

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
      router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: BookState.READING } });
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
        renderItem={({ item }) => <View>{item.state === BookState.READING ? <BookItem data={item} /> : null}</View>}
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
              onPress={() => addBookManually(BookState.READING)}
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
                    onPress={() => handleBookSelection(book.selfLink, BookState.READING)}
                  />
                </View>
              ))}
              {/* {bookSearchResultsOL?.map((book) => (
                <View key={book.key}>
                  <BookSearchItemOL
                    book={book}
                    onPress={() => handleBookSelectionOL(book.isbn[0], BookState.READING)}
                  />
                </View>
              ))} */}
            </ScrollView>
          )}
          {/* {isSearchActive && bookSearchResults.length === 0 && (
            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={{ width: '90%' }}
            >
              {bookSearchResultsOL?.map((book) => (
                <View key={book.key}>
                  <BookSearchItemOL
                    book={book}
                    onPress={() => handleBookSelectionOL(book.isbn[0], BookState.READING)}
                  />
                </View>
              ))}
            </ScrollView>
          )} */}
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

export default Home;

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
    paddingHorizontal: 5,
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
