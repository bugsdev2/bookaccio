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
import { blankBook } from '@/helpers/blankBookDetails';
import BookSearchItem from '@/components/bookSearchItem';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import { router } from 'expo-router';
import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { getBookList } from '@/helpers/getBookList';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { getBookByIsbn } from '@/helpers/getBookByIsbn';
import BarcodeZxingScan from 'rn-barcode-zxing-scan';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [selectedBook, setSelectedBook] = useSelectedBookContext();

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
    } else {
      Alert.alert('Book not found', "Sorry! Your book isn't in the database. You will have to add the book manually");
    }
  }

  async function handleBookSearchByIsbn(isbn: string) {
    Keyboard.dismiss();
    if (isbn === '') return;
    const data = await getBookByIsbn(isbn);
    if (data) {
      setSelectedBook(data?.volumeInfo);
      setIsbnModal(false);
      router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: 'READING' } });
    } else {
      Alert.alert('Book Not Found', 'Try searching with the title or add the book manually.');
    }
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

  const barcodeScanned = async (barcode: string) => {
    const data = await getBookByIsbn(barcode);
    if (data) {
      setSelectedBook(data?.volumeInfo);
      setLoadingAnimation(false);
      router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: 'READING' } });
    } else {
      setLoadingAnimation(false);
      Alert.alert('Book Not Found', 'Try searching with the title or add the book manually.');
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
    // router.push({ pathname: '/(scanner)/[barcodeScanner]', params: { barcodeScanner: 'READING' } });
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.white }]}>
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
              onPress={() => addBookManually('READING')}
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
              <Text style={{ fontFamily: `${font}B` }}>Get Book by ISBN</Text>
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
              <Text style={{ fontFamily: `${font}B` }}>Scan Barcode</Text>
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
            <Text style={[{ fontFamily: `${font}B` }]}>SEARCH</Text>
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
                    onPress={() => handleBookSelection(book.selfLink, 'READING')}
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
          <Text style={[styles.modalHeader, { fontFamily: `${font}B` }]}>Enter the ISBN</Text>
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
            <Text style={[{ fontFamily: `${font}B` }]}>GET</Text>
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
