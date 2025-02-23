import { StyleSheet, Text, View, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useFontsContext } from '@/providers/fontProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import CustomInput from '@/components/customInput';
import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import bookCoverPlaceholder from '../../assets/images/others/book-cover-placeholder.png';

import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { storeBooks } from '@/helpers/storeBooks';
import { processUrl } from '@/helpers/processUrl';
import { getBookList } from '@/helpers/getBookList';
import { useBlackThemeContext } from '@/providers/blackThemeProvider';
import { BookState, BookStateStringProps } from '@/constants/bookState';
import { useTranslation } from 'react-i18next';
import { useSelectedBookOLContext } from '@/providers/selectedBookOLProvider';

const AddNewBook = () => {
  const { addBook }: { addBook: BookStateStringProps } = useLocalSearchParams();

  if (Array.isArray(addBook)) {
    throw new Error("Custom addBook mustn't be an Array Error");
  }

  const [font, setFont] = useFontsContext();

  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [selectedBook, setSelectedBook] = useSelectedBookContext();

  // const [selectedBookOL, setSelectedBookOL] = useSelectedBookOLContext();

  const [fullBookList, setFullBookList] = useFullBookListContext();

  const [isBlackTheme, setIsBlackTheme] = useBlackThemeContext();

  const [isFirstModalVisible, setIsFirstModalVisible] = useState(false);

  const [isUrlModalVisible, setIsUrlModalVisible] = useState(false);

  const [imgUrl, setImgUrl] = useState('');

  const { t } = useTranslation();

  useEffect(() => {
    getBookList().then((data) => {
      setFullBookList([...data]);
    });
  }, []);

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
    title: selectedBook.volumeInfo?.title ? selectedBook.volumeInfo.title : '',
    subtitle: selectedBook.volumeInfo?.subtitle ? selectedBook.volumeInfo?.subtitle : '',
    authors: selectedBook.volumeInfo?.authors ? selectedBook.volumeInfo?.authors : [''],
    categories: selectedBook.volumeInfo?.categories ? selectedBook.volumeInfo?.categories : [''],
    pageCount: selectedBook.volumeInfo?.pageCount ? selectedBook.volumeInfo?.pageCount : 0,
    description: selectedBook.volumeInfo?.description ? selectedBook.volumeInfo?.description : '',
    imageLinks: {
      thumbnail: selectedBook.volumeInfo?.imageLinks ? selectedBook.volumeInfo?.imageLinks.thumbnail : '',
    },
    currentPage: 0,
    state: addBook,
    startDate: Date.parse(new Date().toString()),
    endDate: Date.parse(new Date().toString()),
    publishedDate: selectedBook.volumeInfo?.publishedDate ? selectedBook.volumeInfo?.publishedDate.slice(0, 4) : '',
    language: selectedBook.volumeInfo?.language,
    publisher: selectedBook.volumeInfo?.publisher,
    isbn: selectedBook.volumeInfo?.industryIdentifiers && selectedBook.volumeInfo?.industryIdentifiers[1]?.identifier ? selectedBook.volumeInfo?.industryIdentifiers[1]?.identifier : '',
    translator: '',
    originalTitle: '',
    notes: '',
    review: '',
  });

  const statusData: { title: string; value: BookStateStringProps }[] = [
    { title: t('reading'), value: BookState.READING },
    { title: t('read-later'), value: BookState.READ_LATER },
    { title: t('read'), value: BookState.READ },
    { title: t('unfinished'), value: BookState.UNFINISHED },
  ];

  function selectedText() {
    switch (bookDetails.state) {
      case BookState.READ:
        return t('read');

      case BookState.READING:
        return t('reading');

      case BookState.READ_LATER:
        return t('read-later');

      case BookState.UNFINISHED:
        return t('unfinished');
    }
  }

  function handleImageChange() {
    setBookDetails({ ...bookDetails, imageLinks: { thumbnail: imgUrl } });
    setIsUrlModalVisible(false);
  }

  async function handleGalleryImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      aspect: [10, 16],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImgUrl(result.assets[0].uri);
      setBookDetails({ ...bookDetails, imageLinks: { thumbnail: result.assets[0].uri } });
    }
  }

  function handleAddBook() {
    if (bookDetails.title === '' || bookDetails.authors[0] === '' || bookDetails.pageCount === 0) {
      Alert.alert(t('error'), t('title-mandatory'));
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
      style={[styles.container, { backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.light }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View>
        <TouchableOpacity onPress={() => setIsFirstModalVisible(true)}>
          <Image
            style={styles.image}
            source={imgUrl !== '' ? { uri: processUrl(imgUrl) } : bookDetails.imageLinks.thumbnail ? { uri: processUrl(bookDetails.imageLinks.thumbnail) } : bookCoverPlaceholder}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.detailsContainer, { borderColor: isDarkMode ? Colors.gray : Colors.dark }]}>
        <View>
          <CustomInput
            label={t('title')}
            value={bookDetails.title !== undefined ? bookDetails.title : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, title: value })}
          />
        </View>
        <View>
          <CustomInput
            label={t('author')}
            value={bookDetails.authors[0]}
            onChangeText={(value) => setBookDetails({ ...bookDetails, authors: [value] })}
          />
        </View>
        <View>
          <CustomInput
            label={t('pages')}
            value={bookDetails.pageCount.toString()}
            onChangeText={(value) => {
              if (value.trim() !== '') {
                setBookDetails({ ...bookDetails, pageCount: parseInt(value) });
              } else {
                setBookDetails({ ...bookDetails, pageCount: 0 });
              }
            }}
            inputMode="numeric"
          />
        </View>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { fontFamily: `${font}B`, backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.light, color: accentColor, zIndex: 1 }]}>{t('status')}</Text>
          <Dropdown
            style={[styles.dropDownField, { backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.light, borderColor: isDarkMode ? Colors.gray : Colors.dark }]}
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
          <Text style={[styles.title, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('optional-details')}</Text>
        </View>
        <View>
          <CustomInput
            label={t('isbn')}
            value={bookDetails.isbn ? bookDetails.isbn : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, isbn: value })}
          />
        </View>
        <View>
          <CustomInput
            label={t('subtitle')}
            value={bookDetails.subtitle ? bookDetails.subtitle : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, subtitle: value })}
          />
        </View>
        <View>
          <CustomInput
            label={t('category')}
            value={bookDetails.categories ? bookDetails.categories[0] : ['']}
            onChangeText={(value) => setBookDetails({ ...bookDetails, categories: [value] })}
          />
        </View>

        <View>
          <CustomInput
            label={t('published-year')}
            value={bookDetails.publishedDate ? bookDetails.publishedDate : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, publishedDate: value })}
            inputMode="numeric"
          />
        </View>
        <View>
          <CustomInput
            label={t('original-title')}
            value={bookDetails.originalTitle ? bookDetails.originalTitle : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, originalTitle: value })}
          />
        </View>
        <View>
          <CustomInput
            label={t('translator')}
            value={bookDetails.translator ? bookDetails.translator : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, translator: value })}
          />
        </View>
        <View>
          <CustomInput
            label={t('description')}
            value={bookDetails.description ? bookDetails.description : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, description: value })}
            multiline={true}
          />
        </View>
        <View>
          <CustomInput
            label={t('review')}
            value={bookDetails.review ? bookDetails.review : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, review: value })}
            multiline={true}
          />
        </View>
        <View>
          <CustomInput
            label={t('notes')}
            value={bookDetails.notes ? bookDetails.notes : ''}
            onChangeText={(value) => setBookDetails({ ...bookDetails, notes: value })}
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
            <Text style={[styles.btnTxt, { fontFamily: `${font}B` }]}>{t('add-book')}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isFirstModalVisible}
        onBackdropPress={() => setIsFirstModalVisible(false)}
      >
        <View style={[styles.modal, { backgroundColor: accentColor }]}>
          <View style={[styles.largeBtnContainer]}>
            <TouchableOpacity
              style={[styles.largeBtn]}
              onPress={() => {
                setIsFirstModalVisible(false);
                setIsUrlModalVisible(true);
              }}
            >
              <Text style={[styles.largeBtnTxt, { fontFamily: `${font}B` }]}>{t('set-image-url')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.largeBtn]}
              onPress={() => {
                setIsFirstModalVisible(false);
                handleGalleryImage();
              }}
            >
              <Text style={[styles.largeBtnTxt, { fontFamily: `${font}B` }]}>{t('select-image-gallery')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isUrlModalVisible}
        onBackdropPress={() => setIsUrlModalVisible(false)}
      >
        <View style={[styles.modal, { backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.black : Colors.light, borderColor: isDarkMode ? Colors.gray : Colors.dark }]}>
          <CustomInput
            label="Image URL"
            value={imgUrl}
            onChangeText={(value) => setImgUrl(value)}
          />
          <TouchableOpacity
            onPress={handleImageChange}
            style={[styles.bigBtn, { backgroundColor: accentColor, alignSelf: 'center' }]}
          >
            <Text style={[styles.btnTxt, { fontFamily: `${font}B` }]}>{t('save')}</Text>
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
    borderWidth: 1,
  },

  largeBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  largeBtn: {
    height: 125,
    width: 125,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },

  largeBtnTxt: {
    fontSize: 17,
    textAlign: 'center',
  },
});
